<template>
  <div class="text-center center-block" v-html="value"></div>
</template>

<script>
  import currentMixin from '../../mixins/currentMixin';
  import dateMethods from '../../mixins/dateMethods';
  import axios from 'axios';

  export default {
    name: 'current-pb',
    mixins: [currentMixin, dateMethods],
    methods: {
      fetchValue (date) {
        let url = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json&valcode=USD';
        if (date) {
          url += '&date=' + date;
        }

        this.attachThrobber();
        axios.get(url).then(({ data }) => {
          if (!data.length) {
            this.fetchValue(this.getDate(date));
          } else {
            this.attachRate(data[0].rate);
          }
        }).catch(() => {
          this.attachRate(0);
        });
      },
      getDate (date) {
        date = date || new Date();
        date = date.setDate(date.getDate() - 1);

        const month = date.getMonth() + 1;
        const day = date.getDate();

        return date.getFullYear() + this.wrapDateItem(month) + this.wrapDateItem(day);
      }
    }
  }
</script>
