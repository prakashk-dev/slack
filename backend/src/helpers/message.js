const moment = require("moment");

function formatMessage(message) {
  const time = moment.utc().format();
  return {
    ...message,
    type: message.type,
    time,
  };
}

module.exports = formatMessage;
