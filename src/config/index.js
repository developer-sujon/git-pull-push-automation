require("dotenv").config();

const config = {
  githubUrl: process.env.GITHUB_URL,
  cloneBranch: process.env.CLONE_BRANCH,
  pushBranch: process.env.PUSH_BRANCH,
  cronSchedule: process.env.CRON_SCHEDULE,
};

module.exports = config;
