import PropType from 'prop-types';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';

import Icon, { File, faPlusCircle, faSpinner } from '../../components/Icons';

import { Alert, Button, Choice, ChoiceList, TextField } from '@cmsgov/design-system';
import { Fragment } from 'react';

import { createApd } from '../../actions/app';



const backToDashboard = (e) => {
  e.preventDefault();
  window.location.href="/"
}

const handleFundingChoice = (e) => {
 localStorage.setItem('apd-funding-source', e.target.value);
}

const handleNameInput = (e) => {
  localStorage.setItem('apd-name', e.target.value);
}

const eligibilityChildren = (
  <ChoiceList
    className="ds-u-margin--0"
    choices={[
      { label: 'Planning', value: 'planning', disabled: true},
      { label: 'Implementation', value: 'implementation' },
      { label: 'Operations', value: 'operations', disabled: true },
    ]}
    name="size-variants"
    type="radio"
    size="large"
  />
);

const hitechChildren = (
  <Fragment>
    <h2 className="ds-u-margin-bottom--2">APD Type ⃰</h2>
    <Alert className="ds-u-measure--wide" variation="warn">Planning and Operations APDs are currently not available for the HITECH funding source.</Alert>
    <p className="ds-u-margin-y--1">This selection is permanent for the APD.</p>
    <ChoiceList
      className="ds-u-margin--0"
      choices={[
        { label: 'Planning', value: 'planning', disabled: true},
        { label: 'Implementation', value: 'implementation' },
        { label: 'Operations', value: 'operations', disabled: true },
      ]}
      name="size-variants"
      type="radio"
      size="large"
    />
  </Fragment>
);

const mmisChildren = (
  <Fragment>
    <h2 className="ds-u-margin-bottom--1">APD Type ⃰</h2>
    <p className="ds-u-margin-y--1">This selection is permanent for the APD.</p>
    <ChoiceList
      className="ds-u-margin--0"
      choices={[
        { label: 'Planning', value: 'planning', disabled: true},
        { label: 'Implementation', value: 'implementation' },
        { label: 'Operations', value: 'operations', disabled: true },
      ]}
      name="size-variants"
      type="radio"
      size="large"
    />
  </Fragment>
);

const CreateAPDForm = ({
  createApd: create
}) => {
  const Loading = ({ children }) => (
    <div className="ds-h2 ds-u-margin-top--7 ds-u-padding--0 ds-u-padding-bottom--3 ds-u-text-align--center">
      <Icon icon={faSpinner} spin size="sm" className="ds-u-margin-right--1" />{' '}
      {children}
    </div>
  );

  const [isLoading, setIsLoading] = useState(false);

  const createNew = () => {
    create();
  };

  if (isLoading) {
    return (
      <div id="start-main-content">
        <Loading>Loading your APD</Loading>
      </div>
    );
  }

  return (
    <main
      id="start-main-content"
      className="create-apd-prototype ds-l-container ds-u-margin-y--5 ds-u-padding-top--5"
    >
      <h1 className="ds-u-margin-bottom--0">Create a New APD</h1>
      <p className="ds-u-margin-top--0">Complete the fields below to create your APD. Once the APD is created, selectios with a * cannot be changed.</p>
      <h2 className="ds-u-margin-top--4">APD Name</h2>
      <p className="instruction-box ds-u-measure--wide ds-u-margin-bottom--0">Examples: Identification numbers, brief descriptions of the APD’s purpose, or any identifier that would distinguish this APD from others within your state. This can align with your existing naming conventions.</p>
      <TextField className="ds-u-margin--0" onChange={handleNameInput} />


      <fieldset className="ds-c-fieldset">
        <legend className="ds-c-label">
          <h2 className="ds-u-margin-top--2 ds-u-margin-bottom--0">Funding Source ⃰</h2>
        </legend>
        <Choice 
          name="radio_choice" 
          type="radio" 
          label="E&E (Eligibility and Enrollment)" 
          value="e&e" 
          checkedChildren={<div className="ds-c-choice__checkedChild">{eligibilityChildren}</div>}
          onChange={handleFundingChoice}
        />
        <Choice
          name="radio_choice"
          type="radio"
          label="HITECH"
          value="hitech"
          checkedChildren={<div className="ds-c-choice__checkedChild proto-radio-extra-wide">{hitechChildren}</div>}
          onChange={handleFundingChoice}
        />        
        <Choice
          name="radio_choice"
          type="radio"
          label="MMIS"
          value="mmis"
          checkedChildren={<div className="ds-c-choice__checkedChild">{mmisChildren}</div>}
          onChange={handleFundingChoice}
        />        
      </fieldset>

      <div className="ds-u-display--flex ds-u-justify-content--between ds-u-margin-y--6 create-apd-buttons">
        <Button onClick={backToDashboard}>Back to Dashboard</Button>
        <Button variation="primary" onClick={createNew}>Create an APD</Button>
      </div>
    </main>
  );
};

CreateAPDForm.propTypes = {
  createApd: PropType.func.isRequired
};

CreateAPDForm.defaultProps = {

};

const mapDispatchToProps = {
  createApd
};

const mapStateToProps = state => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(CreateAPDForm);
