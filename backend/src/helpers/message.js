const moment = require("moment");

function formatMessage(message) {
  const timeStamp = moment.utc().format();
  return {
    ...message,
    timeStamp,
  };
}

module.exports = formatMessage;
