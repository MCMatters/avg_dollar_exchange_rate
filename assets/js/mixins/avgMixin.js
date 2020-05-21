import currencyMethods from './currencyMethods';
import dateMethods from './dateMethods';
import throbberMethods from './throbberMethods';

export default {
  mixins: [currencyMethods, dateMethods, throbberMethods],
  created () {
    const now = this.getNowDate();

    this.fetchValue(now);

    VueBus.$on('dateChanged', (date) => {
      this.fetchValue(date);
    });
  },
  data () {
    return {
      value: '00.00'
    };
  },
  methods: {
    fetchValues(date, urlCallback, preCallback, attachCallback = null) {
      this.attachThrobber();

      const urls = [];
      const maxDay = this.getMaxDay(date);

      for (let i = 1; i <= maxDay; i++) {
        urls.push(urlCallback(i, date.month, date.year));
      }

      Promise.all(urls.map((url) => fetch(url)))
        .then((responses) => Promise.all(responses.map((response) => response.json())))
        .then((responses) => preCallback(responses))
        .then((responses) => {
          const sum = responses.filter(Boolean).reduce((accumulator, rate) => accumulator + rate, 0);
          const rate = sum / responses.length;

          this.attachRate(rate);

          if (null !== attachCallback) {
            attachCallback(rate);
          }
        })
        .catch((errors) => {
          console.log(errors);

          this.attachRate(0);
        });
    },
  },
}
