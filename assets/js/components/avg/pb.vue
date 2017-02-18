<template>
  <div class="text-center center-block" v-html="value"></div>
</template>

<script>
  import avgMixin from '../../mixins/avgMixin';
  import axios from 'axios';

  export default {
    name: 'avg-pb',
    mixins: [avgMixin],
    methods: {
      fetchValue (date, sum = 0, counter = 0, i = 1) {
        if (i === 1) {
          this.attachThrobber();
        }

        if (i > this.getMaxDay(date)) {
          this.attachRate(sum / counter);
          return;
        }

        const day = this.wrapDateItem(i);
        const placeDate = day + '.' + date[1] + '.' + date[0];
        axios.get(`https://api.privatbank.ua/p24api/exchange_rates?json&date=${placeDate}`)
          .then(({data}) => {
            if (data.exchangeRate.length) {
              const item = data.exchangeRate.find(item => item.currency === 'USD');
              sum += item.saleRateNB;
              counter++;
            }
            i++;
            this.fetchValue(date, sum, counter, i);
          })
          .catch(() => {
            this.attachRate(0);
          });
      }
    }
  }
</script>
