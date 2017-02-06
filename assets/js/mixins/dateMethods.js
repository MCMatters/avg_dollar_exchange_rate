export default {
  methods: {
    getTodayDate () {
        const currentDate = new Date();
        const month = currentDate.getMonth() + 1;
        const day = currentDate.getDate();

        return {
          year: currentDate.getFullYear(),
          month: month < 10 ? '0' + month : month,
          day: day < 10 ? '0' + day : day
        };
    },
    getMaxDay (date) {
      const today = this.getTodayDate();
      const [year, month] = date;

      if (today.year === parseInt(year) && today.month == month) {
        return parseInt(today.day);
      }

      return 20;
    }
  }
};
