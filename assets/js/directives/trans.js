import Vue from 'vue';

Vue.directive('trans', {
  inserted (el, binding) {
    for (const attribute in binding.value) {
      if (!binding.value.hasOwnProperty(attribute)) {
        continue;
      }

      const kebabCaseAttribute = attribute.toKebabCase();
      const translation = chrome.i18n.getMessage(binding.value[attribute]);

      if (/^data-.+/.test(kebabCaseAttribute)) {
        el.dataset[kebabCaseAttribute.replace(/^data-/, '')] = translation;
      } else {
        el[attribute] = translation;
      }
    }
  }
});
