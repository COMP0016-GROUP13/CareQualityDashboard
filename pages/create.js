import PropTypes from 'prop-types';
import { Alert } from 'rsuite';
import { Header } from '../components';
import { getSession } from 'next-auth/client';
import styles from './create.module.css';

import { Formik, Form, Field, ErrorMessage } from 'formik';

export async function getServerSideProps(context) {
  return { props: { session: await getSession(context) } };
}

function Home({ session, toggleTheme }) {
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
