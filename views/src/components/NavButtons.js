import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  TAB_CURRENT_POLL,
  TAB_NEW_POLL,
  TAB_YOUR_POLLS
} from '../constants';

const NavButtons = (props) => {
  const { selectedTab } = props;
  const [viewTab, setViewTab] = useState(selectedTab);

  useEffect(() => {
    setViewTab(selectedTab)
  }, [selectedTab]);

  const renderAuthRequiredNav = () => {
    if (props.user.auth) {
    // if (true) {
      return [
        <div
          key={TAB_NEW_POLL}
          className={viewTab === TAB_NEW_POLL ? "tab-active" : "tab-inactive"}
          onClick={() => {
            setViewTab(TAB_NEW_POLL);
            props.onSelect(TAB_NEW_POLL);
          }}
        >
          Create New Poll
        </div>,
        <div
          key={TAB_YOUR_POLLS}
          className={viewTab === TAB_YOUR_POLLS ? "tab-active" : "tab-inactive"}
          onClick={() => {
            setViewTab(TAB_YOUR_POLLS);
            props.onSelect(TAB_YOUR_POLLS);
          }}
        >
          Your Polls
      </div>
      ];
    }
  }

  return (
    <div className="nav-btn-container">
      <div
        className={viewTab === TAB_CURRENT_POLL ? "tab-active" : "tab-inactive"}
        onClick={() => {
          setViewTab(TAB_CURRENT_POLL);
          props.onSelect(TAB_CURRENT_POLL);
        }}
      >
        Current Polls
      </div>
      {renderAuthRequiredNav()}
    </div>
  );
};

const mapStateToProps = ({ user }) => {
  return { user };
}

export default connect(mapStateToProps)(NavButtons);
