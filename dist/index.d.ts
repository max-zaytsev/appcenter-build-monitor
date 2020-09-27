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
    private readonly updateStatusInterval;
    private readonly apiClient;
    private MaxUpdateStatusInterval;
    constructor(appName: string, ownerName: string, token: string, updateStatusInterval?: number);
    startBuildsOnConfiguredBranches: () => Promise<void>;
    private updateStatus;
    private showReport;
    private getBuildById;
    private getBranches;
    private startBuild;
}
