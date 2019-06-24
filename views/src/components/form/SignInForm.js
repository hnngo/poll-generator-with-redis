import React, { useEffect } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import InputField from './InputField';
import ErrorMsg from './ErrorMsg';
import valid from './validate';
import { TAB_SIGN_UP, TAB_CURRENT_POLL } from '../../constants';
import {
  actSignInpWithEmailAndPassword
} from '../../actions';

const SignInForm = (props) => {
  const { user, onSelectTab } = props;

  useEffect(() => {
    if (user.auth) {
      onSelectTab(TAB_CURRENT_POLL);
    }
  }, [user.auth, onSelectTab]);

  const renderButton = () => {
    // Check if render loading button or normal button
    if (!user.isProcessingAuth) {
      return (
        <button type="submit" className="btn-main-orange">
          Sign In
        </button>
      );
    }

    return (
      <button className="btn-main-orange" type="submit" disabled>
        <span className="spinner-grow spinner-grow-sm px-1" />
        <span className="spinner-grow spinner-grow-sm px-1" />
        <span className="spinner-grow spinner-grow-sm px-1" />
      </button>
    );
  }

  return (
    <div className="auth-form-container">
      <div className="container">
        <p className="auth-header">Sign In</p>
        <form
          onSubmit={props.handleSubmit((val) => props.actSignInpWithEmailAndPassword(val))}
        >
          <div className="row">
            <div className="col-3">
              <label className="input-label">Email</label>
            </div>
            <div className="col-9">
              <Field
                name="email"
                component={InputField}
                type="email"
                placeholder="nick@test.com"
                validate={valid.isEmail}
                icon={"fas fa-envelope"}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-3">
              <label className="input-label">Password</label>
            </div>
            <div className="col-9">
              <Field
                name="password"
                component={InputField}
                type="password"
                placeholder="password"
                validate={valid.minLength6}
                icon={"fas fa-key"}
              />
            </div>
          </div>
          <ErrorMsg />
          {renderButton()}
          <div
            className="auth-switch"
            onClick={() => props.onSelectTab(TAB_SIGN_UP)}
          >
            New user? Click here to sign up
          </div>
        </form>
      </div>
    </div>
  );
};

const mapStateToProps = ({ user }) => {
  return { user };
}

export default reduxForm({
  form: 'signin'
})(
  connect(mapStateToProps, {
    actSignInpWithEmailAndPassword
  })(SignInForm)
);
