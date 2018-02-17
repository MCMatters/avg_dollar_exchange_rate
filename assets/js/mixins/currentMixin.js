import currencyMethods from './currencyMethods';
import throbberMethods from './throbberMethods';

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
