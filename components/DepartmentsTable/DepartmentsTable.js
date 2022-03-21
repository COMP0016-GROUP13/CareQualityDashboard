import { useState } from 'react';
import { Button, Input, Alert, Icon, Message } from 'rsuite';
import { mutate } from 'swr';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import PropTypes from 'prop-types';
import styles from './DepartmentsTable.module.css';

import { AlertDialog, CustomTable } from '../';
import { Roles } from '../../lib/constants';
import useSWR from '../../lib/swr';

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

const columns = [
  {
    id: 'department',
    label: 'Department Name',
    width: 'auto',
    render: (editing, row) => row['name'],
  },
  {
    id: 'url',
    label: 'Join URL',
    width: 'auto',
    render: (editing, row, host) =>
      `https://${host}/join/${Roles.USER_TYPE_DEPARTMENT}/${row['department_join_code']}`,
  },
  { id: 'actions', label: 'Actions', width: 'auto' },
];

const useDepartments = () => {
  const { data, error } = useSWR('/api/departments');

  if (data) {
    return { data: data, error: error || data.error, message: data.message };
  }
  return { data: null, error: error, message: error ? error.message : null };
};

export default function DepartmentsTable({ host }) {
  const [showNewDepartmentDialog, setShowNewDepartmentDialog] = useState(false);
  const [dialogText, setDialogText] = useState(null);
  const [newDepartmentName, setNewDepartmentName] = useState(null);
  const { data, error, message } = useDepartments();

  if (error) {
    Alert.error(
      `Error: ${message}. Please reload/try again later or the contact system administrator`,
      0
    );
  }

  const regenerateCode = async id => {
    const res = await fetch(
      '/api/join_codes/' + Roles.USER_TYPE_HOSPITAL + '/' + id,
      { method: 'PUT', headers: { 'Content-Type': 'application/json' } }
    ).then(res => res.json());

    if (res.error) {
      Alert.error(res.message, 0);
    } else {
      // Refetch to ensure no stale data
      mutate('/api/departments');
      Alert.success('Join URL updated', 3000);
    }
  };

  const deleteDepartment = async id => {
    const res = await fetch('/api/departments/' + id, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    }).then(res => res.json());

    if (res.error) {
      Alert.error(res.message, 0);
    } else {
      // Refetch to ensure no stale data
      mutate('/api/departments');
      Alert.success('Department successfully deleted', 3000);
    }
  };

  const addNewDepartment = async () => {
    if (newDepartmentName === null) {
      setDialogText(
        <div className={styles.alertText}>
          *Please do not leave department name blank
        </div>
      );
    } else {
      const res = await fetch('/api/departments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newDepartmentName }),
      }).then(res => res.json());

      if (res.error) {
        Alert.error(res.message, 0);
      } else {
        Alert.success(
          <text id="addSuccess">New department successfully added</text>,
          3000
        );
        setShowNewDepartmentDialog(false);
        setNewDepartmentName(null);

        // Refetch to ensure no stale data
        mutate('/api/departments');
      }
    }
  };

  const renderActionCells = (editing, row, i, host) => {
    return (
      <div className={styles.actionButtons}>
        <CopyToClipboard
          text={`https://${host}/join/${Roles.USER_TYPE_DEPARTMENT}/${row.department_join_code}`}>
          <Button
            appearance="primary"
            onClick={() => Alert.info('Copied', 5000)}>
            <Icon aria-label="Copy to clipboard" id={'copy' + i} icon="clone" />
          </Button>
        </CopyToClipboard>
        <Button
          id={'regenerate' + i}
          appearance="primary"
          onClick={() => regenerateCode(row.id)}>
          Re-generate URL
        </Button>
        <Button
          id={'delete' + i}
          color="red"
          onClick={async () => {
            if (
              window.confirm(
                'Are you sure you want to delete this department? Deleting a department cannot be undone and all of the departments data will be deleted.'
              )
            ) {
              await deleteDepartment(row.id);
            }
          }}>
          Delete
        </Button>
      </div>
    );
  };

  return (
    <>
      <div>
        <div className={styles.intro}>
          <p className={styles.url}>
            Please send these unique URLs to department managers to join the
            respective departments
          </p>
          <Button
            id="addNewDept"
            className={styles.button}
            appearance="primary"
            onClick={() => {
              setDialogText(null);
              setShowNewDepartmentDialog(true);
            }}>
            Add new department
          </Button>
        </div>

        <AlertDialog
          open={showNewDepartmentDialog}
          setOpen={setShowNewDepartmentDialog}
          title="Please enter the new department's name:"
          text={dialogText}
          content={[
            <div key="new-department-name" className={styles.alertContent}>
              <Input
                className={styles.input}
                id="newDeptName"
                onChange={setNewDepartmentName}
              />
            </div>,
          ]}
          actions={[
            <Button
              key="alertdialog-edit"
              color="red"
              onClick={() => setShowNewDepartmentDialog(false)}>
              Cancel
            </Button>,
            <Button
              id="addDept"
              key="alertdialog-confirm"
              onClick={addNewDepartment}
              appearance="primary">
              Add
            </Button>,
          ]}
        />

        {!error && (
          <CustomTable
            host={host}
            data={data}
            columns={columns}
            renderActionCells={renderActionCells}
            editing={false} // Cannot edit departments
          />
        )}
      </div>
    </>
  );
}

DepartmentsTable.propTypes = {
  /** The host name of the website*/
  host: PropTypes.string.isRequired,
};
