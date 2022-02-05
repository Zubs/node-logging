// Import packages
const express = require('express');
const winston = require('winston');

const app = express();

const consoleTransport = new winston.transports.Console();

const myWinstonOptions = {
    transports: [consoleTransport]
};

const logger = new winston.createLogger(myWinstonOptions);

function logRequest(req, res, next) {
    logger.info(req.url);
    next();
}
app.use(logRequest);

function logError(err, req, res, next) {
    logger.error(err);
    next();
}
app.use(logError);

app.get('/', (req, res) => {
    res.send("Hello world");
});

app.listen(1234);