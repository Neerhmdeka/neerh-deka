'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './WorkSection.module.css';

export default function WorkSection() {
  const [activeTab, setActiveTab] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const tabletRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const tabs = [
    {
      id: 'tab1',
      title: 'Tab 1',
      bgImage: '/1.png',
      hoverTitle: 'Doubling users on module',
      hoverSubtitle: 'How we doubled the users for brand guidlines to make a micro site builder for landing pages and respositioned the module',
      url: 'https://pitch.com/v/microsite-builder-kyvttp',
      content: null,
    },
    {
      id: 'tab2',
      title: 'Tab 2',
      bgImage: '/2.png',
      hoverTitle: 'Increasing adoption of design system',
      hoverSubtitle: 'How we reduced legacy code, improved adoption and documention of the desystem system via a brand upgrade',
      url: 'https://pitch.com/v/design-system-update-v3i5uk',
      content: null,
    },
    {
      id: 'tab3',
      title: 'Tab 3',
      bgImage: '/3.png',
      hoverTitle: 'Bynder Guided Onboarding',
      hoverSubtitle: 'How we reduced onboarding time and churn at Bynder',
      url: 'https://pitch.com/v/bynder-onboarding-4j9rpa',
      content: null,
    },
    {
      id: 'tab4',
      title: 'Tab 4',
      bgImage: '/4.png',
      hoverTitle: 'Founding of Swemax',
      hoverSubtitle: 'How we launched the Swemax brand, device and app',
      url: 'https://drive.google.com/file/d/1_CPOu_A_bUf6W7OOxe6MVLYi69RLxLb7/view',
      content: null,
    },
  ];

  useEffect(() => {
    // Disable scroll-based tab switching on mobile/tablet
    const isMobileOrTablet = () => window.innerWidth <= 1024;
    
    if (isMobileOrTablet()) {
      // On mobile/tablet, tabs are controlled by buttons only
      return;
    }

    const handleScroll = () => {
      if (!sectionRef.current) return;

      const section = sectionRef.current;
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;
      
      // Get section's position relative to document
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight; // 400vh
      
      // First, check if section has entered viewport (top of section at or above viewport top)
      if (rect.top > 0) {
        // Section hasn't fully entered viewport yet, keep at tab 0
        setActiveTab(0);
        return;
      }
      
      // Calculate how much we've scrolled past the point where section top reached viewport top
      // When rect.top = 0, we've just entered. When rect.top < 0, we've scrolled further.
      const scrollIntoSection = -rect.top; // Positive value showing how far we've scrolled into section
      
      // Add delay: require scrolling 100vh into the section before tab switching begins
      const delayThreshold = windowHeight; // 100vh delay
      
      if (scrollIntoSection < delayThreshold) {
        // Haven't scrolled enough yet, keep at tab 0
        setActiveTab(0);
        return;
      }
      
      // Now calculate progress through the remaining scrollable area
      // After delay, we have (400vh - 100vh) = 300vh left for tabs 1, 2, 3, 4
      const scrollableArea = sectionHeight - delayThreshold; // 300vh
      const scrollAfterDelay = scrollIntoSection - delayThreshold;
      const scrollProgress = Math.max(0, Math.min(1, scrollAfterDelay / scrollableArea));
      
      // Map scroll progress (0-1) to tab index (1-3, since tab 0 is shown during delay)
      // Divide remaining area into 3 parts for tabs 1, 2, 3, 4
      // 0-0.25 = tab 1, 0.25-0.5 = tab 2, 0.5-0.75 = tab 3, 0.75-1.0 = tab 4
      const tabIndex = Math.min(3, Math.floor(scrollProgress * 4) + 1);
      
      setActiveTab(tabIndex);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial position

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Swipe gestures for mobile
  useEffect(() => {
    const isMobile = () => window.innerWidth <= 768;
    
    if (!isMobile() || !tabletRef.current) return;

    const tablet = tabletRef.current;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      if (touchStartX.current === null || touchEndX.current === null) return;

      const diff = touchStartX.current - touchEndX.current;
      const minSwipeDistance = 50;

      if (Math.abs(diff) > minSwipeDistance) {
        if (diff > 0) {
          // Swipe left - next tab
          setActiveTab((prev) => Math.min(3, prev + 1));
        } else {
          // Swipe right - previous tab
          setActiveTab((prev) => Math.max(0, prev - 1));
        }
      }

      touchStartX.current = null;
      touchEndX.current = null;
    };

    tablet.addEventListener('touchstart', handleTouchStart);
    tablet.addEventListener('touchmove', handleTouchMove);
    tablet.addEventListener('touchend', handleTouchEnd);

    return () => {
      tablet.removeEventListener('touchstart', handleTouchStart);
      tablet.removeEventListener('touchmove', handleTouchMove);
      tablet.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <section ref={sectionRef} id="work" className={styles.section}>
      <div className={styles.stickyBox}>
        <div className={styles.content}>
          <div className={styles.tablet} ref={tabletRef}>
            <div className={styles.tabletFrame}>
              <a
                href={tabs[activeTab].url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.tabletScreen}
                style={{
                  backgroundImage: `url(${tabs[activeTab].bgImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              >
                <div className={styles.hoverOverlay}>
                  <h3 className={styles.hoverTitle}>{tabs[activeTab].hoverTitle}</h3>
                  <p className={styles.hoverSubtitle}>{tabs[activeTab].hoverSubtitle}</p>
                </div>
              </a>
            </div>
          </div>
          <div className={styles.tabControls}>
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                className={`${styles.tabButton} ${activeTab === index ? styles.active : ''}`}
                onClick={() => setActiveTab(index)}
                aria-label={tab.title}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}