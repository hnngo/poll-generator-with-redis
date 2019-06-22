import React, { useState } from 'react';

const SettingRow = (props) => {
  const [number, setNumber] = useState(number);

  const {
    placeholder
  } = props;
  let content;

  switch (props.type) {
    case "input":
      content = <input
        value={placeholder}
        onChange={() => props.onSelect()}
      />;
      break;
    default:
      content = <div />;
      break;
  }


  return (
    <div className="setting-row">
      {content}
    </div>
  )
};

export default SettingRow;
