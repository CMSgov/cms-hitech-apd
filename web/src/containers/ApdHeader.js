import PropTypes from 'prop-types';
import { Button } from '@cmsgov/design-system';
import React from 'react';
import { connect } from 'react-redux';

import { getAPDCreation, getAPDName, getAPDYearRange } from '../reducers/apd';
import { setApdName } from '../actions/editApd';

import Icon, { faEdit } from '../components/Icons';

const ApdHeader = ({ apdName, setName, year }) => {
  const onBlur = (e) => {
    const apdNameInput = e.target.value;

    if (apdNameInput.trim() === '') {
      setName('Untitled APD')
    } else {
      setName(apdNameInput)
    }
  }

  return (
    <div>
      <div id='apd-title-container' className='flex-align-row'>
        <div id='editable-label'>
          <input
            id='apd-title-input'
            className='ds-h1 apd--title'
            type='text'
            value={apdName}
            onChange={value => setName(value.target.value)}
            onBlur={onBlur}
            size={apdName.length}
          />
        </div>
        <Button id='title-edit-link' class='ds-c-button ds-c-button--transparent' onClick={() => {
          const e = document.getElementById('apd-title-input')

          e.click();
        }}>
          <Icon icon={faEdit} style={{ width: '14px' }} /> Edit
        </Button>
      </div>
      <h1 className="ds-h5 ds-u-margin-top--1 ds-u-margin-bottom--3">
        HITECH IAPD | FFY {year}
      </h1>
    </div>
  );
};

ApdHeader.propTypes = {
  // apdCreated: PropTypes.string.isRequired,
  apdName: PropTypes.string,
  setName: PropTypes.func.isRequired,
  year: PropTypes.string.isRequired
};

ApdHeader.defaultProps = { apdName: '' };

const mapStateToProps = state => ({
  apdCreated: getAPDCreation(state),
  apdName: getAPDName(state),
  year: getAPDYearRange(state)
});

const mapDispatchToProps = {
  setName: setApdName
}

export default connect(mapStateToProps, mapDispatchToProps)(ApdHeader);

export { ApdHeader as plain, mapStateToProps };
