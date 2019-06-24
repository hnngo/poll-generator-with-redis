const isEmail = value =>
  value && /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@(([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value)
    ? undefined : 'Invalid email address';

const minLength6 = value => value && value.length >= 6 ? undefined : `Must be 6 characters or more`;

const isNotNull = value => value ? undefined : "Please enter the field"

const isSelectedDate = value => value ? undefined : "Please select a day"

export default {
  isEmail,
  minLength6,
  isNotNull,
  isSelectedDate
};
