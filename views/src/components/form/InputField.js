import React from 'react';
import { connect } from 'react-redux';

const InputField = ({
  input,
  placeholder,
  type,
  icon,
  meta: { touched, error },
  user,
  poll,
  autocomplete
}) => {
  const isErr = (touched && error);

  return (
    <div className="input-field">
      <i className={icon} />
      {
        (user.isProcessingAuth || poll.isCreating) ?
          <input
            {...input}
            placeholder={placeholder}
            type={type}
            className={isErr ? "error-border" : ""}
            disabled
            autoComplete={autocomplete}
          />
          :
          <input
            {...input}
            placeholder={placeholder}
            type={type}
            className={isErr ? "error-border" : ""}
            autoComplete={autocomplete}
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

const mapStateToProps = ({ user, poll }) => {
  return { user, poll };
}

export default connect(mapStateToProps)(InputField);