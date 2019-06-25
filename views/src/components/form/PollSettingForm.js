import React, { useState, useEffect } from 'react';
import { reduxForm, Field, unregisterField, change, untouch } from 'redux-form';
import { connect } from 'react-redux';
import InputField from './InputField';

const PollSettingForm = (props) => {
  const { formValues } = props;
  const [numberOfOption, setNumberOfOption] = useState(2);

  useEffect(() => {
    console.log(formValues);

    // Check if option
    if (formValues) {
      let lastOption = formValues["option" + (numberOfOption - 1)];
      if (lastOption) {
        setNumberOfOption(numberOfOption + 1);
      }
    }
  }, [formValues]);

  const handleClickResetRow = () => {
    // Unregister Field in redux form
    for (let i = 2; i < numberOfOption; i++) {
      props.dispatch(change('newPoll', "option" + i, ""));
    }

    // Set number of option
    setNumberOfOption(2);
  }

  const renderOptions = () => {
    let content = [];

    for (let i = 0; i < numberOfOption; i++) {
      content.push(
        <Field
          key={i}
          name={"option" + i}
          component={InputField}
          type="text"
          placeholder="Enter poll option"
          autocomplete="off"
        />
      )
    }

    return content;
  }

  return (
    <div className="poll-setting-form">
      <form>
        <div className="poll-question">
          <p> Your Question</p>
          <Field
            name="question"
            component={InputField}
            type="text"
            placeholder="Enter your question here"
            // validate={valid.isEmail}
            icon={"fas fa-envelope"}
            autocomplete="off"
          />
        </div>
        <div className="poll-options">
          <div className="option-func">
            <p className="header-text">Poll Options</p>
            <div
              onClick={() => handleClickResetRow()}
              className="btn-main-orange"
            >
              Reset Row
              </div>
          </div>
          {renderOptions()}
        </div>
        <div className="poll-setting">
          {/* Public vote / Private vote */}
          {/* Allow multiple choice */}
          {/* Close Poll if one option reach */}
          {/* If Auto vote */}
          {/* Poll Interval */}
          {/* Increment Range */}
        </div>
      </form>
    </div>
  );
};


const mapStateToProps = ({ form }) => {
  if (form.newPoll) {
    return {
      formValues: form.newPoll.values
    };
  }

  return {};
}

export default reduxForm({
  form: 'newPoll'
})(
  connect(mapStateToProps)(PollSettingForm)
);
