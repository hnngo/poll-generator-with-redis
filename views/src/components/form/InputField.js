import React from 'react';
import { connect } from 'react-redux';

const InputField = ({
  input,
  placeholder,
  type,
  icon,
  meta: { touched, error },
  user
}) => {
  const isErr = (touched && error);

  return (
    <div className="input-field">
      <i className={icon} />
      {
        user.isProcessingAuth ?
          <input
            {...input}
            placeholder={placeholder}
            type={type}
            className={isErr ? "error-border" : ""}
            disabled
          />
          :
          <input
            {...input}
            placeholder={placeholder}
            type={type}
            className={isErr ? "error-border" : ""}
          />
      }
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

const mapStateToProps = ({ user }) => {
  return { user };
}

export default connect(mapStateToProps)(InputField);