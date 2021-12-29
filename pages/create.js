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

              <div className={styles.Form}>
                <label>Background :</label>
                <select className={styles.BackgroundOptions}>
                  <option value="red">red</option>
                  <option value="blue">blue</option>
                  <option value="green">green</option>
                </select>
              </div>

              <div className={styles.TextBox}>
                <label htmlFor="question1">question 1 : </label>
                <Field type="question1" name="question1" size="50" />
                <ErrorMessage name="question1" component="span" />
                <div className={styles.quality}>
                  <label htmlFor="quality1"> Quality measured : </label>
                  <Field type="quality1" name="quality1" size="32" />
                </div>
              </div>

              <div className={styles.TextBox}>
                <label htmlFor="question2">question 2 : </label>
                <Field type="question2" name="question2" size="50" />
                <ErrorMessage name="question2" component="span" />
                <div className={styles.quality}>
                  <label htmlFor="quality2"> Quality measured : </label>
                  <Field type="quality2" name="quality2" size="32" />
                </div>
              </div>

              <div className={styles.TextBox}>
                <label htmlFor="question3">question 3 : </label>
                <Field type="question3" name="question3" size="50" />
                <ErrorMessage name="question3" component="span" />
                <div className={styles.quality}>
                  <label htmlFor="quality3"> Quality measured : </label>
                  <Field type="quality3" name="quality3" size="32" />
                </div>
              </div>

              <div className={styles.TextBox}>
                <label htmlFor="question4">question 4 : </label>
                <Field type="question4" name="question4" size="50" />
                <ErrorMessage name="question4" component="span" />
                <div className={styles.quality}>
                  <label htmlFor="quality4"> Quality measured : </label>
                  <Field type="quality4" name="quality4" size="32" />
                </div>
              </div>

              <div className={styles.TextBox}>
                <label htmlFor="question5">question 5 : </label>
                <Field type="question5" name="question5" size="50" />
                <ErrorMessage name="question5" component="span" />
                <div className={styles.quality}>
                  <label htmlFor="quality5"> Quality measured : </label>
                  <Field type="quality5" name="quality5" size="32" />
                </div>
              </div>

              <div className={styles.TextBox}>
                <label htmlFor="question6">question 6 : </label>
                <Field type="question6" name="question6" size="50" />
                <ErrorMessage name="question6" component="span" />
                <div className={styles.quality}>
                  <label htmlFor="quality6"> Quality measured : </label>
                  <Field type="quality6" name="quality6" size="32" />
                </div>
              </div>

              <div className={styles.TextBox}>
                <label htmlFor="question7">question 7 : </label>
                <Field type="question7" name="question7" size="50" />
                <ErrorMessage name="question7" component="span" />
                <div className={styles.quality}>
                  <label htmlFor="quality7"> Quality measured : </label>
                  <Field type="quality7" name="quality7" size="32" />
                </div>
              </div>

              <div className={styles.TextBox}>
                <label htmlFor="question1">question 8 : </label>
                <Field type="question8" name="question8" size="50" />
                <ErrorMessage name="question8" component="span" />
                <div className={styles.quality}>
                  <label htmlFor="quality8"> Quality measured : </label>
                  <Field type="quality8" name="quality8" size="32" />
                </div>
              </div>

              <div className={styles.TextBox}>
                <label htmlFor="question9">question 9 : </label>
                <Field type="question9" name="question9" size="50" />
                <ErrorMessage name="question9" component="span" />
                <div className={styles.quality}>
                  <label htmlFor="quality9"> Quality measured : </label>
                  <Field type="quality9" name="quality9" size="32" />
                </div>
              </div>

              <div className={styles.TextBox}>
                <label htmlFor="question10">question 10 : </label>
                <Field type="question10" name="question10" size="50" />
                <ErrorMessage name="question10" component="span" />
                <div className={styles.quality}>
                  <label htmlFor="quality10"> Quality measured : </label>
                  <Field type="quality10" name="quality10" size="32" />
                </div>
              </div>

              <div className={styles.TextBox}>
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
