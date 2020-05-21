export default {
  methods: {
    parseDate(date) {
      const month = date.getMonth() + 1;
      const day = date.getDate();

      return {
        year: date.getFullYear(),
        month: this.wrapDateItem(month),
        day: this.wrapDateItem(day)
      };
    },
    getNowDate () {
      return this.parseDate(new Date());
    },
    getMaxDay (date) {
      const maxDay = 20;
      const now = this.getNowDate();

      if (now.year === parseInt(date.year) && now.month === date.month) {
        return Math.min(maxDay, parseInt(now.day));
      }

      return maxDay;
    },
    wrapDateItem (item) {
      return item < 10 ? `0${item}` : item;
    },
  },
};
