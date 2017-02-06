import currencyMethods from '../mixins/currencyMethods';
import dateMethods from '../mixins/dateMethods';
import throbberMethods from '../mixins/throbberMethods';

export default {
  mixins: [currencyMethods, dateMethods, throbberMethods],
  created () {
    const today = this.getTodayDate();
    this.fetchValue([today.year, today.month]);
    VueBus.$on('dateChanged', date => {
      this.fetchValue(date);
    });
  },
  data () {
    return {
      value: '00.00'
    };
  },
}
