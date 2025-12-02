'use client';

import { useEffect, useState, useRef } from 'react';
import styles from '../page.module.css';
import Footer from '../components/Footer';
import Header from '../components/Header';

export default function About() {
  const [servicesVisible, setServicesVisible] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isOverNav, setIsOverNav] = useState(false);
  const servicesSectionRef = useRef<HTMLElement>(null);
  const aboutSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !servicesVisible) {
            setServicesVisible(true);
          }
        });
      },
      { threshold: 0.6 }
    );

    if (servicesSectionRef.current) {
      observer.observe(servicesSectionRef.current);
    }

    return () => {
      if (servicesSectionRef.current) {
        observer.unobserve(servicesSectionRef.current);
      }
    };
  }, [servicesVisible]);

  // Custom cursor tracking - hide cursor when over nav buttons
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
      
      let isOverButton = false;
      
      // Check if mouse is over any nav link
      const nav = document.querySelector(`.${styles.nav}`);
      if (nav) {
        const navLinks = nav.querySelectorAll('a');
        
        navLinks.forEach((link) => {
          const rect = link.getBoundingClientRect();
          if (
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom
          ) {
            isOverButton = true;
          }
        });
      }
      
      setIsOverNav(isOverButton);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      {!isOverNav && (
        <div 
          className={styles.customCursor}
          style={{
            left: `${cursorPosition.x}px`,
            top: `${cursorPosition.y}px`,
          }}
        />
      )}
      <Header />

      <div className={styles.page}>
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.hero}>
              <h1 className={styles.heading}>
                About me
              </h1>
            </div>
          </div>
        </main>
      </div>

      <section ref={servicesSectionRef} className={styles.servicesSection} id="expertise">
        <div className={styles.container}>
          <div className={styles.expertiseContent}>
            <div className={styles.expertiseLeft}>
              <h2 className={styles.expertiseTitle}>Expertise</h2>
              <div className={styles.expertiseColumns}>
                <div className={styles.expertiseColumn}>
                  <h3 className={styles.expertiseColumnTitle}>Focus areas</h3>
                  <ul className={styles.expertiseList}>
                    <li>Rebranding</li>
                    <li>Digital products</li>
                    <li>Brand visualisation</li>
                    <li>Corporate websites</li>
                  </ul>
                </div>
                <div className={styles.expertiseColumn}>
                  <h3 className={styles.expertiseColumnTitle}>Industries</h3>
                  <ul className={styles.expertiseList}>
                    <li>Edtech</li>
                    <li>Fintech</li>
                    <li>Lodging</li>
                    <li>Real estate</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className={styles.quoteCard}>
              <div className={styles.quoteLabel}>Quote</div>
              <blockquote className={styles.quoteText}>
                Have the courage to follow your heart and intuition. They somehow already know what you truly want to become. Everything else is secondary.
              </blockquote>
              <div className={styles.quoteAttribution}>
                <div className={styles.quoteIcon}>
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="20" cy="20" r="20" fill="white"/>
                    <circle cx="20" cy="16" r="6" fill="black"/>
                    <path d="M12 28C12 24 15.5 22 20 22C24.5 22 28 24 28 28V30H12V28Z" fill="black"/>
                  </svg>
                </div>
                <div className={styles.quoteAuthor}>
                  <div className={styles.quoteName}>Jordan Akers</div>
                  <div className={styles.quoteStudio}>Nebula Studio</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section ref={aboutSectionRef} className={styles.aboutSection} id="about">
        <div className={styles.aboutContainer}>
          <h2 className={styles.aboutTitle}>About me</h2>
          <p className={styles.aboutIntro}>I'm passionate about creating digital experiences that make a real difference. With a decade of experience in product design, I've helped companies of all sizes transform their digital presence and better serve their users.</p>
          <div className={styles.aboutCards}>
            <div className={`${styles.aboutCard} ${styles.aboutCardEveryone}`}>
              <div className={styles.aboutCardHeader}></div>
              <div className={styles.aboutCardBody}>
                <h3 className={styles.aboutCardTitle}>For Everyone</h3>
                <p className={styles.aboutCardContent}>I'm a designer who cares about making beautiful things that help people and businesses. Currently a product designer at Bynder</p>
                <div className={styles.aboutCardFooter}>
                  <div className={styles.aboutCardArrow}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div className={`${styles.aboutCard} ${styles.aboutCardManagers}`}>
              <div className={styles.aboutCardHeader}></div>
              <div className={styles.aboutCardBody}>
                <h3 className={styles.aboutCardTitle}>Managers</h3>
                <p className={styles.aboutCardContent}>I'm a product designer with a decade of experience across brand and product, at companies large and small in various design disciplines.</p>
                <div className={styles.aboutCardFooter}>
                  <div className={styles.aboutCardArrow}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div className={`${styles.aboutCard} ${styles.aboutCardDesigners}`}>
              <div className={styles.aboutCardHeader}></div>
              <div className={styles.aboutCardBody}>
                <h3 className={styles.aboutCardTitle}>Designers</h3>
                <p className={styles.aboutCardContent}>I'm a systems thinker with a high bar for quality. From process to pixels, I'll collaborate with you, learn from you, and help make something we're proud of.</p>
                <div className={styles.aboutCardFooter}>
                  <div className={styles.aboutCardArrow}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div className={`${styles.aboutCard} ${styles.aboutCardEngineers}`}>
              <div className={styles.aboutCardHeader}></div>
              <div className={styles.aboutCardBody}>
                <h3 className={styles.aboutCardTitle}>Engineers</h3>
                <p className={styles.aboutCardContent}>I'm {'{highly_technical}'} and while (I'm ≠ engineer anymore) I know my way /around & can speak "fluently" with you;</p>
                <div className={styles.aboutCardFooter}>
                  <div className={styles.aboutCardArrow}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

