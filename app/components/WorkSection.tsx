'use client';

import { useEffect, useRef } from 'react';
import styles from './WorkSection.module.css';

interface WorkSectionProps {
  onHoverChange?: (isHovering: boolean) => void;
  onCursorTextChange?: (text: string | null) => void;
}

export default function WorkSection({ onHoverChange, onCursorTextChange }: WorkSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const projects = [
    {
      id: 'project1',
      title: 'Doubling AAR using microsite builder',
      image: '/1.png',
      url: 'https://pitch.com/v/microsite-builder-kyvttp',
      date: 'Product design • Strategy • 2024',
    },
    {
      id: 'project2',
      title: 'Design system update',
      image: '/2.png',
      url: 'https://pitch.com/v/design-system-update-v3i5uk',
      date: 'Product design • Design System • 2024',
    },
    {
      id: 'project3',
      title: 'Reducing Bynder Oboarding time',
      image: '/3.png',
      url: 'https://pitch.com/v/bynder-onboarding-4j9rpa',
      date: 'Product design • Strategy • 2023',
    },
    {
      id: 'project4',
      title: 'Helping founders launch a new product',
      image: '/4.png',
      url: 'https://drive.google.com/file/d/1_CPOu_A_bUf6W7OOxe6MVLYi69RLxLb7/view',
      date: 'UX design • Mobile • 2021',
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const section = sectionRef.current;
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionTop = rect.top;
      const sectionHeight = rect.height;

      // Only animate when section is in viewport
      if (sectionTop > windowHeight || sectionTop + sectionHeight < 0) {
        return;
      }

      // Calculate scroll progress within the section (0 to 1)
      const scrollProgress = Math.max(0, Math.min(1, (windowHeight - sectionTop) / (windowHeight + sectionHeight)));

      cardRefs.current.forEach((card, index) => {
        if (!card) return;

        // Determine column (0 or 1)
        const column = index % 2;
        
        // Different parallax speeds for each column
        // Left column (0) moves down, right column (1) moves up
        const parallaxSpeed = column === 0 ? 60 : -60;
        const parallaxOffset = scrollProgress * parallaxSpeed;
        
        // Initial askew offset: right column starts slightly lower
        const initialOffset = column === 1 ? 24 : 0;
        const totalOffset = initialOffset + parallaxOffset;

        card.style.transform = `translateY(${totalOffset}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={sectionRef} id="work" className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Selected works</h2>
        <div className={styles.grid}>
          {projects.map((project, index) => {
            const column = index % 2;
            
            return (
            <a
              key={project.id}
              ref={(el) => { cardRefs.current[index] = el; }}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.projectCard}
              onMouseEnter={() => {
                onHoverChange?.(true);
                onCursorTextChange?.('Read case study');
              }}
              onMouseLeave={() => {
                onHoverChange?.(false);
                onCursorTextChange?.(null);
              }}
            >
              <div className={styles.cardImage}>
                {project.id === 'project1' ? (
                  <video
                    src="/P4.mov"
                    className={styles.projectImage}
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                ) : project.id === 'project2' ? (
                  <video
                    src="/P2.mov"
                    className={styles.projectImage}
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                ) : (
                  <img 
                    src={project.image}
                    alt={project.title}
                    className={styles.projectImage}
                  />
                )}
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{project.title}</h3>
                <p className={styles.cardDescription}>{project.date}</p>
              </div>
            </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
