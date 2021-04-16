import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { getIsAdmin, getIsFederal } from '../reducers/user.selector';
import AdminDashboard from './admin/AdminDashboard';
import StateDashboard from './StateDashboard';

const Dashboard = ({ isAdmin, isFederal, ...rest }) =>
  isAdmin || isFederal ? <AdminDashboard {...rest} /> : <StateDashboard {...rest} />;

Dashboard.propTypes = {
  isAdmin: PropTypes.bool.isRequired,
  isFederal: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  isAdmin: getIsAdmin(state),
  isFederal: getIsFederal(state)
});

export default connect(mapStateToProps)(Dashboard);

export { Dashboard as plain, mapStateToProps };
