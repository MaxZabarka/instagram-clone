const formatDate = (date, long) => {
  const diff = new Date() - new Date(date);
  const seconds = diff / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;
  const weeks = days / 7;
  const years = weeks / 365;
  if (long) {
    if (seconds < 60) {
      return Math.floor(seconds) + " seconds ago";
    } else if (minutes < 60) {
      return Math.floor(minutes) + " minutes ago";
    } else if (hours < 24) {
      return Math.floor(hours) + " hours ago";
    } else if (days < 7) {
      return Math.floor(days) + " days ago";
    } else if (weeks < 52) {
      return Math.floor(weeks) + " weeks ago";
    } else {
      return Math.floor(years) + " years ago";
    }
  } else {
    if (seconds < 60) {
      return Math.floor(seconds) + "s";
    } else if (minutes < 60) {
      return Math.floor(minutes) + "m";
    } else if (hours < 24) {
      return Math.floor(hours) + "h";
    } else if (days < 7) {
      return Math.floor(days) + "d";
    } else if (weeks < 52) {
      return Math.floor(weeks) + "w";
    } else {
      return Math.floor(years) + "y";
    }
  }
};

export default formatDate;
