String.prototype.toKebabCase = String.prototype.toKebabCase ||
  function () {
    return this.replace(/(.)(?=[A-Z])/g, '$1-').toLowerCase();
  };
