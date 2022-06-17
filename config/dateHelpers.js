const { parseISO, format } = require("date-fns");

module.exports = {
  getDate(date) {
    return format(parseISO(date), "MMMM dd, yyy");
  },
  getDateTime(date) {
    return format(parseISO(date), "EEEE, MMM d, yyyy hh:mm a");
  },
};
