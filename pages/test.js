import { useRouter } from 'next/router';
import Head from 'next/head';
import { useRef } from 'react';
import PropTypes from 'prop-types';

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

function Test({ session, toggleTheme }) {
  const router = useRouter();
  // TODO: Handle Errors here, such as no dashboards created
  const id = router.query.dashboard_id;
  const { data, error } = useSWR('/api/dashboards/' + id);

  console.log(data);
  // console.log(router.query);
  const featuresRef = useRef(null);

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
        <title>Care Quality Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header session={session} toggleTheme={toggleTheme} />
      <div></div>
    </div>
  );
}

Test.propTypes = {
  session: PropTypes.object.isRequired,
  toggleTheme: PropTypes.func.isRequired,
};

export default Test;