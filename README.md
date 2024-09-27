# Git Pull-Push Automation

This project automates the process of pulling changes from a specified branch and pushing them to another branch at scheduled intervals using `node-cron`.

## Features

- Automatically clones a Git repository.
- Pulls changes from a specified branch (e.g., `main`).
- Pushes changes to another branch (e.g., `production`).
- Can be run on a scheduled basis (every 5 seconds or configurable).

## Prerequisites

- Node.js (v12 or later)
- Git installed on your machine
- PM2 (for production environment, optional)

## Installation

### 1. Clone the Repository

```bash
git git@github.com:developer-sujon/git-pull-push-automation.git
cd git-pull-push-automation
```

### 2. Install Dependencies

Install the necessary dependencies by running:

```bash
yarn
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory of your project and add the following variables:

```env
GITHUB_URL=git@github.com:<username>/<repository>
CLONE_BRANCH=main
PUSH_BRANCH=production
CRON_SCHEDULE=*/5 * * * * *  # Runs every 5 seconds
```

- `GITHUB_URL`: The URL of the Git repository to clone.
- `CLONE_BRANCH`: The branch you want to pull changes from (e.g., main).
- `PUSH_BRANCH`: The branch you want to push changes to (e.g., production).
- `CRON_SCHEDULE`: A cron expression to define how often the job runs (in this case, every 5 seconds).

### 4. Configure PM2 (For Production)

For production deployment, you may use PM2 to manage the node process. Create an `ecosystem.config.json` file for PM2 configuration.

```json
{
  "apps": [
    {
      "name": "git-pull-push-automation",
      "script": "src/index.js",
      "watch": true,
      "env": {
        "NODE_ENV": "production"
      }
    }
  ]
}
```

## Usage

### Running in Development Mode

To start the project locally, run the following command:

```bash
npm start
```

This will run the cron job based on the schedule defined in your `.env` file.

### Running in Production Mode with PM2

To run the project in production mode using PM2, execute the following command:

```bash
npm run start:prod
```

This command will use PM2 to restart the application with the configuration from `ecosystem.config.json`.

## Project Structure

```bash
├── src
│   ├── config.js        # Loads and exports environment variables
│   ├── gitCommands.js   # Contains logic for Git operations (clone, pull, push)
│   ├── index.js       # Main file for the cron job
├── .env                 # Environment variables (not included in version control)
├── package.json         # Node.js dependencies and scripts
├── ecosystem.config.json# PM2 configuration for production
└── README.md            # Project documentation
```

### Key Files:

- `src/config.js`: Loads environment variables from `.env` and exports them as an object.
- `src/gitCommands.js`: Contains functions to run Git commands (clone, checkout, pull, merge, push).
- `src/index.js`: The main script that schedules the cron job and performs Git automation.

## Cron Job Configuration

The cron job is scheduled using the `node-cron` package. You can modify the cron schedule by editing the `CRON_SCHEDULE` value in your `.env` file.

Example (run every 5 seconds):

```env
CRON_SCHEDULE=*/5 * * * * *
```

For more information on cron scheduling, refer to the `node-cron` documentation.

## Dependencies

- `dotenv`: Loads environment variables from the `.env` file.
- `node-cron`: Schedules tasks to run at specified intervals.
- `pm2`: (Optional) Process manager for production environments.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
