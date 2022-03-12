import { getSession } from 'next-auth/client';
import Head from 'next/head';
import PropTypes from 'prop-types';

import { Header, LoginMessage, QuestionsTable, NoAccess } from '../components';

import { Roles } from '../lib/constants';

export async function getServerSideProps(context) {
  return { props: { session: await getSession(context) } };
}

/**
 * The admin page allows administrators to manage and add new questions, via the QuestionsTable component.
 * If the user is not logged in, they are prompted to login.
 *
 * All other users do not have access to this page.
 *
 * @param session the user's session object to decide what to display
 * @param toggleTheme the global function to toggle the current theme
 */
function Manage({ session, toggleTheme }) {
  const dashboardId = router.query.dashboard_id;

  if (!session) {
    return (
      <div>
        <Header session={session} toggleTheme={toggleTheme} />
        <LoginMessage />
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>Manage</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header session={session} toggleTheme={toggleTheme} />
      {session.user.roles.includes(Roles.USER_TYPE_ADMIN) ||
      session.user.roles.includes(Roles.USER_TYPE_DEPARTMENT) ? (
        <div>
          <h3>Manage and add new questions</h3>
          <QuestionsTable dashboardId={dashboardId} />
        </div>
      ) : (
        <NoAccess />
      )}
    </div>
  );
}

Manage.propTypes = {
  session: PropTypes.object.isRequired,
  toggleTheme: PropTypes.func.isRequired,
};

export default Manage;
