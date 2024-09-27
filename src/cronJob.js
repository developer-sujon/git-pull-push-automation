const cron = require("node-cron");
const cloneRepositoryAndUpdateBranched = require("./gitCommands");
const config = require("./config");

// Schedule the task to run using node-cron
function startCronJob() {
  cron.schedule(config.cronSchedule, () => {
    console.log(
      `Running scheduled Git automation at ${new Date().toLocaleString()}...`
    );
    cloneRepositoryAndUpdateBranched(); // Call the cloneRepositoryAndUpdateBranched function
  });

  console.log(
    `Cron job scheduled to run according to the following schedule: ${config.cronSchedule}`
  );
}

module.exports = {
  startCronJob,
};
