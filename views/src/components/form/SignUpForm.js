import React, { useEffect } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import InputField from './InputField';
import ErrorMsg from './ErrorMsg';
import valid from './validate';
import { TAB_SIGN_IN, TAB_CURRENT_POLL } from '../../constants';
import {
  actSignUpWithEmailAndPassword
} from '../../actions';

const SignUpForm = (props) => {
  const { user, onSelectTab } = props;

  useEffect(() => {
    if (user.auth) {
      onSelectTab(TAB_CURRENT_POLL);
    }
  }, [user.auth, onSelectTab]);

  const renderButton = () => {
    // Check if render loading button or normal button
    if (!props.user.isProcessingAuth) {
      return (
        <button type="submit" className="btn-main-orange">
          Sign Up
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
        <p className="auth-header">Sign Up</p>
        <form
          onSubmit={props.handleSubmit((val) => props.actSignUpWithEmailAndPassword(val))}
        >
          <div className="row">
            <div className="col-3">
              <label className="input-label">Name</label>
            </div>
            <div className="col-9">
              <Field
                name="name"
                component={InputField}
                type="text"
                placeholder="Nick"
                validate={valid.isNotNull}
                icon={"fas fa-envelope"}
              />
            </div>
          </div>
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
            onClick={() => props.onSelectTab(TAB_SIGN_IN)}
          >
            Back To Sign In
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
  form: 'signup'
})(
  connect(mapStateToProps, {
    actSignUpWithEmailAndPassword
  })(SignUpForm)
);
