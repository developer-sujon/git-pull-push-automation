const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const config = require("./config");

// Function to execute Git commands
function runCommand(command, repoPath) {
  return new Promise((resolve, reject) => {
    exec(command, { cwd: repoPath }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        reject(error);
      }
      if (stderr) {
        console.error(`Stderr: ${stderr}`);
      }
      console.log(`Output: ${stdout}`);
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
    console.log(`Repository already exists at ${repoPath}.`);
    return repoPath; // Return the existing path
  }

  try {
    console.log("Cloning the repository...");
    await runCommand(`git clone ${gitUrl}`, __dirname);
    return repoPath; // Return the path of the cloned repo
  } catch (error) {
    console.error("Failed to clone the repository:", error);
    throw error; // Rethrow the error for handling
  }
}

// Function to pull from development and push to production
async function updateBranches(repoPath) {
  try {
    console.log(`Switching to the ${config.cloneBranch} branch...`);
    await runCommand(`git checkout ${config.cloneBranch}`, repoPath);
    await runCommand(`git pull origin ${config.cloneBranch}`, repoPath);

    console.log(`Merging ${config.cloneBranch} into ${config.pushBranch}...`);
    await runCommand(`git checkout ${config.pushBranch}`, repoPath);
    await runCommand(`git merge ${config.cloneBranch}`, repoPath);

    console.log(`Pushing to ${config.pushBranch} branch...`);
    await runCommand(`git push origin ${config.pushBranch}`, repoPath);

    console.log(`Successfully updated the ${config.pushBranch} branch.`);
  } catch (error) {
    console.error("Failed to update the branches:", error);
  }
}

// Main function to execute the workflow
async function cloneRepositoryAndUpdateBranched() {
  const gitUrl = config.githubUrl; // Get GitHub URL from .env

  try {
    // Clone the repository and get the repo path
    const repoPath = await cloneRepository(gitUrl);
    console.log(`Using repository at: ${repoPath}`);

    // Update branches
    await updateBranches(repoPath);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}
module.exports = cloneRepositoryAndUpdateBranched;
