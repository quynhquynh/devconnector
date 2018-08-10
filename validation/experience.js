const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateExperienceInput(data) {
  let errors = {};

  let { title, company, from } = data;
  title = !isEmpty(title) ? title : '';
  company = !isEmpty(company) ? company : '';
  from = !isEmpty(from) ? from : '';

  if (Validator.isEmpty(title)) {
    errors.title = 'Job title is required';
  }
  if (Validator.isEmpty(company)) {
    errors.company = 'Company is required';
  }
  if (Validator.isEmpty(from)) {
    errors.from = 'From date is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
