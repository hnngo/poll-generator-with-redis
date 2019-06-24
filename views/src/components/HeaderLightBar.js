import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import {
  actFetchUser,
  actSignOut
} from '../actions';
import {
  TAB_SIGN_IN,
  TAB_SIGN_UP,
  TAB_CURRENT_POLL
} from '../constants';

const HeaderLightBar = (props) => {
  const { user, actFetchUser } = props;

  useEffect(() => {
    actFetchUser();
  }, [actFetchUser]);

  if (user.auth) {
    return (
      <div className="header-light-bar">
        <div
          className="header-auth-name"
          onClick={() => { }}
        >
          {user.auth.name}
        </div>
        <div onClick={() => {
          props.actSignOut();
          props.onSelect(TAB_CURRENT_POLL);
        }}>
          Sign Out
        </div>
      </div>
    );
  } else if (user.auth === undefined) {
    return <div />;
  }

  return (
    <div className="header-light-bar">
      <div onClick={() => props.onSelect(TAB_SIGN_IN)}>
        Sign In
      </div>
      <div onClick={() => props.onSelect(TAB_SIGN_UP)}>
        Sign Up
      </div>
    </div>
  );
};

const mapStateToProps = ({ user }) => {
  return { user };
}

export default connect(mapStateToProps, {
  actFetchUser,
  actSignOut
})(HeaderLightBar);
