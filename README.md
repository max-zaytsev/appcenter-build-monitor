> Receives list of branches for the appcenter application, build them, and print the build status report

## Install

```
npm install appcenter-build-monitoring
```

## Usage

### Start builds on configured branches and monitor results

```js
const { AppCenterBuildMonitor } = require("appcenter-build-monitoring");

const ab = new AppCenterBuildMonitor("AppName", "UserName", "APItoken");

ab.startBuildsOnConfiguredBranches();
```

### Results

```
Build 37 was started for branch3
Build 36 was started for master
master build 36 failed in 64.34 sec. Link to build logs https://appcenter.ms/users/username-microsoft.com/apps/appname/build/branches/master/builds/36
branch3 build 37 failed in 49.455 sec. Link to build logs https://appcenter.ms/users/username-microsoft.com/apps/appname/build/branches/branch3/builds/37
```

### Start builds and update monitoring with a time a specific time interval

```js
const abWithTimeInterval = new AppCenterBuildMonitor(
  "AppName",
  "UserName",
  "APItoken",
  10000
);

abWithTimeInterval.startBuildsOnConfiguredBranches();
```
