import PropType from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

<<<<<<< HEAD:web/src/pages/dashboard/fed-dashboard/FederalDashboard.js
import FederalAdmin from '../../admin/fed-admin/FederalAdmin';
=======
import FederalAdmin from '../../../containers/admin/FederalAdmin';
>>>>>>> 886da3951acbe1d7ffdbd7d636ac4e66de9a1d0f:web/src/containers/FederalDashboard.js
import { ApprovalStatus } from '../state-dashboard/AffiliationStatus';

import { getUserStateOrTerritoryStatus } from '../../../reducers/user.selector';
import { AFFILIATION_STATUSES } from '../../../constants';

const FederalDashboard = ({ approvalStatus }) => {
  const isApproved = approvalStatus === AFFILIATION_STATUSES.APPROVED;

  return (
    <main
      id="start-main-content"
      className="ds-l-container--fluid ds-u-margin-x--5 ds-u-margin-bottom--5"
    >
      <h1>Federal Administrator Portal</h1>
      {isApproved && <FederalAdmin />}
      {!isApproved && (
        <ApprovalStatus
          status={approvalStatus}
          mailTo="CMS-EAPD@cms.hhs.gov"
          administratorType="Federal"
        />
      )}
    </main>
  );
};

FederalDashboard.propTypes = {
  approvalStatus: PropType.string.isRequired
};

const mapStateToProps = state => ({
  approvalStatus:
    getUserStateOrTerritoryStatus(state) || AFFILIATION_STATUSES.REQUESTED
});

export default connect(mapStateToProps)(FederalDashboard);

export { FederalDashboard as plain, mapStateToProps };
