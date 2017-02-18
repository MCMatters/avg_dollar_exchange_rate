import Vue from 'vue';

Vue.directive('number', {
  inserted (el) {
    const handleInput = (e) => {
      if ((e.key === '.' && String(el.value).indexOf('.') !== -1) ||
        !/^(\d+|\.)$/.test(e.key)
      ) {
        e.preventDefault();
      }
    };

    el.addEventListener('keypress', handleInput);
    el.addEventListener('keyup', handleInput);

    el.addEventListener('paste', e => {
      e.preventDefault();
    });
  }
});
