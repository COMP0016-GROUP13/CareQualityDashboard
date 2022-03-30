/**
 * Authors: Sarvesh Rajdev, Nathan D'Souza
 */
import { useRouter } from 'next/router';
import Head from 'next/head';
import PropTypes from 'prop-types';
import { Header } from '../components';
import { Button, Message } from 'rsuite';
import { signIn, getSession } from 'next-auth/client';
import styles from './DashboardNav.module.css';

import { Roles } from '../lib/constants';

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
  return null;
};

export async function getServerSideProps(context) {
  return { props: { session: await getSession(context) } };
}

/**
 * The page that provides the user with different options within the dashboard
 * If the user is not logged in, they are prompted to login.
 *
 * It is only accessible to all Users
 *
 *
 * @param session the user's session object to decide what to display
 * @param toggleTheme the global function to toggle the current theme
 */

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

  const options = [];

  if (session.user.roles.includes(Roles.USER_TYPE_CLINICIAN)) {
    options.push('statistics');
    options.push('self-reporting');
  } else if (session.user.roles.includes(Roles.USER_TYPE_DEPARTMENT)) {
    options.push('statistics');
    options.push('self-reporting');
    options.push('manage');
    options.push('admin');
  } else if (session.user.roles.includes(Roles.USER_TYPE_ADMIN)) {
    options.push('admin');
  } else if (session.user.roles.includes(Roles.USER_TYPE_HOSPITAL)) {
    options.push('statistics');
  } else if (session.user.roles.includes(Roles.USER_TYPE_HEALTH_BOARD)) {
    options.push('statistics');
  }

  return (
    <>
      <Head>
        <title>MultiDashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header session={session} toggleTheme={toggleTheme} />

      <div className={styles.container}>
        {router.query && router.query.error && showError(router.query.error)}
        <main className={styles.mainContent}>
          {/* back button */}
          <Button
            className={styles.backButton}
            onClick={() => router.push('/view')}>
            Go Back
          </Button>

          <h2 className={styles.DashboardName}>Dashboard Navigation</h2>
          <div className={styles.navItems}>
            <div>
              {
                <>
                  {options.map(name => (
                    <button
                      key={name}
                      onClick={() => {
                        router.push({
                          pathname: '/' + name,
                          query: { dashboard_id: dashboardId },
                        });
                      }}
                      className={styles.navItem}>
                      {name}
                    </button>
                  ))}
                </>
              }
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

DashboardNav.propTypes = {
  session: PropTypes.object.isRequired,
  toggleTheme: PropTypes.func.isRequired,
};
export default DashboardNav;
