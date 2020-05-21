<template>
  <form class="form-vertical">
    <div class="form-group">
      <input type="month" class="form-control" v-model="date" :max="maxDate" :min="minDate">
    </div>
    <div class="form-group">
      <input type="submit"
             class="btn-block btn btn-outline-success"
             v-trans="{ value: 'submit' }"
             @click.prevent="submitForm">
    </div>
  </form>
</template>

<script>
  import dateMethods from '../mixins/dateMethods';

  export default {
    mixins: [dateMethods],
    data () {
      return {
        date: this.getDefaultValue()
      };
    },
    methods: {
      submitForm () {
        VueBus.$emit('dateChanged', this.parseDate(new Date(this.date)));
      },
      getDefaultValue () {
        const now = this.getNowDate();

        return `${now.year}-${now.month}`;
      }
    },
    computed: {
      maxDate () {
        return this.getDefaultValue()
      },
      minDate () {
        const now = new Date();
        const month = now.getMonth();

        now.setFullYear(now.getFullYear() - 1);

        return `${now.getFullYear()}-${this.wrapDateItem(month)}`;
      }
    }
  }
</script>
