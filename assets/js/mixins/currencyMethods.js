export default {
  methods: {
    toFixed (num, fixed) {
      fixed = fixed || 0;
      fixed = Math.pow(10, fixed);
      return Math.floor(num * fixed) / fixed;
    },
    attachRate (rate) {
      rate = isNaN(rate) ? 0 : rate;
      this.value = this.toFixed(rate, 2);
    }
  }
};
