import React from 'react';
import Switch from 'react-switch';

const SwitchField = ({ input, meta: { touched, error } }) => {
  return (
    <div>
      <Switch
        {...input}
        onColor="#e6b87c"
        onHandleColor="#e0662e"
        handleDiameter={30}
        uncheckedIcon={false}
        checkedIcon={false}
        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
        activeBoxShadow="0px 0px 1px 1px rgba(0, 0, 0, 0.2)"
        height={20}
        width={48}
      />
      <div className="error-text">
        {
          (touched && error) ?
            <span>{error}</span>
            :
            <div />
        }
      </div>
    </div>
  );
}

export default SwitchField;
