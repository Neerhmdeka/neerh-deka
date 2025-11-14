'use client';

import { useEffect, useState, useRef } from 'react';
import styles from './page.module.css';
import WorkSection from './components/WorkSection';


export default function Home() {
  const [headerVisible, setHeaderVisible] = useState(false);
  const [servicesVisible, setServicesVisible] = useState(false);
  const [articlesVisible, setArticlesVisible] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const servicesSectionRef = useRef<HTMLElement>(null);
  const articlesSectionRef = useRef<HTMLElement>(null);
  const unicornStudioRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkHeaderVisibility = () => {
      const headerVisibleValue = getComputedStyle(document.documentElement)
        .getPropertyValue('--header-visible');
      setHeaderVisible(headerVisibleValue === '1');
    };

    const interval = setInterval(checkHeaderVisibility, 50);
    checkHeaderVisibility();

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !servicesVisible) {
            setServicesVisible(true);
          }
        });
      },
      { threshold: 0.1 }
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

  // Load Unicorn Studio script
  useEffect(() => {
    if (!window.UnicornStudio) {
      window.UnicornStudio = { isInitialized: false };
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.34/dist/unicornStudio.umd.js';
      script.onload = () => {
        if (window.UnicornStudio && !window.UnicornStudio.isInitialized && window.UnicornStudio.init) {
          window.UnicornStudio.init();
          window.UnicornStudio.isInitialized = true;
        }
      };
      (document.head || document.body).appendChild(script);
    } else if (!window.UnicornStudio.isInitialized && window.UnicornStudio.init) {
      window.UnicornStudio.init();
      window.UnicornStudio.isInitialized = true;
    }

    // Hide any attribution buttons that might appear
    const hideAttribution = () => {
      const attributionElements = document.querySelectorAll('[data-us-attribution], a[href*="unicornstudio"], a[href*="unicorn.studio"], [class*="attribution"], [class*="powered-by"], [id*="attribution"], [id*="unicorn"]');
      attributionElements.forEach((el) => {
        (el as HTMLElement).style.display = 'none';
        (el as HTMLElement).style.visibility = 'hidden';
        (el as HTMLElement).style.opacity = '0';
        (el as HTMLElement).style.position = 'absolute';
        (el as HTMLElement).style.left = '-9999px';
      });
    };

    // Run immediately and also after a delay to catch dynamically added elements
    hideAttribution();
    const interval = setInterval(hideAttribution, 200);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className={styles.page}>
        <header className={`${styles.header} ${headerVisible ? styles.visible : ''}`}>
          <div className={styles.container}>
            <div className={styles.headerContent}>
              <a href="#" className={styles.logo} onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                <span>Neerh Deka</span>
              </a>
              <nav className={styles.nav}>
                <a href="#work">Work</a>
                <a href="#expertise">Expertise</a>
                <a href="#about">About</a>
              </nav>
              <a href="#contact" className={styles.contactButton}>Contact</a>
            </div>
          </div>
        </header>

        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.hero}>
              <h1 className={styles.heading}>
                Let's shape the<br />
                future, together
              </h1>
              <p className={styles.subtext}>
                I'm a Senior product designer, with almost a decade of experience who cares about making beautiful things that help people and businesses.
              </p>
            </div>
          </div>
        </main>
      </div>

      {/* Move WorkSection outside .page container */}
      <WorkSection />

      <section className={styles.brandsSection}>
        <div className={styles.brandsWrapper}>
          <div className={styles.brandsContainer}>
            <div className={styles.brandLogo}><img src="/a.svg" alt="Klarna" /></div>
            <div className={styles.brandLogo}><img src="/b.svg" alt="Ferrari" /></div>
            <div className={styles.brandLogo}><img src="/c.svg" alt="Lamborghini" /></div>
            <div className={styles.brandLogo}><img src="/d.svg" alt="Pepsi" /></div>
            <div className={styles.brandLogo}><img src="/e.svg" alt="ClaseAzul" /></div>
            <div className={styles.brandLogo}><img src="/f.svg" alt="F1" /></div>
            <div className={styles.brandLogo}><img src="/g.svg" alt="FIFA" /></div>
            <div className={styles.brandLogo}><img src="/h.svg" alt="Kick Sauber Stake F1" /></div>
            <div className={styles.brandLogo}><img src="/i.svg" alt="La Cimbali" /></div>
            <div className={styles.brandLogo}><img src="/j.svg" alt="Technogym" /></div>
            <div className={styles.brandLogo}><img src="/k.svg" alt="Pernod Ricard" /></div>
            <div className={styles.brandLogo}><img src="/l.svg" alt="KLM" /></div>
            <div className={styles.brandLogo}><img src="/m.svg" alt="Spotify" /></div>
            <div className={styles.brandLogo}><img src="/n.svg" alt="Dallara" /></div>
            <div className={styles.brandLogo}><img src="/o.svg" alt="Illy" /></div>
            {/* Gap for seamless loop */}
            <div style={{ width: '24px', flexShrink: 0 }}></div>
            {/* Duplicate for seamless loop */}
            <div className={styles.brandLogo}><img src="/a.svg" alt="Klarna" /></div>
            <div className={styles.brandLogo}><img src="/b.svg" alt="Ferrari" /></div>
            <div className={styles.brandLogo}><img src="/c.svg" alt="Lamborghini" /></div>
            <div className={styles.brandLogo}><img src="/d.svg" alt="Pepsi" /></div>
            <div className={styles.brandLogo}><img src="/e.svg" alt="ClaseAzul" /></div>
            <div className={styles.brandLogo}><img src="/f.svg" alt="F1" /></div>
            <div className={styles.brandLogo}><img src="/g.svg" alt="FIFA" /></div>
            <div className={styles.brandLogo}><img src="/h.svg" alt="Kick Sauber Stake F1" /></div>
            <div className={styles.brandLogo}><img src="/i.svg" alt="La Cimbali" /></div>
            <div className={styles.brandLogo}><img src="/j.svg" alt="Technogym" /></div>
            <div className={styles.brandLogo}><img src="/k.svg" alt="Pernod Ricard" /></div>
            <div className={styles.brandLogo}><img src="/l.svg" alt="KLM" /></div>
            <div className={styles.brandLogo}><img src="/m.svg" alt="Spotify" /></div>
            <div className={styles.brandLogo}><img src="/n.svg" alt="Dallara" /></div>
            <div className={styles.brandLogo}><img src="/o.svg" alt="Illy" /></div>
          </div>
        </div>
        <div className={styles.brandsText}>Companies I worked with or for</div>
      </section>

      <section ref={servicesSectionRef} className={styles.servicesSection} id="expertise">
        <div className={styles.container}>
          <h2 className={styles.servicesTitle}>What I can do for you</h2>
          <p className={styles.servicesDescription}>
            I will help your customers envision the <span className={styles.highlight}>future</span> and show you the <span className={styles.highlight}>steps</span> to get there
          </p>
          <ul className={styles.servicesList}>
            <li className={`${styles.serviceItem} ${servicesVisible ? styles.serviceItemVisible : ''} ${styles.serviceItem1}`}>
              <span className={styles.serviceNumber}>01</span>
              <span className={styles.serviceName}>Design consultation</span>
            </li>
            <li className={`${styles.serviceItem} ${servicesVisible ? styles.serviceItemVisible : ''} ${styles.serviceItem2}`}>
              <span className={styles.serviceNumber}>02</span>
              <span className={styles.serviceName}>Product Strategy</span>
            </li>
            <li className={`${styles.serviceItem} ${servicesVisible ? styles.serviceItemVisible : ''} ${styles.serviceItem3}`}>
              <span className={styles.serviceNumber}>03</span>
              <span className={styles.serviceName}>Digital Product Design</span>
            </li>
            <li className={`${styles.serviceItem} ${servicesVisible ? styles.serviceItemVisible : ''} ${styles.serviceItem4}`}>
              <span className={styles.serviceNumber}>04</span>
              <span className={styles.serviceName}>Design Systems</span>
            </li>
            <li className={`${styles.serviceItem} ${servicesVisible ? styles.serviceItemVisible : ''} ${styles.serviceItem5}`}>
              <span className={styles.serviceNumber}>05</span>
              <span className={styles.serviceName}>Startup Design Advisor</span>
            </li>
          </ul>
          <button className={styles.learnMoreButton}>Learn more</button>
        </div>
      </section>

      <section ref={articlesSectionRef} className={styles.articlesSection} id="articles">
        <div className={styles.articlesWrapper}>
          <div className={`${styles.articlesContainer} ${articlesVisible ? styles.animated : ''}`}>
            <a 
              href="https://medium.com/@mriganavdeka/beyond-the-algorithm-the-profound-power-of-product-detail-9058ccb5b2d4" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`${styles.articleBlock} ${styles.articleBlock1}`}
            >
              <img src="https://miro.medium.com/v2/resize:fill:320:214/1*KR7DnwdQxA0nlJRriTKEqQ.png" alt="Beyond the algorithm: The profound power of product detail" />
              <div className={styles.articleOverlay}>
                <h3 className={styles.articleTitle}>Beyond the algorithm: The profound power of product detail</h3>
              </div>
            </a>
            <a 
              href="https://medium.com/@mriganavdeka/what-is-a-designer-eb5d352c9043" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`${styles.articleBlock} ${styles.articleBlock2}`}
            >
              <img src="https://miro.medium.com/v2/resize:fill:320:214/1*cw5nFvjJbdweqHVOXUQ0rA.png" alt="What is a Designer?" />
              <div className={styles.articleOverlay}>
                <h3 className={styles.articleTitle}>What is a Designer?</h3>
              </div>
            </a>
            <a 
              href="https://medium.com/@mriganavdeka/the-myth-of-customer-centricity-iconic-products-defied-their-users-and-why-you-should-too-b68ba4f3561c" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`${styles.articleBlock} ${styles.articleBlock3}`}
            >
              <img src="https://miro.medium.com/v2/da:true/resize:fill:320:214/0*ZfK9SOD20AOgA27c" alt="The Myth of 'Customer-Centricity': Iconic products defied their users" />
              <div className={styles.articleOverlay}>
                <h3 className={styles.articleTitle}>The Myth of 'Customer-Centricity': Iconic products defied their users</h3>
              </div>
            </a>
            <a 
              href="https://medium.com/@mriganavdeka/the-feature-funeral-why-your-saas-innovation-depends-on-killing-your-darlings-ff69988ed38a" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`${styles.articleBlock} ${styles.articleBlock4}`}
            >
              <img src="https://miro.medium.com/v2/resize:fill:320:214/1*ssXH29tINN6KwwSPf-W2jQ.jpeg" alt="The Feature Funeral: Why your SaaS innovation depends on killing your darlings" />
              <div className={styles.articleOverlay}>
                <h3 className={styles.articleTitle}>The Feature Funeral: Why your SaaS innovation depends on killing your darlings</h3>
              </div>
            </a>
            <a 
              href="https://medium.com/design-bootcamp/the-ai-ready-design-system-the-5-components-your-component-library-must-update-first-531309f35d85" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`${styles.articleBlock} ${styles.articleBlock5}`}
            >
              <img src="https://miro.medium.com/v2/resize:fill:320:214/1*p0bNGI7ZpkdJxk_-ulhrSA.png" alt="The AI-ready design system: The 5 components your component library must update first" />
              <div className={styles.articleOverlay}>
                <h3 className={styles.articleTitle}>The AI-ready design system: The 5 components your component library must update first</h3>
              </div>
            </a>
            <a 
              href="https://medium.com/@mriganavdeka/the-drag-and-drop-delusion-why-no-code-solves-the-wrong-creative-pain-dcb1efba804c" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`${styles.articleBlock} ${styles.articleBlock6}`}
            >
              <img src="https://miro.medium.com/v2/resize:fill:320:214/1*gOkSdKCvyiYnZQk3gPi3kA.png" alt="The Drag-&-Drop delusion: Why no-code solves the wrong creative pain" />
              <div className={styles.articleOverlay}>
                <h3 className={styles.articleTitle}>The Drag-&-Drop delusion: Why no-code solves the wrong creative pain</h3>
              </div>
            </a>
            <a 
              href="https://medium.com/@mriganavdeka/the-ai-paradox-when-more-friction-leads-to-better-ux-and-stronger-retention-ec203aabb0f9" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`${styles.articleBlock} ${styles.articleBlock7}`}
            >
              <img src="https://miro.medium.com/v2/da:true/resize:fill:320:214/0*hJXwIIrMJ0LzAE5g" alt="The AI Paradox: When more friction leads to better UX and stronger retention" />
              <div className={styles.articleOverlay}>
                <h3 className={styles.articleTitle}>The AI Paradox: When more friction leads to better UX and stronger retention</h3>
              </div>
            </a>
            <a 
              href="https://medium.com/@mriganavdeka/the-data-shackles-why-being-data-driven-kills-your-next-breakthrough-afeb1157e997" 
              target="_blank" 
              rel="noopener noreferrer"
              className={`${styles.articleBlock} ${styles.articleBlock8}`}
            >
              <img src="https://miro.medium.com/v2/da:true/resize:fill:320:214/0*7lmdkb9BOQzImcnl" alt="The data shackles: Why being data-driven kills your next breakthrough" />
              <div className={styles.articleOverlay}>
                <h3 className={styles.articleTitle}>The data shackles: Why being data-driven kills your next breakthrough</h3>
              </div>
            </a>
          </div>
        </div>
      </section>

      <section className={styles.aboutSection} id="about">
        <div className={styles.container}>
          <h2 className={styles.aboutTitle}>About me</h2>
          <div className={styles.bentoGrid}>
            <div className={`${styles.bentoCard} ${styles.bentoCardText}`}>
              <p className={styles.bentoCardContent}>I'm passionate about creating digital experiences that make a real difference. With a decade of experience in product design, I've helped companies of all sizes transform their digital presence and better serve their users. I am also a software engineer, and design both physical and digital products with a focus on strategy.</p>
            </div>
            <div className={`${styles.bentoCard} ${styles.bentoCardSkills}`}>
              <ul className={styles.skillsList}>
                <li>User Research & Testing</li>
                <li>Information Architecture</li>
                <li>Interaction Design</li>
                <li>Design Systems</li>
                <li>Prototyping</li>
                <li>Visual Design</li>
                <li>Accessibility (WCAG)</li>
                <li>Design Thinking</li>
              </ul>
            </div>
            <div className={`${styles.bentoCard} ${styles.bentoCardImage}`}>
              <img src="/image 57.png" alt="" />
            </div>
            <div className={`${styles.bentoCard} ${styles.bentoCardImage}`}>
              <img src="/image 58.png" alt="" />
            </div>
            <div className={`${styles.bentoCard} ${styles.bentoCardTabs}`}>
              <div className={styles.tabsContainer}>
                <div className={styles.tabButtons}>
                  <button 
                    className={`${styles.tabButton} ${activeTab === 1 ? styles.tabButtonActive : ''}`}
                    onClick={() => setActiveTab(1)}
                  >
                    Everyone
                  </button>
                  <button 
                    className={`${styles.tabButton} ${activeTab === 2 ? styles.tabButtonActive : ''}`}
                    onClick={() => setActiveTab(2)}
                  >
                    Hiring managers
                  </button>
                  <button 
                    className={`${styles.tabButton} ${activeTab === 3 ? styles.tabButtonActive : ''}`}
                    onClick={() => setActiveTab(3)}
                  >
                    Designers
                  </button>
                  <button 
                    className={`${styles.tabButton} ${activeTab === 4 ? styles.tabButtonActive : ''}`}
                    onClick={() => setActiveTab(4)}
                  >
                    PM's and Engineers
                  </button>
                </div>
                <div className={styles.tabContent}>
                  {activeTab === 1 && <p>I'm a designer who cares about making beautiful things that help people and businesses. Currently a product designer at Bynder</p>}
                  {activeTab === 2 && <p>I'm a product designer with a decade of experience across brand and product, at companies large and small in various design disciplines.</p>}
                  {activeTab === 3 && <p>I'm a systems thinker with a high bar for quality. From process to pixels, I'll collaborate with you, learn from you, and help make something we're proud of.</p>}
                  {activeTab === 4 && (
                    <>
                      <p>I bring end-to-end product acumen, from vision and strategy to discovery and delivery. I'll partner closely with you to generate the highest impact possible.</p>
                      <p style={{ marginTop: '16px' }}>I'm {'{highly_technical}'} and while (I'm ≠ engineer anymore) I know my way /around & can speak "fluently" with you;</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.contactSection} id="contact">
        <div className={styles.unicornStudioContainer} ref={unicornStudioRef}>
          <div data-us-project="pTYipWGeJQxikWiaxEQU" style={{width: '100%', height: '100%'}}></div>
        </div>
        <div className={styles.container}>
          <h2 className={styles.contactTitle}>Get in touch</h2>
          <p className={styles.contactText}>Have a project in mind? Let's discuss how we can bring your vision to life.</p>
          <a 
            href="mailto:mriganavdeka@gmail.com"
            className={styles.contactButton}
          >
            Contact
          </a>
        </div>
      </section>
    </>
  );
}