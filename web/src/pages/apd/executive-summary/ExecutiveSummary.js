import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import {
  selectApdType,
  selectApdYears
} from '../../../redux/selectors/apd.selectors';
import { useParams } from 'react-router-dom';

import Waypoint from '../../../components/ConnectedWaypoint';
import Dollars from '../../../components/Dollars';
import Review from '../../../components/Review';
import { Section, Subsection } from '../../../components/Section';

import ActivityExecutiveSummary from './ActivityExecutiveSummary';
import ExecutiveSummaryBudget from './ExecutiveSummaryBudget';
import { APD_TYPE } from '@cms-eapd/common';

import {
  getAPDName,
  getMedicaidBusinessAreas,
  getUpdateStatus
} from '../../../redux/reducers/apd';
import {
  selectBudgetExecutiveSummary,
  selectBudgetGrandTotal
} from '../../../redux/selectors/budget.selectors';
import AlertMissingFFY from '../../../components/AlertMissingFFY';

import {
  arrayOfObjectsToStringList,
  businessAreaChoices,
  ffyList,
  updateStatusChoices
} from '../../../util/apd';

const ExecutiveSummary = ({
  apdName,
  apdType,
  data,
  medicaidBusinessAreas,
  total,
  updateStatus,
  years
}) => {
  const { apdId } = useParams();
  const { ffys } = total;
  const isApdMmis = apdType === APD_TYPE.MMIS;
  const noYears = !years.length;
  const statusList = updateStatusChoices(updateStatus);

  function renderSubtitle(apdType, updateStatus) {
    if (apdType === APD_TYPE.HITECH) {
      return <h3>HITECH Implementation APD Update (HITECH IAPD-U)</h3>;
    }
    if (updateStatus.isUpdateAPD) {
      return <h3>MMIS Implementation APD Update (MMIS IAPD-U)</h3>;
    }
    return <h3>MMIS Implementation APD (MMIS IAPD)</h3>;
  }

  function otherDetails() {
    if (medicaidBusinessAreas.other) {
      return (
        <p className="ds-c-choice__checkedChild">
          {medicaidBusinessAreas.otherMedicaidBusinessAreas}
        </p>
      );
    }
  }

  function renderMedicaidBusinessAreas() {
    if (isApdMmis) {
      var businessAreasList = businessAreaChoices(medicaidBusinessAreas);
      return (
        <div>
          <p className="ds-u-margin-top--1">
            <strong>Medicaid Business Area(s) :</strong>{' '}
            {!businessAreasList.length
              ? 'Provide at least one Medicaid Business Area.'
              : arrayOfObjectsToStringList(businessAreasList)}
          </p>
          {otherDetails()}
        </div>
      );
    }
    return null;
  }

  return (
    <React.Fragment>
      <Waypoint />
      <AlertMissingFFY />
      <Section resource="executiveSummary">
        <Waypoint id="executive-overview-summary" />
        <Subsection
          id="executive-overview-summary"
          resource="executiveSummary.overviewSummary"
        >
          {renderSubtitle(apdType, updateStatus)}
          <div className="ds-c-list--bare">
            <p className="ds-u-margin-top--1">
              <strong>APD Name :</strong> {apdName}
            </p>
            <p className="ds-u-margin-top--1">
              <strong>Update Type :</strong>{' '}
              {updateStatus.isUpdateAPD
                ? arrayOfObjectsToStringList(statusList)
                : 'New Project'}
            </p>
            {renderMedicaidBusinessAreas()}
          </div>
        </Subsection>
        <Waypoint id="executive-activities-summary" />
        <Subsection
          id="executive-activities-summary"
          resource="executiveSummary.activitiesSummary"
        >
          {/* Show relevant activities fields based on APD type selected */}
          {!noYears && (
            <ActivityExecutiveSummary
              apdId={apdId}
              data={data}
              ffys={ffys}
              isApdMmis={isApdMmis}
              noYears={noYears}
            />
          )}

          <hr className="ds-u-margin--0" />
          <Review
            heading="Total Cost"
            headingLevel="4"
            className="ds-u-border--0"
          >
            <p>
              Verify that this information is correct. Edit activities above to
              make changes.
            </p>
            <div className="ds-c-list--bare">
              <p>
                <strong>Federal Fiscal Years Requested:</strong> FFY{' '}
                {!noYears && years.join(', ')}
              </p>
              <p>
                <strong>Total Computable Medicaid Cost:</strong>{' '}
                <Dollars>{total.medicaid}</Dollars> (
                <Dollars>{total.federal}</Dollars> Federal share)
              </p>
              <p>
                <strong>Total Funding Request:</strong>{' '}
                <Dollars>{total.combined}</Dollars>
              </p>
              {!noYears && ffyList(total.ffys)}
            </div>
          </Review>
        </Subsection>

        <Waypoint id="executive-summary-budget-table" />
        {/* Show relevant budgets based on APD type selected */}
        {!noYears && <ExecutiveSummaryBudget />}
      </Section>
    </React.Fragment>
  );
};

ExecutiveSummary.propTypes = {
  apdName: PropTypes.string,
  apdType: PropTypes.string,
  data: PropTypes.array.isRequired,
  medicaidBusinessAreas: PropTypes.object,
  total: PropTypes.object.isRequired,
  updateStatus: PropTypes.object.isRequired,
  years: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  apdName: getAPDName(state),
  apdType: selectApdType(state),
  data: selectBudgetExecutiveSummary(state),
  medicaidBusinessAreas: getMedicaidBusinessAreas(state),
  total: selectBudgetGrandTotal(state),
  updateStatus: getUpdateStatus(state),
  years: selectApdYears(state)
});

export default connect(mapStateToProps)(ExecutiveSummary);

export { ExecutiveSummary as plain, mapStateToProps };
