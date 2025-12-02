'use client';

import { useEffect, useState, useRef } from 'react';
import styles from '../page.module.css';
import Footer from '../components/Footer';
import Header from '../components/Header';

export default function Fun() {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isOverNav, setIsOverNav] = useState(false);
  const triggerSectionRef = useRef<HTMLElement>(null);

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
                Fun
              </h1>
              <p className={styles.subtext}>
                Work in progress...
              </p>
            </div>
          </div>
        </main>
      </div>

      <section ref={triggerSectionRef} style={{ minHeight: '100vh', background: '#FBFCFD' }}></section>

      <Footer />
    </>
  );
}

