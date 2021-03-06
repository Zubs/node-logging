// Import packages
const express = require('express');
const winston = require('winston');
const { combine, timestamp, printf } = winston.format;

let request;

const app = express();

const consoleTransport = new winston.transports.Console();
const fileTransport = new winston.transports.File({
    level: 'info',
    filename: './logs/info.log',
    handleExceptions: true,
    json: true,
    maxsize: 5242880,
    maxFiles: 5,
    colorize: false
});

const myWinstonOptions = {
    transports: [
        consoleTransport,
        fileTransport
    ],
    format: combine(
        timestamp(),
        printf(info => {
            const { req, res } = info.message;
            return `${ info.timestamp } ${ info.level }: ${ request.hostname }${ request.port || ''}${ request.originalUrl }`;
        })
    )
};

// ${ req.hostname }${ req.port || ''}${ req.originalUrl }

const logger = new winston.createLogger(myWinstonOptions);

function logRequest(req, res, next) {
    request = req;
    logger.info(req);
    next();
}
app.use(logRequest);

function logError(err, req, res, next) {
    logger.error(req);
    next();
}
app.use(logError);

app.get('/', (req, res) => {
    res.send("Hello world");
});

app.listen(1234);