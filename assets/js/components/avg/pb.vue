<template>
  <div class="text-center center-block"
       data-balloon-pos="right"
       data-balloon-length="fit"
       v-trans="{ dataBalloon: 'avg_pb' }"
       v-html="value">
  </div>
</template>

<script>
  import avgMixin from '../../mixins/avgMixin';

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
        fetch(`https://api.privatbank.ua/p24api/exchange_rates?json&date=${placeDate}`)
          .then(response => response.json())
          .then(response => {
            if (response.exchangeRate.length) {
              const item = response.exchangeRate.find(item => item.currency === 'USD');
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
