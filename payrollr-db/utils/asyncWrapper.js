const asyncWrapper = promise =>
  promise.then(data => [null, data]).catch(error => [error, null]);

module.exports = asyncWrapper;
