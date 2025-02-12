const winston = require("winston");

const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: "logs/role-changes.log" })
    ]
});

module.exports = logger;