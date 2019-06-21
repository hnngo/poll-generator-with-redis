import React, { useState } from 'react';
import {
  TAB_EXAMPLE_POLLING,
  TAB_NEW_POLLING
} from '../constants';

const NavButtons = (props) => {
  const [viewTab, setViewTab] = useState(TAB_EXAMPLE_POLLING);

  return (
    <div className="nav-btn-container">
      <div
        className={viewTab === TAB_EXAMPLE_POLLING ? "tab-active" : "tab-inactive"}
        onClick={() => {
          setViewTab(TAB_EXAMPLE_POLLING);
          props.onSelect(TAB_EXAMPLE_POLLING);
        }}
      >
        Example
      </div>
      <div
        className={viewTab === TAB_NEW_POLLING ? "tab-active" : "tab-inactive"}
        onClick={() => {
          setViewTab(TAB_NEW_POLLING);
          props.onSelect(TAB_NEW_POLLING);
        }}
      >
        New Polling
      </div>
    </div>
  );
};

export default NavButtons;
