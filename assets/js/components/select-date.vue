<template>
  <form class="form-vertical">
    <div class="form-group">
      <input type="month" class="form-control" v-model="date" :max="maxDate" :min="minDate">
    </div>
    <div class="form-group">
      <input type="submit"
             class="form-control btn-success"
             v-trans="{ value: 'submit' }"
             @click.prevent="submitForm">
    </div>
  </form>
</template>

<script>
  import dateMethods from '../mixins/dateMethods';

  export default {
    name: 'select-date',
    mixins: [dateMethods],
    data () {
      return {
        date: this.getDefaultValue()
      };
    },
    methods: {
      submitForm () {
        VueBus.$emit('dateChanged', String(this.date).split('-'));
      },
      getDefaultValue () {
        const now = this.getNowDate();

        return now.year + '-' + now.month;
      }
    },
    computed: {
      maxDate () {
        return this.getDefaultValue()
      },
      minDate () {
        const now = new Date();
        now.setFullYear(now.getFullYear() - 1);

        const month = now.getMonth();

        return now.getFullYear() + '-' + this.wrapDateItem(month);
      }
    }
  }
</script>
