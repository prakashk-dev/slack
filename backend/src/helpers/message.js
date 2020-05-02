const moment = require("moment");

function formatMessage(message, type = undefined) {
  return {
    ...message,
    type,
    time: moment().format("h:mm a"),
  };
}

module.exports = formatMessage;
