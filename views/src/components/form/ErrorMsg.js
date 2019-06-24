import React from 'react';
import { connect } from 'react-redux';

const ErrorMsg = (props) => {
  if (props.user.errMsg) {
    return (
      <p className="form-errmsg animated shake">{props.user.errMsg}</p>
    );
  }

  return <div />;
};

const mapStateToProps = ({ user }) => {
  return { user };
}

export default connect(mapStateToProps)(ErrorMsg);
