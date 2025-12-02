'use client';

import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './page.module.css';
import WorkSection from './components/WorkSection';
import Footer from './components/Footer';
import Header from './components/Header';
import { FlipWords } from '@/components/ui/flip-words';

type MediumArticle = {
  title: string;
  link: string;
  publishedAt: string;
};

const articleBackgroundClasses = [
  styles.articleBlock1,
  styles.articleBlock2,
  styles.articleBlock3,
  styles.articleBlock4,
  styles.articleBlock5,
  styles.articleBlock6,
  styles.articleBlock7,
  styles.articleBlock8,
];

export default function Home() {
  const [articlesVisible, setArticlesVisible] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [cursorType, setCursorType] = useState<'default' | 'drag'>('default');
  const [visionProgress, setVisionProgress] = useState(0);
  const [mediumArticles, setMediumArticles] = useState<MediumArticle[]>([]);
  const [isLoadingArticles, setIsLoadingArticles] = useState(true);
  const [articlesError, setArticlesError] = useState<string | null>(null);
  const [isOverNav, setIsOverNav] = useState(false);
  const [isOverWorkTab, setIsOverWorkTab] = useState(false);
  const [workTabCursorText, setWorkTabCursorText] = useState<string | null>(null);
  const [isOverArticleCard, setIsOverArticleCard] = useState(false);
  const [articleCursorText, setArticleCursorText] = useState<string | null>(null);
  const articlesSectionRef = useRef<HTMLElement>(null);
  const visionSectionRef = useRef<HTMLElement>(null);


  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !articlesVisible) {
            setArticlesVisible(true);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (articlesSectionRef.current) {
      observer.observe(articlesSectionRef.current);
    }

    return () => {
      if (articlesSectionRef.current) {
        observer.unobserve(articlesSectionRef.current);
      }
    };
  }, [articlesVisible]);


  // Mouse drag scrolling for articles section
  useEffect(() => {
    const section = articlesSectionRef.current;
    if (!section) return;

    let isDown = false;
    let startX: number;
    let scrollLeft: number;

    const handleMouseDown = (e: MouseEvent) => {
      isDown = true;
      section.style.cursor = 'grabbing';
      startX = e.pageX - section.offsetLeft;
      scrollLeft = section.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDown = false;
      section.style.cursor = 'grab';
    };

    const handleMouseUp = () => {
      isDown = false;
      section.style.cursor = 'grab';
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - section.offsetLeft;
      const walk = (x - startX) * 2; // Scroll speed multiplier
      section.scrollLeft = scrollLeft - walk;
    };

    section.style.cursor = 'grab';
    section.addEventListener('mousedown', handleMouseDown);
    section.addEventListener('mouseleave', handleMouseLeave);
    section.addEventListener('mouseup', handleMouseUp);
    section.addEventListener('mousemove', handleMouseMove);

    return () => {
      section.removeEventListener('mousedown', handleMouseDown);
      section.removeEventListener('mouseleave', handleMouseLeave);
      section.removeEventListener('mouseup', handleMouseUp);
      section.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);


  // Custom cursor tracking for work tab, flip words, and nav
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
      
      // Check if cursor is over nav
      let isOverButton = false;
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

  // Footer reveal animation

  // Vision text scroll animation
  useEffect(() => {
    const handleScroll = () => {
      if (!visionSectionRef.current) return;

      const section = visionSectionRef.current;
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionHeight = section.offsetHeight; // 200vh
      const sectionTop = rect.top;
      
      // Animation only starts after section becomes sticky (when top reaches 0)
      // Progress from 0 to 1 as user scrolls through the remaining 100vh after stick
      
      // Only start animation when section is sticky (top <= 0)
      if (sectionTop > 0) {
        setVisionProgress(0);
        return;
      }
      
      // Calculate progress: 0 when section becomes sticky, 1+ when scrolled through the section
      // Section height is 80vh + 60vh = 140vh, sticky box is 80vh
      // Scroll range is 60vh for animation
      const scrollPastSticky = -sectionTop; // How much we've scrolled past the sticky point
      // Use the scrollable height (section height - viewport height to account for sticky positioning)
      const maxScroll = sectionHeight - windowHeight; // Total scrollable distance
      // Allow progress to reach 1.2 to ensure all characters complete animation
      const scrollProgress = Math.max(0, Math.min(1.2, scrollPastSticky / maxScroll));
      
      setVisionProgress(scrollProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  useEffect(() => {
    let isMounted = true;

    const fetchArticles = async () => {
      try {
        const response = await fetch('/api/medium-articles', { cache: 'no-store' });
        if (!response.ok) {
          throw new Error(`Failed to load articles (${response.status})`);
        }

        const data = await response.json();
        if (isMounted) {
          setMediumArticles(Array.isArray(data.articles) ? data.articles : []);
          setArticlesError(data.error || null);
        }
      } catch (error) {
        console.error('Failed to load Medium articles', error);
        if (isMounted) {
          setMediumArticles([]);
          setArticlesError('Unable to load Medium articles. The feed may be temporarily unavailable.');
        }
      } finally {
        if (isMounted) {
          setIsLoadingArticles(false);
        }
      }
    };

    fetchArticles();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      {/* Custom Cursor - Rendered via portal to avoid transform issues */}
      {typeof document !== 'undefined' && isOverWorkTab && workTabCursorText && createPortal(
        <div
          className={styles.cursorText}
          style={{
            left: `${cursorPosition.x + 20}px`,
            top: `${cursorPosition.y + 8}px`,
          }}
        >
          {workTabCursorText}
        </div>,
        document.body
      )}
      {typeof document !== 'undefined' && isOverArticleCard && articleCursorText && createPortal(
        <div
          className={styles.cursorText}
          style={{
            left: `${cursorPosition.x + 20}px`,
            top: `${cursorPosition.y + 8}px`,
          }}
        >
          {articleCursorText}
        </div>,
        document.body
      )}
      <div className={styles.page}>
        <main className={styles.main}>
          <div className={styles.hero}>
            <div className={styles.heroWrapper}>
              <div className={styles.heroContainer}>
                <Header />
                <h1 className={styles.heading}>
                  <span className={styles.headingDesktop}>
                    Hi, my name is Neerh, I am a <FlipWords words={['Designer', 'Developer', 'Founder', 'Strategist']} duration={1500} />
                    <br />
                    With almost a decade of experience who cares
                    <br />
                    about making beautiful things that help people.
                  </span>
                  <span className={styles.headingMobile}>
                    Hi, I am Neerh, a Designer
                    <br />
                    ith almost a decade of experience
                    <br />
                    I make things that help people.
                  </span>
                </h1>
              </div>
            </div>
          </div>
          <section className={styles.brandsSection}>
            <div className={styles.brandsWrapper}>
              <div className={styles.brandsContainer}>
            <div className={styles.brandLogo}><img src="/a.png" alt="Klarna" /></div>
            <div className={styles.brandLogo}><img src="/b.png" alt="Ferrari" /></div>
            <div className={styles.brandLogo}><img src="/c.png" alt="Lamborghini" /></div>
            <div className={styles.brandLogo}><img src="/d.png" alt="Pepsi" /></div>
            <div className={styles.brandLogo}><img src="/e.png" alt="ClaseAzul" /></div>
            <div className={styles.brandLogo}><img src="/f.png" alt="F1" /></div>
            <div className={styles.brandLogo}><img src="/g.png" alt="FIFA" /></div>
            <div className={styles.brandLogo}><img src="/h.png" alt="Kick Sauber Stake F1" /></div>
            <div className={styles.brandLogo}><img src="/i.png" alt="La Cimbali" /></div>
            <div className={styles.brandLogo}><img src="/j.png" alt="Technogym" /></div>
            <div className={styles.brandLogo}><img src="/k.png" alt="Pernod Ricard" /></div>
            <div className={styles.brandLogo}><img src="/l.png" alt="KLM" /></div>
            <div className={styles.brandLogo}><img src="/a.png" alt="Klarna" /></div>
            <div className={styles.brandLogo}><img src="/b.png" alt="Ferrari" /></div>
            <div className={styles.brandLogo}><img src="/c.png" alt="Lamborghini" /></div>
            <div className={styles.brandLogo}><img src="/d.png" alt="Pepsi" /></div>
            <div className={styles.brandLogo}><img src="/e.png" alt="ClaseAzul" /></div>
            <div className={styles.brandLogo}><img src="/f.png" alt="F1" /></div>
            <div className={styles.brandLogo}><img src="/g.png" alt="FIFA" /></div>
            <div className={styles.brandLogo}><img src="/h.png" alt="Kick Sauber Stake F1" /></div>
            <div className={styles.brandLogo}><img src="/i.png" alt="La Cimbali" /></div>
            <div className={styles.brandLogo}><img src="/j.png" alt="Technogym" /></div>
            <div className={styles.brandLogo}><img src="/k.png" alt="Pernod Ricard" /></div>
            <div className={styles.brandLogo}><img src="/l.png" alt="KLM" /></div>
              </div>
            </div>
          </section>
        </main>
      </div>

      <WorkSection 
        onHoverChange={setIsOverWorkTab}
        onCursorTextChange={setWorkTabCursorText}
      />

      <section ref={articlesSectionRef} className={styles.articlesSection} id="articles">
        <div className={styles.articlesWrapper}>
          <div className={styles.articlesHeader}>
            <h2 className={styles.articlesSectionTitle}>Published articles</h2>
            <a href="https://medium.com/@mriganavdeka" target="_blank" rel="noopener noreferrer" className={styles.readAllLink}>READ ALL</a>
          </div>
          <div className={styles.articlesGrid}>
            {isLoadingArticles && (
              <div className={styles.articlePlaceholder}>Loading the latest Medium articles…</div>
            )}
            {!isLoadingArticles && articlesError && (
              <div className={styles.articlePlaceholder}>{articlesError}</div>
            )}
            {!isLoadingArticles && !articlesError && mediumArticles.length === 0 && (
              <div className={styles.articlePlaceholder}>No Medium articles to display yet.</div>
            )}
            {mediumArticles.slice(0, 8).map((article, index) => {
              const wrapperClass = articleBackgroundClasses[index % articleBackgroundClasses.length] ?? '';

              return (
                <a 
                  key={`${article.link}-${article.publishedAt}-${index}`}
                  href={article.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={styles.articleCard}
                  onMouseEnter={() => {
                    setIsOverArticleCard(true);
                    setArticleCursorText('Read article');
                  }}
                  onMouseLeave={() => {
                    setIsOverArticleCard(false);
                    setArticleCursorText(null);
                  }}
                >
                  <div className={styles.articleCardWrapper}>
                    <div className={`${styles.articleImageWrapper} ${wrapperClass}`}>
                      <div className={styles.articleBlock}></div>
                    </div>
                    <h3 className={styles.articleTitle}>{article.title}</h3>
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section ref={visionSectionRef} className={styles.visionSection}>
        <div className={styles.visionWrapper}>
          <div className={styles.visionContainer}>
            <p className={styles.visionText}>
              {(() => {
                const text = "I help your customers envision the future and help your business grow by showing you the steps to get there through strategic emotional experiences.";
                const words = text.split(' ');
                const totalChars = text.replace(/\s/g, '').length;
                let charIndex = 0;
                
                return words.map((word, wordIndex) => {
                  const cleanWord = word.replace(/\n/g, '');
                  const wordChars = cleanWord.split('');
                  // Normalize character positions to 0-0.95 range so animation completes before scroll ends
                  const normalizedTotal = totalChars * 0.95;
                  const wordStartProgress = (charIndex / totalChars) * 0.95;
                  const wordEndProgress = ((charIndex + wordChars.length) / totalChars) * 0.95;
                  
                  // Check if this is "future" or "steps" word
                  const isFuture = cleanWord.toLowerCase() === 'future';
                  const isSteps = cleanWord.toLowerCase() === 'steps';
                  
                  const wordElements = wordChars.map((char, charIdx) => {
                    const charStartProgress = ((charIndex + charIdx) / totalChars) * 0.95;
                    const charEndProgress = ((charIndex + charIdx + 1) / totalChars) * 0.95;
                    
                    // Calculate color based on scroll progress
                    // Normalize visionProgress to match the 0-0.95 range
                    const normalizedProgress = Math.min(1, visionProgress / 0.95);
                    const progressRange = charEndProgress - charStartProgress;
                    const charProgress = Math.max(0, Math.min(1, (normalizedProgress - charStartProgress) / (progressRange + 0.05)));
                    
                    // Start transparent and turn white on scroll
                    // First phase: reveal with transparency
                    const revealOpacity = Math.max(0, Math.min(0.6, charProgress * 0.6));
                    
                    // Second phase: transition to fully white as scrolling continues
                    let opacity = revealOpacity;
                    if (charProgress > 0.99) {
                      // After text is fully revealed, transition from 0.6 opacity to 1.0 (fully white)
                      const whiteTransitionStart = 0.95;
                      const whiteTransitionEnd = 1.5;
                      const whiteProgress = Math.max(0, Math.min(1, (visionProgress - whiteTransitionStart) / (whiteTransitionEnd - whiteTransitionStart)));
                      opacity = 0.6 + (1 - 0.6) * whiteProgress;
                    }
                    
                    const color = `rgba(255, 255, 255, ${opacity})`;
                    
                    return (
                      <span
                        key={`${wordIndex}-${charIdx}`}
                        style={{ color, transition: 'color 0.1s ease' }}
                      >
                        {char}
                      </span>
                    );
                  });
                  
                  charIndex += wordChars.length;
                  
                  return (
                    <span key={wordIndex}>
                      {wordElements}
                      {wordIndex < words.length - 1 && (cleanWord.toLowerCase() === 'future' ? <br /> : ' ')}
                    </span>
                  );
                });
              })()}
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}