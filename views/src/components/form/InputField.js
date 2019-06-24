import React from 'react';

const InputField = ({
  input,
  placeholder,
  type,
  icon,
  meta: { touched, error }
}) => {
  const isErr = (touched && error);

  return (
    <div className="input-field">
      <i className={icon} />
      <input
        {...input}
        placeholder={placeholder}
        type={type}
        className={isErr ? "error-border" : ""}
      />
      <div className="error-text">
        {
          isErr ?
            <span>{error}</span>
            :
            <div />
        }
      </div>
    </div>
  );
}

export default InputField;