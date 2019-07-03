import React, { useState } from 'react';
import { reduxForm, Field, change, reset } from 'redux-form';
import { connect } from 'react-redux';
import InputField from './InputField';
import SwitchField from './SwitchField';
import {
  actCreatePoll
} from '../../actions';

const NewPollForm = (props) => {
  const { poll } = props;
  const [numberOfOption, setNumberOfOption] = useState(2);
  const [isCreating, setIsCreating] = useState(false);


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
          onChange={(e) => {
            // Increase the number of rows of option
            if (e.target.name === ("option" + (numberOfOption - 1))) {
              setNumberOfOption(numberOfOption + 1);
            }
          }}
        />
      )
    }

    return content;
  }

  const renderBtn = () => {
    // Check if render loading button or normal button
    if (!poll.isCreating) {
      if (isCreating) {
        setIsCreating(false);
        props.onCreated();
      }

      return (
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
      );
    }

    return (
      <div className="poll-btn">
        <button className="btn-main-orange" type="submite" disabled>
          <span className="spinner-grow spinner-grow-sm px-1" />
          <span className="spinner-grow spinner-grow-sm px-1" />
          <span className="spinner-grow spinner-grow-sm px-1" />
          <span>Creating...</span>
        </button>
        <div
          className="btn-main-danger"
          onClick={() => props.dispatch(reset('newPoll'))}
          disabled
        >
          Reset Form
        </div>
      </div>
    );
  }

  return (
    <div className="poll-setting-form">
      <form
        onSubmit={props.handleSubmit((e) => {
          props.actCreatePoll(e);
          setIsCreating(true);
        })}
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
              name="isPrivate"
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
        {renderBtn()}
      </form>
    </div>
  );
};

const validate = values => {
  const errors = {};

  const optionKeys = Object.keys(values).filter(d => d.startsWith('option'));
  const numberOfOption = optionKeys.length;
  optionKeys.forEach((o, i) => {
    if (i !== numberOfOption - 1 || numberOfOption <= 2) {
      if (!values[o]) {
        errors[o] = "Please fill in this option";
      }
    }
  });

  return errors
}


const mapStateToProps = ({ poll }) => {
  return { poll };
}

export default reduxForm({
  form: 'newPoll',
  initialValues: {
    question: "",
    option0: "",
    option1: "",
    isPrivate: false,
    multipleChoice: false
  },
  validate
})(
  connect(mapStateToProps, {
    actCreatePoll
  })(NewPollForm)
);
