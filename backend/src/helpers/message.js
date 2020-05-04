const moment = require("moment");

function formatMessage(message, type = undefined) {
  return {
    ...message,
    type,
    time: moment(new Date()).format("h:mm a"),
  };
}

module.exports = formatMessage;
