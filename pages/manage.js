import { getSession } from 'next-auth/client';
import Head from 'next/head';
import { useState } from 'react';
import PropTypes from 'prop-types';
import { Alert, Button, ButtonGroup, Modal } from 'rsuite';
import {
  UrlsTable,
  Header,
  LoginMessage,
  NewUserForm,
  DepartmentsTable,
  NoAccess,
  NewEntityForm,
} from '../components';

import { Roles } from '../lib/constants';
import styles from './manage.module.css';
import { Formik, Form, Field, ErrorMessage } from 'formik';

export async function getServerSideProps(context) {
  return {
    props: {
      session: await getSession(context),
      host: context.req.headers.host,
    },
  };
}

/**
 * The manage page is used to provide various management functionality depending on the user type.
 * If the user is not logged in, they are prompted to login.
 *
 * The current management functionality, for each user type is:
 * - Department Managers: Manage the department-specific Question Training URLs, and their
 * department's Join Code
 * - Hospitals: Manage the departments in their hospital, and their join codes
 * - Administrators: Manage the health boards, hospitals, and users in the system
 *
 * All other users do not have access to this page.
 *
 * @param session the user's session object to decide what to display
 * @param toggleTheme the global function to toggle the current theme
 * @param host The host name of the website
 */
function Manage({ session, host, toggleTheme }) {
  const [addNewUserModalUserType, setAddNewUserModalUserType] = useState(null);
  const [addNewEntityModalType, setAddNewEntityModalType] = useState(null);

  if (!session) {
    return (
      <div>
        <Header session={session} toggleTheme={toggleTheme} />
        <LoginMessage />
      </div>
    );
  }

  const renderContent = () => {
    if (session.user.roles.includes(Roles.USER_TYPE_DEPARTMENT)) {
      return (
        <div>
          <h3>Manage the URLs of each question</h3>
          <UrlsTable session={session} host={host} />
        </div>
      );
    } else if (session.user.roles.includes(Roles.USER_TYPE_ADMIN)) {
      return (
        <div>
          <h3>Manage users, health boards and hospitals</h3>
          <p>
            Please use the following options to add a new health board or
            hospital to the system.
          </p>
          <p>
            You may also setup user accounts for new health board or hospital
            users, or platform administrators, to generate credentials that can
            be distributed to relevant staff.
          </p>
          <p>
            For more advanced user management (such as updating passwords or
            deleting users), please visit the platform&apos;s Keycloak Admin
            Console for precise user management functionality.
          </p>
          <p>
            <strong>
              No users should be added to this system unless you have
              authorisation from your Information Governance Team and you have
              read your organisation&apos;s Privacy Policy.
            </strong>
          </p>

          <Modal
            show={addNewUserModalUserType !== null}
            onHide={() => setAddNewUserModalUserType(null)}
            size="xs">
            <Modal.Header>
              <Modal.Title>Add new user</Modal.Title>
              <Modal.Header>
                Please enter the details of the new user
              </Modal.Header>
            </Modal.Header>
            <Modal.Body>
              <NewUserForm
                userType={addNewUserModalUserType}
                onSuccess={() => {
                  Alert.success(
                    'User successfully added! Please share the password with the user -- they will be required to update this when they login',
                    10000
                  );
                  setAddNewUserModalUserType(null);
                }}
                onError={message => Alert.error('Error: ' + message, 0)}
              />
            </Modal.Body>
          </Modal>

          <Modal
            show={addNewEntityModalType !== null}
            onHide={() => setAddNewEntityModalType(null)}
            size="xs">
            <Modal.Header>
              <Modal.Title>Add new {addNewEntityModalType}</Modal.Title>
              <Modal.Header>
                Please enter the details of the new {addNewEntityModalType}
              </Modal.Header>
            </Modal.Header>
            <Modal.Body>
              <NewEntityForm
                hospital={addNewEntityModalType === 'hospital'}
                healthBoard={addNewEntityModalType === 'health board'}
                onSuccess={() => {
                  Alert.success(
                    `${
                      addNewEntityModalType[0].toUpperCase() +
                      addNewEntityModalType.slice(1)
                    } successfully added!`
                  );
                  setAddNewEntityModalType(null);
                }}
                onError={message => Alert.error('Error: ' + message, 0)}
              />
            </Modal.Body>
          </Modal>

          <p>
            <ButtonGroup justified>
              <Button
                id="addNewHealthBoard"
                appearance="ghost"
                onClick={() => setAddNewEntityModalType('health board')}>
                Add new health board
              </Button>
              <Button
                id="addNewHospital"
                appearance="ghost"
                onClick={() => setAddNewEntityModalType('hospital')}>
                Add new hospital
              </Button>
            </ButtonGroup>
          </p>

          <p>
            <ButtonGroup justified>
              <Button
                id="addNewHealthBoardUser"
                appearance="ghost"
                onClick={() =>
                  setAddNewUserModalUserType(Roles.USER_TYPE_HEALTH_BOARD)
                }>
                Add new health board user
              </Button>
              <Button
                id="addNewHospitalUser"
                appearance="ghost"
                onClick={() =>
                  setAddNewUserModalUserType(Roles.USER_TYPE_HOSPITAL)
                }>
                Add new hospital user
              </Button>
            </ButtonGroup>
          </p>

          <p>
            <ButtonGroup justified>
              <Button
                id="addNewAdminUser"
                appearance="ghost"
                onClick={() =>
                  setAddNewUserModalUserType(Roles.USER_TYPE_ADMIN)
                }>
                Add new platform administrator
              </Button>
            </ButtonGroup>
          </p>
        </div>
      );
    } else if (session.user.roles.includes(Roles.USER_TYPE_HOSPITAL)) {
      return (
        <>
          {/* <div className={styles.Standard}>
            <div className={styles.child}>
              <h3 className={styles.standardTitle}>Create a new standard : </h3>
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
                const res = await fetch('/api/standards', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    name: values.title,
                  }),
                }).then(res => res.json());

                // TODO: Remove during refactor
                alert(JSON.stringify(values, null, 2));
                setSubmitting(false);
              }}>
              {({ isSubmitting, dirty, handleReset }) => (
                <Form>
                  <label>
                    <Field
                      type="text"
                      name="title"
                      className={styles.TextBox}
                    />
                  </label>
                  <ErrorMessage name="title" component="span" />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={styles.SubmitButton}>
                    Submit
                  </button>
                </Form>
              )}
            </Formik>
          </div> */}

          <div>
            <h3>Manage and add new departments</h3>
            <DepartmentsTable host={host} />
          </div>
        </>
      );
    } else {
      return <NoAccess />;
    }
  };

  return (
    <div>
      <Head>
        <title>Manage</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header session={session} toggleTheme={toggleTheme} />
      {renderContent()}
    </div>
  );
}

Manage.propTypes = {
  session: PropTypes.object.isRequired,
  host: PropTypes.string.isRequired,
  toggleTheme: PropTypes.func.isRequired,
};

export default Manage;
