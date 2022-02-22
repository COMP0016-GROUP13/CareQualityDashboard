import { Footer as FooterComponent } from 'rsuite';
import styles from './Footer.module.css';

function Footer() {
  return (
    <FooterComponent className={styles.footer}>
      <a
        className={styles.link}
        target="_blank"
        rel="noopener noreferrer"
        href="https://carequalitydashboard.wordpress.com/">
        Development Blog
      </a>
      <a
        className={styles.link}
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.carefulai.com/privacy-policy.html">
        Privacy Policy
      </a>
      <a
        className={styles.link}
        target="_blank"
        rel="noopener noreferrer"
        href="https://forms.office.com/r/4LW2BdGi9v">
        Share your feedback!
      </a>
      <i>
        Developed as part of the{' '}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.ucl.ac.uk/computer-science/collaborate/ucl-industry-exchange-network-ucl-ixn">
          UCL Industry Exchange Network
        </a>
      </i>
    </FooterComponent>
  );
}

export default Footer;
