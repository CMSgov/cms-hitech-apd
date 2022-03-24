import React from 'react';
import PropTypes from 'prop-types';
import {
  Switch,
  Route,
  Redirect,
  useRouteMatch as actualUseRouteMatch
} from 'react-router-dom';

<<<<<<< HEAD:web/src/pages/apd/ApdPageRoutes.js
import ApdHeader from '../../layout/header/ApdHeader';
import Activities from '../../containers/activity/All';
import EntryPage from '../../containers/activity/EntryPage';
import AssurancesAndCompliance from '../../containers/AssurancesAndCompliance';
import Export from '../../containers/ApdExport';
import ApdSummary from '../../containers/ApdSummary';
import ExecutiveSummary from '../../containers/ExecutiveSummary';
import PreviousActivities from '../../containers/PreviousActivities';
import ProposedBudget from '../../containers/ProposedBudget';
import ScheduleSummary from '../../containers/ScheduleSummary';
import StateProfile from '../../components/ApdStateProfile';
=======
import ApdHeader from '../layout/header/ApdHeader';
import Activities from './activity/All';
import EntryPage from './activity/EntryPage';
import AssurancesAndCompliance from './AssurancesAndCompliance';
import Export from './ApdExport';
import ApdSummary from './ApdSummary';
import ExecutiveSummary from './ExecutiveSummary';
import PreviousActivities from './PreviousActivities';
import ProposedBudget from './ProposedBudget';
import ScheduleSummary from './ScheduleSummary';
import StateProfile from '../components/ApdStateProfile';
>>>>>>> 886da3951acbe1d7ffdbd7d636ac4e66de9a1d0f:web/src/containers/ApdPageRoutes.js

const ApdPageRoutes = ({ apdId, useRouteMatch }) => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/activity/:activityIndex`}>
        <EntryPage />
      </Route>

      <Route path={path}>
        <ApdHeader />

        <Route exact path={path}>
          <Redirect to={`/apd/${apdId}/apd-overview`} />
        </Route>

        <Route path={`${path}/state-profile`}>
          <StateProfile />
        </Route>

        <Route path={`${path}/apd-overview`}>
          <ApdSummary />
        </Route>

        <Route path={`${path}/previous-activities`}>
          <PreviousActivities />
        </Route>

        <Route path={`${path}/activities`}>
          <Activities />
        </Route>

        <Route path={`${path}/schedule-summary`}>
          <ScheduleSummary />
        </Route>

        <Route path={`${path}/proposed-budget`}>
          <ProposedBudget />
        </Route>

        <Route path={`${path}/assurances-and-compliance`}>
          <AssurancesAndCompliance />
        </Route>

        <Route path={`${path}/executive-summary`}>
          <ExecutiveSummary />
        </Route>

        <Route path={`${path}/export`}>
          <Export />
        </Route>
      </Route>
    </Switch>
  );
};

ApdPageRoutes.propTypes = {
  apdId: PropTypes.string,
  useRouteMatch: PropTypes.func
};

ApdPageRoutes.defaultProps = {
  apdId: null,
  useRouteMatch: actualUseRouteMatch
};

export default ApdPageRoutes;
