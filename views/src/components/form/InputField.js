import React from 'react';

const InputField = ({
  input,
  placeholder,
  type,
  icon,
  meta: { touched, error }
}) => {
  return (
    <div className="input-field">
      <div>
        <i className={icon} />
        <input
          {...input}
          placeholder={placeholder}
          type={type}
        />
        <div className="error-text">
          {touched &&
            ((error && <span>{error}</span>))}
        </div>
      </div>
    </div>
  );
}

export default InputField;