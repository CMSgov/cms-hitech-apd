import { Dialog, Button } from '@cmsgov/design-system';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Countdown from 'react-countdown';
import { v4 as uuidv4 } from 'uuid';
import { useHistory } from 'react-router-dom';

import Icon, { Spinner, faExclamationTriangle } from './Icons';

import { extendSession, logout } from '../redux/actions/auth';

const SessionEndingAlert = ({
  isSessionEnding,
  isExtendingSession,
  isLoggingOut,
  expiresAt,
  extend,
  logoutAction
}) => {
  const history = useHistory();
  const className = isSessionEnding
    ? 'alert--session-expiring__active'
    : 'alert--session-expiring__inactive';

  useEffect(() => {
    console.log('expiresAt', expiresAt);
  }, [expiresAt, isSessionEnding]);
  /* eslint-disable react/prop-types */
  const createTimer = ({ minutes }) => {
    console.log('minutes...', minutes);
    if (minutes == 1) {
      return (
        <span id="session-timeout" aria-live="polite">
          Your session will end in less than 1 minute. If you’d like to keep
          working, select <em>stay signed in</em>.
        </span>
      );
    }
    return (
      <span id="session-timeout" aria-live="polite">
        Your session will end in {minutes} minutes. If you’d like to keep
        working, select <em>stay signed in</em>.
      </span>
    );
  };

  const logoutAndRedirect = async () => {
    await logoutAction();
    history.push('/login');
  };

  return (
    <div
      aria-hidden={!isSessionEnding}
      className={`alert--session-expiring ${className}`}
    >
      <div id="session-ending-modal" />
      {isSessionEnding && (
        <Dialog
          key={uuidv4()}
          heading={
            <div>
              <Icon icon={faExclamationTriangle} /> Your session is expiring.
            </div>
          }
          alert
          getApplicationNode={() =>
            document.getElementById('session-ending-modal')
          }
          className="ds-u-left-border-warning"
          actionsClassName="ds-u-text-align--right ds-u-margin-bottom--0"
          actions={[
            <Button
              variation="transparent"
              onClick={logoutAndRedirect}
              key={uuidv4()}
            >
              {isLoggingOut && <Spinner />}
              {isLoggingOut ? ' Signing out' : 'Sign out'}
            </Button>,
            <Button variation="primary" onClick={extend} key={uuidv4()}>
              {isExtendingSession && <Spinner />}
              {isExtendingSession ? ' Signing in' : 'Stay signed in'}
            </Button>
          ]}
          ariaCloseLabel="Close and continue"
          closeText={<span className="ds-u-display--none" />}
          onExit={extend}
          underlayClickExits={false}
          escapeExitDisabled
          size="wide"
        >
          <Countdown
            date={expiresAt - 5000}
            key={uuidv4()}
            renderer={createTimer}
            onComplete={logoutAndRedirect}
            onStop={extend}
            intervalDelay={60000}
          />
        </Dialog>
      )}
    </div>
  );
};

SessionEndingAlert.propTypes = {
  isSessionEnding: PropTypes.bool.isRequired,
  isExtendingSession: PropTypes.bool.isRequired,
  isLoggingOut: PropTypes.bool.isRequired,
  expiresAt: PropTypes.number,
  extend: PropTypes.func.isRequired,
  logoutAction: PropTypes.func.isRequired
};

const mapStateToProps = ({
  auth: { isSessionEnding, isExtendingSession, isLoggingOut, expiresAt }
}) => ({
  isSessionEnding,
  isExtendingSession,
  isLoggingOut,
  expiresAt
});

const mapDispatchToProps = {
  extend: extendSession,
  logoutAction: logout
};

export default connect(mapStateToProps, mapDispatchToProps)(SessionEndingAlert);

export { SessionEndingAlert as plain, mapStateToProps, mapDispatchToProps };
