import React, { useEffect } from 'react';
import { Field, reduxForm } from 'redux-form';
import InputField from './InputField';
// import ErrorMsg from './ErrorMsg';
// import valid from './validate';
// import {
//   signInWithEmailAndPassword,
//   clearErrMsg
// } from '../../actions';

const SignUpForm = (props) => {
  // const { clearErrMsg } = props;
  // useEffect(() => {
  //   clearErrMsg();
  // }, [clearErrMsg]);

  const renderLoading = () => {
    if (props.isLoading) {
      return (
        <div className="form-loading">
          <div className="spinner-container">
            <div className="spinner-grow" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <div className="spinner-grow" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <div className="spinner-grow" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </div>
      );
    } else {
      return <div />;
    }
  }

  return (
    <div className="auth-form-container">
      <p>Sign In</p>
      <form 
      // onSubmit={props.handleSubmit(() => props.signInWithEmailAndPassword(props.formValues, props.history))}
      >
        <Field
          name="email"
          component={InputField}
          type="email"
          placeholder="email@test.com"
          // validate={valid.isEmail}
          icon={"fas fa-envelope"}
        />
        <Field
          name="password"
          component={InputField}
          type="password"
          placeholder="password"
          // validate={valid.minLength6}
          icon={"fas fa-key"}
        />
        {/* <ErrorMsg /> */}
        <button
          type="submit"
        >
          Sign In
        </button>
        <a href="/auth/google">
          <div className="google-btn">
            <i className="fab fa-google" />
            Sign in with Google
          </div>
        </a>
        <div
          className="sin-sup-switch"
          // onClick={() => props.handleSwitchForm(SIGN_UP_FORM)}
        >
          New user? Click here to sign up
        </div>
        <div
          className="form-exit"
          // onClick={props.handleExitForm}
        >
          <i className="fas fa-times" />
        </div>
      </form>
      {renderLoading()}
    </div>
  );
};

// const mapStateToProps = ({ form }) => {
//   if (form.signin) {
//     return {
//       formValues: form.signin.values
//     };
//   }

//   return {};
// }

export default reduxForm({
  form: 'signup'
})(SignUpForm);
