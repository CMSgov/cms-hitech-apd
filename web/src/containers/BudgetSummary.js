import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import Dollars from '../components/Dollars';
import { selectBudgetActivitiesByFundingSource } from '../reducers/budget.selectors';

const categoryLookup = {
  statePersonnel: { title: 'State Staff', sortOrder: 0 },
  expenses: { title: 'Other State Expenses', sortOrder: 1 },
  contractors: { title: 'Private Contractor', sortOrder: 2 },
  combined: { title: 'Subtotal', sortOrder: 3 }
};

const categorySort = (key1, key2) =>
  categoryLookup[key1].sortOrder - categoryLookup[key2].sortOrder;

function DataRow({ data, title }) {
  return (
    <tr
      className={
        title === categoryLookup.combined.title
          ? 'budget-table--subtotal budget-table--row__highlight'
          : ''
      }
    >
      <th scope="row">{title}</th>
      <td className="budget-table--number">
        <Dollars>{data.state}</Dollars>
      </td>
      <td className="budget-table--number">
        <Dollars>{data.federal}</Dollars>
      </td>
      <td className="budget-table--number">
        <Dollars>{data.medicaid}</Dollars>
      </td>
    </tr>
  );
}

DataRow.propTypes = {
  data: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired
};

const DataRowGroup = ({ data, entries, year }) => (
  <Fragment>
    {Object.keys(data)
      .sort(categorySort)
      .map(key => (
        <DataRow
          key={key}
          category={key}
          data={data[key][year]}
          entries={entries}
          title={categoryLookup[key].title}
          year={year}
        />
      ))}
  </Fragment>
);

DataRowGroup.propTypes = {
  data: PropTypes.object.isRequired,
  entries: PropTypes.array.isRequired,
  year: PropTypes.string.isRequired
};

const HeaderRow = ({ yr }) => {
  return (
    <tr>
      <th key={yr} id={`summary-budget-fy-${yr}`}>
        {yr === 'total' ? 'Total' : `FFY ${yr}`}
      </th>
      <th className="ds-u-text-align--right" scope="col">
        State Total
      </th>
      <th className="ds-u-text-align--right" scope="col">
        Federal Total
      </th>
      <th className="ds-u-text-align--right" scope="col">
        Medicaid Total Computable
      </th>
    </tr>
  );
};

HeaderRow.propTypes = {
  yr: PropTypes.string.isRequired
};

const BudgetSummary = ({ activities, data, years }) => (
  <Fragment>
    <h4 className="ds-h4" aria-hidden="true">
      HIT Activities
    </h4>
    {[...years, 'total'].map(yr => (
      <table className="budget-table" key={yr}>
        <caption className="ds-u-visibility--screen-reader">
          FFY {yr} HIT Activities
        </caption>
        <thead>
          <HeaderRow yr={yr} />
        </thead>
        <tbody>
          <DataRowGroup data={data.hit} entries={activities.hit} year={yr} />
        </tbody>
      </table>
    ))}

    <h4 className="ds-h4" aria-hidden="true">
      HIE Activities
    </h4>
    {[...years, 'total'].map(yr => (
      <table className="budget-table" key={yr}>
        <caption className="ds-u-visibility--screen-reader">
          FFY {yr} HIE Activities
        </caption>
        <thead>
          <HeaderRow yr={yr} />
        </thead>
        <tbody>
          <DataRowGroup data={data.hie} entries={activities.hie} year={yr} />
        </tbody>
      </table>
    ))}

    <h4 className="ds-h4" aria-hidden="true">
      MMIS Activities
    </h4>
    {[...years, 'total'].map(yr => (
      <table className="budget-table" key={yr}>
        <caption className="ds-u-visibility--screen-reader">
          FFY {yr} MMIS Activities
        </caption>
        <thead>
          <HeaderRow yr={yr} />
        </thead>
        <tbody>
          <DataRowGroup data={data.mmis} entries={activities.mmis} year={yr} />
        </tbody>
      </table>
    ))}

    <table className="budget-table">
      <caption className="ds-h4">Activities Totals</caption>
      <thead>
        <tr>
          <td className="th" id="summary-budget-null1" />
          <th scope="col" className="ds-u-text-align--right">
            State Total
          </th>
          <th scope="col" className="ds-u-text-align--right">
            Federal Total
          </th>
          <th scope="col" className="ds-u-text-align--right">
            Medicaid Total Computable
          </th>
        </tr>
      </thead>
      <tbody>
        {Object.keys(data.combined).map(ffy => {
          const combined = data.combined[ffy];
          return (
            <tr
              key={ffy}
              className={
                ffy === 'total'
                  ? 'budget-table--row__highlight budget-table--total'
                  : ''
              }
            >
              <th scope="row">{ffy === 'total' ? 'Total' : `FFY ${ffy}`}</th>
              <td className="budget-table--number">
                <Dollars>{combined.state}</Dollars>
              </td>
              <td className="budget-table--number">
                <Dollars>{combined.federal}</Dollars>
              </td>
              <td className="budget-table--number">
                <Dollars>{combined.medicaid}</Dollars>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </Fragment>
);

BudgetSummary.propTypes = {
  activities: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  years: PropTypes.array.isRequired
};

const mapStateToProps = state => {
  return {
    activities: selectBudgetActivitiesByFundingSource(state),
    data: state.budget,
    years: state.apd.data.years
  };
};

export default connect(mapStateToProps)(BudgetSummary);

export {
  BudgetSummary as plain,
  mapStateToProps,
  DataRow,
  DataRowGroup,
  HeaderRow
};
