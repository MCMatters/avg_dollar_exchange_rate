<template>
  <div class="form-group">
    <div class="input-group pb-5">
      <div class="input-group-prepend">
        <span class="input-group-text"
              data-balloon-pos="right"
              data-balloon-length="fit"
              v-trans="{ textContent: 'my_salary', dataBalloon: 'salary_attention' }">
        </span>
      </div>
      <input type="text" class="form-control" v-model="salary" v-number>
    </div>
    <span class="help-block" v-show="getSalary !== 0">
      <span v-trans="{ textContent: 'how_much_i_will_earn' }"></span>
      <span v-html="getSalary"></span>
    </span>
  </div>
</template>

<script>
  import currencyMethods from '../mixins/currencyMethods';

  export default {
    mixins: [currencyMethods],
    created () {
      VueBus.$on('avgNbuChanged', avgNbuRate => {
        this.avgNbuRate = avgNbuRate;
      });
    },
    data () {
      return {
        avgNbuRate: null,
        salary: null,
      };
    },
    computed: {
      getSalary () {
        const salary = this.toFixed(parseFloat(this.salary) * this.avgNbuRate, 2);

        return isNaN(salary) ? 0 : salary;
      },
    },
  };
</script>
