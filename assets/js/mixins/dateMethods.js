export default {
  methods: {
    getNowDate () {
      const currentDate = new Date();
      const month = currentDate.getMonth() + 1;
      const day = currentDate.getDate();

      return {
        year: currentDate.getFullYear(),
        month: this.wrapDateItem(month),
        day: this.wrapDateItem(day)
      };
    },
    getMaxDay (date) {
      const maxDay = 20;
      const now = this.getNowDate();
      const [year, month] = date;

      if (now.year === parseInt(year) && now.month == month) {
        return Math.min(maxDay, parseInt(now.day));
      }

      return maxDay;
    },
    wrapDateItem (item) {
      return item < 10 ? '0' + item : item;
    }
  }
};
