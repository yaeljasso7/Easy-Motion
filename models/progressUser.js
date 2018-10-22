class ProgressUser {
  constructor({
    userId, weight, height, date,
  }) {
    this.userId = userId;
    this.weight = weight;
    this.height = height;
    this.date = date;
  }
}

ProgressUser.ValidFilters = {
  weight: 'asNumber',
  height: 'asNumber',
  date: 'asString',
};

module.exports = ProgressUser;
