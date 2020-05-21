<template>
  <div class="text-center center-block"
       data-balloon-pos="right"
       data-balloon-length="fit"
       v-trans="{ dataBalloon: 'avg_nbu' }"
       v-html="value">
  </div>
</template>

<script>
  import avgMixin from '../../mixins/avgMixin';

  export default {
    name: 'avg-nbu',
    mixins: [
      avgMixin,
    ],
    methods: {
      fetchValue (date) {
        this.fetchValues(
          date,
          (day, month, year) => {
            const url = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=USD&date=';
            const dateString = `${year}${month}${this.wrapDateItem(day)}`;

            return `${url}${dateString}&json`;
          },
          (responses) => Promise.all(responses.map((response) => response[0].rate)),
          (rate) => {
            VueBus.$emit('avgNbuChanged', rate);
          },
        );
      }
    }
  }
</script>
