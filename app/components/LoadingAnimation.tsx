'use client';

import { useEffect, useState, useRef } from 'react';
import styles from './LoadingAnimation.module.css';

export default function LoadingAnimation() {
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [scale, setScale] = useState(1);
  const [textOpacity, setTextOpacity] = useState(0);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    
    setMounted(true);
    
    // Initial delay - mask stays static for 800ms
    const initialDelay = 800;
    const animationDuration = 2500; // 2.5 seconds - faster animation
    let animationId: number | null = null;
    let timerId: NodeJS.Timeout | null = null;
    
    const startAnimation = () => {
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / animationDuration, 1);
        
        // Ease-in function (starts slow, ends faster)
        const easeIn = Math.pow(progress, 3);
        const newScale = 1 + (easeIn * 29); // Scale from 1 to 30
        setScale(newScale);
        
        // Fade in text - starts earlier (after 8% of animation)
        const textStartDelay = 0.08;
        const textProgress = Math.max(0, (progress - textStartDelay) / (1 - textStartDelay));
        const textOpacityProgress = Math.min(textProgress * 2, 1); // Faster fade in
        setTextOpacity(textOpacityProgress);
        
        if (progress < 1) {
          animationId = requestAnimationFrame(animate);
        } else {
          setTimeout(() => {
            setIsLoading(false);
          }, 300);
        }
      };
      
      animationId = requestAnimationFrame(animate);
    };
    
    // Wait for initial delay, then start animation
    timerId = setTimeout(() => {
      startAnimation();
    }, initialDelay);
    
    return () => {
      if (timerId) clearTimeout(timerId);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);

  useEffect(() => {
    // Set CSS custom properties for animations
    document.documentElement.style.setProperty('--text-opacity', textOpacity.toString());
    // iPad fades in with the same timing as text
    document.documentElement.style.setProperty('--ipad-opacity', textOpacity.toString());
  }, [textOpacity]);

  // Prevent scrolling during loading animation
  useEffect(() => {
    if (isLoading) {
      // Disable scrolling
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      // Re-enable scrolling
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }

    return () => {
      // Cleanup: ensure scrolling is re-enabled if component unmounts
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isLoading]);

  // Prevent hydration mismatch
  if (!mounted || !isLoading) {
    return null;
  }

  return (
    <div className={styles.loadingContainer}>
      <div 
        className={styles.loadingImage}
        style={{
          transform: `scale(${scale})`,
        }}
      />
    </div>
  );
}
