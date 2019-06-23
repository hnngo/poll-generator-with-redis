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
      <div className="container">
        <p className="auth-header">Sign Up</p>
        <form
          onSubmit={props.handleSubmit((val) => console.log(val))}
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
                // validate={valid.isEmail}
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
                // validate={valid.isEmail}
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
                // validate={valid.minLength6}
                icon={"fas fa-key"}
              />
            </div>
          </div>
          {/* <ErrorMsg /> */}
          <button type="submit" className="btn-main-orange">
            Sign Up
          </button>
          <div
            className="auth-switch"
          // onClick={() => props.handleSwitchForm(SIGN_UP_FORM)}
          >
            Back To Sign In
          </div>
        </form>
        {renderLoading()}
      </div>
    </div>
  );
};

// const mapStateToProps = ({form}) => {
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
