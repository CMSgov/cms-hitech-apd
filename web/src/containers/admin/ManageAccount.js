import PropTypes from 'prop-types';
import React, { useState, Fragment } from 'react';
import { connect } from 'react-redux';

import { useHistory } from 'react-router-dom';

import { 
  createAccessRequest as actualCreateAccessRequest,
  completeAccessRequest as actualCompleteAccessRequest
} from '../../actions/auth';

import StateAccessRequest from '../StateAccessRequest';
import StateAccessRequestConfirmation from '../StateAccessRequestConfirmation';

const ManageAccount = ({
  currentAffiliations, 
  createAccessRequest,
  completeAccessRequest,
  error
}) => {

  const history = useHistory();

  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleCreateAccessRequest = async states => {
    const response = await createAccessRequest(states);
    if (response) { setShowConfirmation(true) };
  };
  
  const handleCompleteAccessRequest = async () => {
    await completeAccessRequest();
    history.push('/');
  };
  
  return (
    <Fragment>
      {showConfirmation ? 
        <StateAccessRequestConfirmation action={handleCompleteAccessRequest} />
        : <StateAccessRequest
            saveAction={handleCreateAccessRequest}
            fetching={false}
            errorMessage={error}
            currentAffiliations={currentAffiliations}
          />
      }
    </Fragment>
  );
};

ManageAccount.defaultProps = {
  error: null
};

ManageAccount.propTypes = {
  currentAffiliations: PropTypes.array.isRequired,
  createAccessRequest: PropTypes.func.isRequired,
  completeAccessRequest: PropTypes.func.isRequired,
  error: PropTypes.string
};

const mapDispatchToProps = {
  createAccessRequest: actualCreateAccessRequest,
  completeAccessRequest: actualCompleteAccessRequest
};

const mapStateToProps = state => ({
  currentAffiliations: state.user.data.affiliations,
  error: state.auth.error
});

export default connect(mapStateToProps, mapDispatchToProps)(ManageAccount);

export { ManageAccount as plain, mapStateToProps, mapDispatchToProps };