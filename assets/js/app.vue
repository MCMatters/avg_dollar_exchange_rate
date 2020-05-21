<template>
  <div class="container pt-10 pb-10">
    <select-date></select-date>
    <table class="table table-bordered">
      <thead>
      <tr>
        <th></th>
        <th v-trans="{ dataBalloon: 'avg' }">
          <img src="images/avg.png" class="centered" width="28" height="28">
        </th>
        <th v-trans="{ dataBalloon: 'current' }">
          <img src="images/current.png" class="centered" width="32" height="32">
        </th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td v-trans="{ dataBalloon: 'nbu' }">
          <img src="images/icon_government.png" class="centered" width="28" height="28">
        </td>
        <td>
          <avg-nbu></avg-nbu>
        </td>
        <td>
          <current-nbu></current-nbu>
        </td>
      </tr>
      </tbody>
    </table>
    <my-salary></my-salary>
  </div>
</template>

<script>
  import currentNbu from './components/current/nbu.vue';
  import avgNbu from './components/avg/nbu.vue';
  import selectDate from './components/select-date.vue';
  import mySalary from './components/my-salary.vue';
  require('./directives/trans');

  export default {
    mounted () {
      document.documentElement.lang = chrome.i18n.getUILanguage().substr(0, 2);
    },
    components: {
      currentNbu,
      avgNbu,
      selectDate,
      mySalary
    }
  };
</script>
