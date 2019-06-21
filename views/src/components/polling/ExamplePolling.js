import React, { useState } from 'react';
import SettingRow from './SettingRow';

const ExamplePolling = (props) => {
  const [selections, setSelections] = useState(1);

  return (
    <div className="polling-containter">
      <div className="container">
        <div className="row">
          <div className="col-sm-6">
            <SettingRow
              type="input"
              placholder={1}
              label="Number of selections"
              onSelect={(e) => setSelections(e)}
            />
          </div>
          <div className="col-sm-6">
            Res
        </div>
        </div>
      </div>
    </div>
  );
};

export default ExamplePolling;
