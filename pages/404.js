/**
 * Authors: Sarvesh Rajdev
 */
import { Nav, Button } from 'rsuite';
import Link from 'next/link';
import styles from './error.module.css';

/**
 * This overrides the default Next.js 404 error page.
 * It displays a styled header with a message informing the user of a 404 error and
 * a button which takes them back to the homepage so they can recover from the error.
 *
 * @param statusCode the error code that has occurred
 */
function Custom404() {
  return (
    <div>
      <Nav className={styles.header}>
        <Link href="/">
          <Nav.Item className={styles.logoWrapper}>
            <span className={styles.logo}>MultiDashboard</span>
          </Nav.Item>
        </Link>
      </Nav>
      <div className={styles.content}>
        <h1> 404 - Page Not Found </h1>
        <p>The page you are trying to navigate to does not exist.</p>
        <br></br>
        <Link href="/">
          <Button appearance="primary">Go to home page</Button>
        </Link>
      </div>
    </div>
  );
}

export default Custom404;
