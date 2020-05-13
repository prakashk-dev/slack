const moment = require("moment");

function formatMessage(message) {
  const time = moment.utc().format();
  return {
    ...message,
    time,
  };
}

module.exports = formatMessage;
