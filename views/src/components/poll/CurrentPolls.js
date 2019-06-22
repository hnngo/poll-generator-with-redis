import React, { useState } from 'react';
import axios from 'axios';
import SettingRow from './SettingRow';

const ExamplePolling = (props) => {
  const [selections, setSelections] = useState(1);

  const handleClickStart = () => {
    axios.post("/polling/create", {
      question: "Asdfsdfs",
      numberOfSlections: 3
    });
  }

  return (
    <div className="polling-containter">
      <div className="container">
        <div className="row">
          <div className="col-sm-6">
            <div className="polling-btn-start">
              <button
                className="btn-main-orange"
                onClick={() => handleClickStart()}
              >
                Start
              </button>
            </div>
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
