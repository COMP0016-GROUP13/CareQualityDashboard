import { useRouter } from 'next/router';
import Head from 'next/head';
import { useRef } from 'react';
import PropTypes, { arrayOf } from 'prop-types';

import { Header } from '../components';
import { Button, Message } from 'rsuite';
import { signIn, getSession } from 'next-auth/client';
import styles from './view.module.css';
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

/**
 * Fetches dashboards from the backend
 */
const fetchDashboards = () => {
  const { data, error } = useSWR('/api/dashboards', {
    revalidateOnFocus: false,
  });

  if (data) {
    return { data: data, error: error || data.error, message: data.message };
  }
  return { data: null, error: error, message: error ? error.message : null };
};

export async function getServerSideProps(context) {
  return { props: { session: await getSession(context) } };
}

function View({ session, toggleTheme }) {
  const router = useRouter();
  // TODO: Handle Errors here, such as no dashboards created
  const { data, error, message } = fetchDashboards();
  const featuresRef = useRef(null);

  if (data != null && data.length < 1) {
    return (
      <>
        <Head>
          <title>MultiDashboard</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Header session={session} toggleTheme={toggleTheme} />

        <h2 className={styles.title}>
          You currently do not have any dashboards yet.{' '}
        </h2>
        <h5 className={styles.title}>
          Please contact your system administrator to assign a dashboard{' '}
        </h5>
      </>
    );
  }
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
      <div className={styles.squares}>
        <div className={styles.container}>
          {router.query && router.query.error && showError(router.query.error)}
          <main className={styles.mainContent}>
            <h2 className={styles.title}>Here are your dashboards</h2>
            <div className={styles.features} ref={featuresRef}>
              <div className={styles.feature}>
                {/* Data is the data for all the dashboards, this includes id and name as stated in API */}
                {(data = arr.sort(data))}
                {data &&
                  data.map(dashboard => (
                    <>
                      <button
                        onClick={() => {
                          router.push({
                            pathname: '/DashboardNav',
                            query: { dashboard_id: dashboard.id },
                          });
                        }}
                        id={dashboard.id}
                        className={styles.DashboardButtons}>
                        {dashboard.name}
                      </button>
                    </>
                  ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

View.propTypes = {
  session: PropTypes.object.isRequired,
  toggleTheme: PropTypes.func.isRequired,
};

export default View;
