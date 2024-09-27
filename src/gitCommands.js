const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const config = require("./config");
const logger = require("./config/logger");

// Function to execute Git commands
function runCommand(command, repoPath) {
  return new Promise((resolve, reject) => {
    exec(command, { cwd: repoPath }, (error, stdout, stderr) => {
      if (error) {
        logger.error(`Error: ${error.message}`);
        reject(error);
      }
      if (stderr) {
        logger.info(`Stderr: ${stderr}`);
      }
      logger.info(`Output: ${stdout}`);
      resolve(stdout);
    });
  });
}

// Function to clone the repository
async function cloneRepository(gitUrl) {
  const repoName = path.basename(gitUrl, ".git");
  const repoPath = path.join(__dirname, repoName);

  // Check if the repository directory already exists
  if (fs.existsSync(repoPath)) {
    logger.error(`Repository already exists at ${repoPath}.`);
    return repoPath; // Return the existing path
  }

  try {
    logger.info("Cloning the repository...");
    await runCommand(`git clone ${gitUrl}`, __dirname);
    return repoPath; // Return the path of the cloned repo
  } catch (error) {
    logger.error("Failed to clone the repository:", error);
    throw error; // Rethrow the error for handling
  }
}

// Function to pull from development and push to production
async function updateBranches(repoPath) {
  try {
    logger.info(`Switching to the ${config.cloneBranch} branch...`);
    await runCommand(`git checkout ${config.cloneBranch}`, repoPath);
    await runCommand(`git pull origin ${config.cloneBranch}`, repoPath);

    logger.info(`Merging ${config.cloneBranch} into ${config.pushBranch}...`);
    await runCommand(`git checkout ${config.pushBranch}`, repoPath);
    await runCommand(`git merge ${config.cloneBranch}`, repoPath);

    logger.info(`Pushing to ${config.pushBranch} branch...`);
    await runCommand(`git push origin ${config.pushBranch}`, repoPath);

    logger.info(`Successfully updated the ${config.pushBranch} branch.`);
  } catch (error) {
    logger.error("Failed to update the branches:", error);
  }
}

// Main function to execute the workflow
async function cloneRepositoryAndUpdateBranched() {
  const gitUrl = config.githubUrl; // Get GitHub URL from .env

  try {
    // Clone the repository and get the repo path
    const repoPath = await cloneRepository(gitUrl);
    logger.info(`Using repository at: ${repoPath}`);

    // Update branches
    await updateBranches(repoPath);
  } catch (error) {
    logger.error("An error occurred:", error);
  }
}
module.exports = cloneRepositoryAndUpdateBranched;
