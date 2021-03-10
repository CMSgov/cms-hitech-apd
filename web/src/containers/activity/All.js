import { Button } from '@cmsgov/design-system';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import EntryDetails from './EntryDetails';
import { addActivity as actualAddActivity } from '../../actions/editActivity';
import { Section } from '../../components/Section';
import { selectAllActivities } from '../../reducers/activities.selectors';

const All = ({ addActivity, activities }) => {
  return (
    <Section id="activities" resource="activities">
      <hr class="custom-hr" />
      {activities.map((activity, index) => (
        <EntryDetails activityIndex={index} key={activity.key} />
      ))}
      <Button className="ds-u-margin-top--4" onClick={addActivity}>
        Add another activity
      </Button>
    </Section>
  );
};

All.propTypes = {
  addActivity: PropTypes.func.isRequired,
  activities: PropTypes.arrayOf(PropTypes.object).isRequired
};

const mapStateToProps = state => ({ activities: selectAllActivities(state) });

const mapDispatchToProps = {
  addActivity: actualAddActivity
};

export default connect(mapStateToProps, mapDispatchToProps)(All);

export { All as plain, mapStateToProps, mapDispatchToProps };
