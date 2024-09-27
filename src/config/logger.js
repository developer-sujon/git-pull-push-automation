const winston = require("winston");
const path = require("path");

// Define the log file paths relative to the root folder
const logFilePath = path.join(__dirname, "../../logs", "application.log"); // General logs
const exceptionsLogFilePath = path.join(
  __dirname,
  "../../logs",
  "exceptions.log"
); // Exception logs

// Ensure the logs directory exists in the root folder
const fs = require("fs");
const logsDirectory = path.join(__dirname, "../../logs"); // Adjusted path to point to root
if (!fs.existsSync(logsDirectory)) {
  fs.mkdirSync(logsDirectory); // Create logs directory if it doesn't exist
}

// Create a logger instance
const logger = winston.createLogger({
  level: "info", // Default log level
  format: winston.format.combine(
    winston.format.timestamp(), // Add timestamp to logs
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level}: ${message}`; // Custom log message format
    })
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(), // Colorize console output
        winston.format.simple() // Simple log format for console
      ),
    }),
    new winston.transports.File({
      filename: logFilePath, // Log file location for general logs
      level: "info", // Log info level and above (info, warn, error)
    }),
    new winston.transports.File({
      filename: exceptionsLogFilePath, // Log file location for exceptions
      level: "error", // Only log error level to the exceptions file
      handleExceptions: true, // Ensure unhandled exceptions are logged here
    }),
  ],
});

// Handle unhandled exceptions
logger.exceptions.handle(
  new winston.transports.File({
    filename: exceptionsLogFilePath, // Path to exceptions log in root
  })
);

// Handle promise rejections
logger.rejections.handle(
  new winston.transports.File({
    filename: exceptionsLogFilePath, // Path to rejections log in root
  })
);

// Export the logger
module.exports = logger;
