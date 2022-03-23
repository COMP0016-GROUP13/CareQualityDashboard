import PropTypes from 'prop-types';
import { Alert, Button, Message } from 'rsuite';

import { Header } from '../components';
import { signIn, getSession } from 'next-auth/client';
import styles from './create.module.css';

import { Formik, Form, Field, ErrorMessage } from 'formik';

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

export async function getServerSideProps(context) {
  return { props: { session: await getSession(context) } };
}

function Home({ session, toggleTheme }) {
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
      <Header session={session} toggleTheme={toggleTheme} />
      <div className={styles.createTitle}>
        <h1>Create a Dashboard</h1>
      </div>

      <Formik
        initialValues={{
          title: '',
        }}
        validate={values => {
          const errors = {};
          if (!values.title) {
            errors.title = 'Required';
          }
          return errors;
        }}
        onSubmit={async (values, { setSubmitting }) => {
          // post data to server
          const res = await fetch('/api/dashboards/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: values.title,
            }),
          }).then(res => res.json());

          if (res.error) {
            Alert.error(res.message, 3000);
          } else {
            Alert.success('New dashboard successfully added', 3000);
            setSubmitting(false);
          }
        }}>
        {({ isSubmitting, dirty, handleReset }) => (
          <div className={styles.Form}>
            <div>
              <h2>Please enter a title for your new dashboard</h2>
            </div>
            <Form>
              <div className={styles.TextBox}>
                <label>
                  <Field type="text" name="title" />
                </label>
                <ErrorMessage name="title" component="span" />
              </div>

              <div className={styles.Buttons}>
                <button
                  className={styles.Button}
                  type="button"
                  onClick={handleReset}
                  disabled={!dirty || isSubmitting}>
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={styles.Button}>
                  Submit
                </button>
              </div>
            </Form>
          </div>
        )}
      </Formik>
    </div>
  );
}

Home.propTypes = {
  session: PropTypes.object.isRequired,
  toggleTheme: PropTypes.func.isRequired,
};

export default Home;
