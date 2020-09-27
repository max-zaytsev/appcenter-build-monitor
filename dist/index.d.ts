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
export declare class AppCenterBuildMonitor {
    private readonly appName;
    private readonly ownerName;
    private readonly apiClient;
    constructor(appName: string, ownerName: string, token: string);
    getBuildById: (buildId: number) => Promise<Build>;
    getBranches: () => Promise<BranchConfiguration[]>;
    startBuild: (branchName: string, sourceVersion: string) => Promise<Build>;
    startBuildsOnAllBranches: () => Promise<void>;
    showReport: (build: Build) => void;
    updateStatus: (startedBuilds: Build[]) => Promise<void>;
}
