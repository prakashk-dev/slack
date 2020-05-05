const moment = require("moment");

function formatMessage(message, type = undefined) {
  return {
    ...message,
    type,
    time: moment.utc().format(),
  };
}

module.exports = formatMessage;
