import { useRouter } from 'next/router';
import Head from 'next/head';
import { useRef } from 'react';
import PropTypes from 'prop-types';
import { Header } from '../components';
import { Button, Message } from 'rsuite';
import { signIn, getSession } from 'next-auth/client';
import styles from './DashboardNav.module.css';
import useSWR from '../lib/swr';

const errors = {
  configuration: {
    heading: 'Server error',
    message: (
      <div>
        <p>There is a problem with the server configuration.</p>
        <p>Check the server logs for more information.</p>
      </div>
    ),
  },
  accessdenied: {
    heading: 'Access Denied',
    message: (
      <div>
        <p>You do not have permission to sign in.</p>
        <p>
          <Button
            appearance="primary"
            onClick={() => signIn('keycloak', { callbackUrl: '/' })}>
            Sign in
          </Button>
        </p>
      </div>
    ),
  },
  verification: {
    heading: 'Unable to sign in',
    message: (
      <div>
        <p>The sign in link is no longer valid.</p>
        <p>It may have be used already or it may have expired.</p>
        <p>
          <Button
            appearance="primary"
            onClick={() => signIn('keycloak', { callbackUrl: '/' })}>
            Sign in
          </Button>
        </p>
      </div>
    ),
  },
  departmentdeleted: {
    heading: 'Department deleted',
    message: (
      <div>
        <p>Your department was deleted by your hospital.</p>
        <p>
          Please log in again, and request a new join URL to join another
          department.
        </p>
        <p>
          <Button
            appearance="primary"
            onClick={() => signIn('keycloak', { callbackUrl: '/' })}>
            Sign in
          </Button>
        </p>
      </div>
    ),
  },
  invaliduser: {
    heading: 'Unable to sign in',
    message: (
      <div>
        <p>There was an error logging in. Please try again.</p>
        <p>
          <Button
            appearance="primary"
            onClick={() => signIn('keycloak', { callbackUrl: '/' })}>
            Sign in
          </Button>
        </p>
      </div>
    ),
  },
};

function DashboardNav({ session, toggleTheme }) {
  const router = useRouter();
  const dashboardId = router.query.dashboard_id;

  const showError = error => {
    // Don't do exact match
    error = error.toLowerCase();
    const key = Object.keys(errors).find(e => error.indexOf(e) > -1);

    if (key) {
      const details = errors[key];
      return (
        <Message
          type="error"
          closable
          title={details.heading}
          description={details.message}
        />
      );
    }

    console.error('Unknown error');
    return null;
  };

  return (
    <div>
      <Head>
        <title>MultiDashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header session={session} toggleTheme={toggleTheme} />
      <div className={styles.container}>
        {router.query && router.query.error && showError(router.query.error)}
        <main className={styles.mainContent}>
          {/* back button */}
          <button
            className={styles.backButton}
            onClick={() => router.push('/view')}>
            <img src="/images/backButton.png" alt="Go Back" width="26px" />
            Go Back
          </button>

          {/* TODO need to account for Dashboard name */}
          <h2 className={styles.DashboardName}>Dashboard Name</h2>
          <div className={styles.navItems}>
            <div>
              {/* TODO account for different types of users */}
              {
                <>
                  <button
                    onClick={() => {
                      router.push({
                        pathname: '/statistics',
                        query: { dashboard_id: dashboardId },
                      });
                    }}
                    className={styles.navItem}>
                    Statistics
                  </button>

                  <button
                    onClick={() => {
                      router.push({
                        pathname: '/self-reporting',
                        query: { dashboard_id: dashboardId },
                      });
                    }}
                    className={styles.navItem}>
                    Self-reporting
                  </button>
                </>
              }
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

DashboardNav.propTypes = {
  session: PropTypes.object.isRequired,
  toggleTheme: PropTypes.func.isRequired,
};

export default DashboardNav;
