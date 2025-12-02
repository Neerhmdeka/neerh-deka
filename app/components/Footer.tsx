'use client';

import styles from '../page.module.css';

export default function Footer() {
  return (
    <footer 
      id="footer" 
      className={styles.footer}
    >
      <div className={styles.footerContainer}>
        <div className={styles.footerLeft}>
          <p className={styles.footerTagline}>Product designer crafting digital experiences<br />that make a real difference</p>
          <div className={styles.footerImages}>
            <div className={styles.footerImageWrapper}>
              <img src="/image 58.png" alt="" className={styles.footerImage} />
              <div className={styles.footerImageLogo}>
                <img src="/3158176.png" alt="Apple Photos" />
              </div>
            </div>
            <div className={styles.footerImageWrapper}>
              <img src="/image 57.png" alt="" className={styles.footerImage} />
              <div className={styles.footerImageLogo}>
                <img src="/Apple_Maps_Logo_3D.png" alt="Apple Maps" />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.footerRight}>
          <div className={styles.footerColumn}>
            <div className={styles.footerLabel}>Contact</div>
            <div className={styles.footerInfo}>
              <a href="mailto:mriganavdeka@gmail.com" className={styles.footerLink}>mriganavdeka@gmail.com</a>
              <p>Available for freelance projects</p>
            </div>
          </div>
          <div className={styles.footerColumn}>
            <div className={styles.footerLabel}>Links</div>
            <div className={styles.footerLinks}>
              <a href="https://medium.com/@mriganavdeka" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>Medium</a>
              <a href="https://www.linkedin.com/in/mriganavdeka/" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>LinkedIn</a>
              <a href="/Mriganav Deka CV.pdf" download="Mriganav Deka CV.pdf" className={styles.footerLink}>CV</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

