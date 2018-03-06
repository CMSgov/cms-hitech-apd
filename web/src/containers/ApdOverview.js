import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';

import FormLogger from '../util/formLogger';
import FormApdOverview from '../components/FormApdOverview';
import PageNavButtons from '../components/PageNavButtons';
import withSidebar from '../components/withSidebar';

class ApdOverview extends Component {
  showResults = (data) => {
    console.log(data);
  };

  render() {
    const { goTo } = this.props;

    return (
      <div>
        <FormLogger />
        <h1>Tell us more about your HITECH program</h1>
        <FormApdOverview onSubmit={this.showResults} />
        <PageNavButtons
          goTo={goTo}
          prev="/state-contacts"
          next="/activities-start"
        />
      </div>
    );
  }
}

ApdOverview.propTypes = {
  goTo: PropTypes.func.isRequired
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ goTo: (path) => push(path) }, dispatch);

export default connect(null, mapDispatchToProps)(withSidebar(ApdOverview));
