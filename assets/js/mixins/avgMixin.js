import currencyMethods from '../mixins/currencyMethods';
import dateMethods from '../mixins/dateMethods';
import throbberMethods from '../mixins/throbberMethods';

export default {
  mixins: [currencyMethods, dateMethods, throbberMethods],
  created () {
    const now = this.getNowDate();
    this.fetchValue([now.year, now.month]);
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
