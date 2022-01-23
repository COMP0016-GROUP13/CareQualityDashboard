import { useRouter } from 'next/router';
import Head from 'next/head';
import { useRef } from 'react';
import PropTypes from 'prop-types';

import { Header } from '../components';
import { Button, Message } from 'rsuite';
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
  const router = useRouter();
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
      <Header session={session} toggleTheme={toggleTheme} />

      <h1>Create a Dashboard</h1>
      <Formik
        initialValues={{
          title: '',
          question1: '',
          question2: '',
          question3: '',
          question4: '',
          question5: '',
          question6: '',
          question7: '',
          question8: '',
          question9: '',
          question10: '',
        }}
        validate={values => {
          const errors = {};
          if (!values.title) {
            errors.title = 'Required';
          }

          if (!values.question1) {
            errors.question1 = 'Required';
          }
          if (!values.quality1) {
            errors.quality1 = 'Required';
          }
          if (!values.question2) {
            errors.question2 = 'Required';
          }
          if (!values.question3) {
            errors.question3 = 'Required';
          }
          if (!values.question4) {
            errors.question4 = 'Required';
          }
          if (!values.question5) {
            errors.question5 = 'Required';
          }
          if (!values.question6) {
            errors.question6 = 'Required';
          }
          if (!values.question7) {
            errors.question7 = 'Required';
          }
          if (!values.question8) {
            errors.question8 = 'Required';
          }
          if (!values.question9) {
            errors.question9 = 'Required';
          }
          if (!values.question10) {
            errors.question10 = 'Required';
          }
          if (!values.quality1) {
            errors.quality1 = 'Required';
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          // post data to server
          alert(JSON.stringify(values, null, 2));
          setSubmitting(false);
        }}>
        {({ isSubmitting, dirty, handleReset }) => (
          <div className={styles.Form}>
            <Form>
              <div className={styles.TextBox}>
                <label>
                  Title
                  <Field type="text" name="title" />
                </label>
                <ErrorMessage name="title" component="span" />
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
