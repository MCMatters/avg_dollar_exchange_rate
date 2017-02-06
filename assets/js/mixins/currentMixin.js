import currencyMethods from '../mixins/currencyMethods';
import throbberMethods from '../mixins/throbberMethods';

export default {
  mixins: [currencyMethods, throbberMethods],
  created () {
    this.fetchValue();
  },
  data () {
    return {
      value: '00.00'
    };
  },
}
