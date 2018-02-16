<template>
  <div class="text-center center-block" v-html="value"></div>
</template>

<script>
  import currentMixin from '../../mixins/currentMixin';

  export default {
    name: 'current-pb',
    mixins: [currentMixin],
    methods: {
      fetchValue () {
        const url = 'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5';

        this.attachThrobber();

        fetch(url)
          .then(response => response.json())
          .then(response => {
            response.forEach(rate => {
              if (rate.ccy === 'USD') {
                this.attachRate(rate.sale);
              }
            });
        }).catch(() => {
          this.attachRate(0);
        });
      }
    }
  }
</script>
