const winston = require('winston');
// const config = require('../../infra/configs/global_config');
const WinstonLogStash = require('winston3-logstash-transport');
require('dotenv').config;
// const fs = require('fs');
const lodash = require('lodash');

const get = (configKey) => lodash.get(config, lodash.trim(configKey.replace(/\//g, '.'), '.'));


let logger = new winston.createLogger({
  transports: [
    new winston.transports.Console({
      level: 'debug',
      colorize: true,
      timestamp: function () {
        return (new Date()).toLocaleTimeString();
      },
      prettyPrint: true
    }),
  ],
  exitOnError: false,
});

const log = (context, message, scope) => {
  if (get('/logstash/host')) {
    logger.add(new WinstonLogStash(get('/logstash')));
  }
  const obj = {
    context,
    scope,
    message: message
  };
  logger.info(obj);
};

const info = (context, message, scope, meta = undefined) => {
  if (get('/logstash/host')) {
    logger.add(new WinstonLogStash(get('/logstash')));
  }
  const obj = {
    context,
    scope,
    message: message,
    meta
  };
  logger.info(obj);
};

const error = (context, message, scope, meta = undefined) => {
  if (get('/logstash/host')) {
    logger.add(new WinstonLogStash(get('/logstash')));
  }
  const obj = {
    context,
    scope,
    message: message,
    meta
  };
  logger.error(obj);
};

module.exports = {
  log,
  info,
  error,
};
