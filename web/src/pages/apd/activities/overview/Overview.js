import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { APD_TYPE } from '@cms-eapd/common/utils/constants';
import MMISOverview from './MMISOverview';
import HITECHOverview from './HITECHOverview';

const Overview = ({ activityIndex, apdType }) => {
  const apdTypeToActivityOverviewMapping = {
    [APD_TYPE.HITECH]: <HITECHOverview activityIndex={activityIndex} />,
    [APD_TYPE.MMIS]: <MMISOverview activityIndex={activityIndex} />
  };

  return apdTypeToActivityOverviewMapping[apdType];
};

Overview.defaultProps = {
  apdType: APD_TYPE.HITECH
};

Overview.propTypes = {
  activityIndex: PropTypes.number.isRequired,
  apdType: PropTypes.oneOf(Object.values(APD_TYPE))
};

const mapStateToProps = state => {
  return {
    apdType: state.apd.data.apdType
  };
};

export default connect(mapStateToProps)(Overview);

export { Overview as plain, mapStateToProps };
