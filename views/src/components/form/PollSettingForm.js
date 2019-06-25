import React, { useState, useEffect } from 'react';
import { reduxForm, Field, change, reset } from 'redux-form';
import { connect } from 'react-redux';
import InputField from './InputField';
import SwitchField from './SwitchField';

const PollSettingForm = (props) => {
  const { formValues, initialize } = props;
  const [numberOfOption, setNumberOfOption] = useState(2);

  useEffect(() => {
    console.log(formValues);

    // Initial value
    // if (initialize) {
    //   initialize({
    //     question: "",
    //     option1: "",
    //     option2: "",
    //     privatePoll: false,
    //     multipleChoice: false
    //   });
    // }

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
    for (let i = 0; i < numberOfOption; i++) {
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
      <form
        onSubmit={props.handleSubmit((e) => console.log(e))}
      >
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
              Clear Option
              </div>
          </div>
          {renderOptions()}
        </div>
        <div className="poll-setting">
          <p className="setting-header">Poll Setting</p>
          <div className="set-public">
            <p>Set as Private poll (require voter to sign in)</p>
            <Field
              name="privatePoll"
              type="checkbox"
              component={SwitchField}
            />
          </div>
          <div className="set-mutiple-choice">
            <p>Allow voter select multiple choice</p>
            <Field
              name="multipleChoice"
              type="checkbox"
              component={SwitchField}
            />
          </div>
          {/* <div className="set-close-poll">
            <p>Close the poll if</p>
            <Field
              name="multipleChoice"
              type="checkbox"
              component={SwitchField}
            />
          </div> */}
          {/* Close Poll if one option reach */}
          {/* If Auto vote */}
          {/* Poll Interval */}
          {/* Increment Range */}
        </div>
        <div className="poll-btn">
          <button className="btn-main-orange" type="submite">
            Create Poll
          </button>
          <div
            className="btn-main-danger"
            onClick={() => props.dispatch(reset('newPoll'))}
          >
            Reset Form
          </div>
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
  form: 'newPoll',
  initialValues: {
    question: "",
    option1: "",
    option2: "",
    privatePoll: false,
    multipleChoice: false
  }
})(
  connect(mapStateToProps)(PollSettingForm)
);
