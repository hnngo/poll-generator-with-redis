import React from 'react';
import {
  TAB_SIGN_IN,
  TAB_SIGN_UP
} from '../constants';

const HeaderLightBar = (props) => {
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

export default HeaderLightBar;
