import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

export interface Build {
  id: number;
  startTime: string;
  finishTime: string;
  status: string;
  result: string;
  sourceBranch: string;
  sourceVersion: string;
}

export interface Commit {
  sha: string;
}

export interface Branch {
  name: string;
  commit: Commit;
}

export interface BranchConfiguration {
  branch: Branch;
  configured: boolean;
  lastBuild: Build;
}

export class AppCenterBuildMonitor {
  private readonly apiClient: AxiosInstance;
  private MaxUpdateStatusInterval = 10 * 60 * 1000;

  constructor(
    private readonly appName: string,
    private readonly ownerName: string,
    token: string,
    private readonly updateStatusInterval: number = 10 * 1000
  ) {
    if (this.updateStatusInterval <= 0 || this.updateStatusInterval > this.MaxUpdateStatusInterval) {
      throw Error(
        `Invalid argument: updateStatusInterval. Value should be between 0 and ${this.MaxUpdateStatusInterval}`
      );
    }
    const config: AxiosRequestConfig = {
      baseURL: `https://api.appcenter.ms/v0.1/apps/${this.ownerName}/${this.appName}`,
      responseType: "json",
      headers: {
        "Content-Type": "application/json",
        "X-API-Token": token,
      },
    };
    this.apiClient = axios.create(config);
  }

  public startBuildsOnConfiguredBranches = async (): Promise<void> => {
    //Get list of branches
    const branches = await this.getBranches();
    if (!branches.length) {
      throw Error(`There are no branches in ${this.appName} application`);
    }

    const configureBranches = branches.filter(
      (branch) => branch.configured === true
    );
    if (!configureBranches.length) {
      throw Error(`There are no configured branches in ${this.appName} application`);
    }

    //Start builds
    const startBuildRequests = configureBranches.map((branch) =>
      this.startBuild(branch.branch.name, branch.branch.commit.sha)
    );
    const startedBuilds = await Promise.all(startBuildRequests);
    startedBuilds.forEach((build) => {
      console.log(`Build ${build.id} was started for ${build.sourceBranch}`);
    });

    //Monitor started builds
    this.updateStatus(startedBuilds);
  };

  //Updates build statuses for started builds with time interval
  private updateStatus = async (startedBuilds: Build[]): Promise<void> => {
    startedBuilds.forEach((build: Build) => {
      if (build.status === "completed") this.showReport(build);
    });

    const notCompletedJobs = startedBuilds.filter(
      (build: Build) => build.status !== "completed"
    );

    if (!notCompletedJobs.length) {
      return;
    }

    //Get updated status
    const buildRequests = notCompletedJobs.map((build: Build) => {
      return this.getBuildById(build.id);
    });
    const builds = await Promise.all(buildRequests);

    setTimeout(this.updateStatus, this.updateStatusInterval, builds);
  };

  //print a status report for the given build
  private showReport = (build: Build): void => {
    const logsLink = `https://appcenter.ms/users/${this.ownerName}/apps/${this.appName}/build/branches/${build.sourceBranch}/builds/${build.id}`;
    const buildDuration =
      (Date.parse(build.finishTime) - Date.parse(build.startTime)) / 1000;
    console.log(
      `${build.sourceBranch} build ${build.id} ${build.result} in ${buildDuration} sec. Link to build logs ${logsLink}`
    );
  };

  //send request to AppCenter Api to get build details by its id
  private getBuildById = async (buildId: number): Promise<Build> => {
    const response = await this.apiClient.get(`/builds/${buildId}`);
    const build: Build = response.data;
    return build;
  };

  //send request to AppCenter Api to get list of branches
  private getBranches = async (): Promise<BranchConfiguration[]> => {
    const response = await this.apiClient.get(`/branches`);
    const branches: BranchConfiguration[] = response.data;
    return branches;
  };

  //send post request to AppCenter Api in order to start build against the branch
  private startBuild = async (
    branchName: string,
    sourceVersion: string
  ): Promise<Build> => {
    const params = { sourceVersion: sourceVersion };
    const response = await this.apiClient.post(
      `/branches/${branchName}/builds`,
      params
    );
    const build: Build = response.data;
    return build;
  };
}
