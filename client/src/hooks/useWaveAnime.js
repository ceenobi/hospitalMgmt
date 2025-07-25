import { useEffect, useRef, useState, useCallback, useMemo } from "react";

const ANIMATION_TYPES = {
  FADE_UP: 'fade-up',
  FADE_DOWN: 'fade-down',
  FADE_LEFT: 'fade-left',
  FADE_RIGHT: 'fade-right',
  ZOOM_IN: 'zoom-in',
  ZOOM_OUT: 'zoom-out'
};

const ANIMATION_CLASSES = {
  [ANIMATION_TYPES.FADE_UP]: {
    initial: 'translate-y-8 opacity-0',
    animate: 'translate-y-0 opacity-100'
  },
  [ANIMATION_TYPES.FADE_DOWN]: {
    initial: '-translate-y-8 opacity-0',
    animate: 'translate-y-0 opacity-100'
  },
  [ANIMATION_TYPES.FADE_LEFT]: {
    initial: 'translate-x-8 opacity-0',
    animate: 'translate-x-0 opacity-100'
  },
  [ANIMATION_TYPES.FADE_RIGHT]: {
    initial: '-translate-x-8 opacity-0',
    animate: 'translate-x-0 opacity-100'
  },
  [ANIMATION_TYPES.ZOOM_IN]: {
    initial: 'scale-75 opacity-0',
    animate: 'scale-100 opacity-100',
    transformOrigin: 'center center'
  },
  [ANIMATION_TYPES.ZOOM_OUT]: {
    initial: 'scale-105 opacity-0',
    animate: 'scale-100 opacity-100'
  }
};

const DEFAULT_OPTIONS = {
  threshold: 0.05,
  rootMargin: '0px',
  staggerDelay: 50,
  duration: 600,
  once: true,
  animationType: ANIMATION_TYPES.FADE_UP
};

export const useWaveAnimation = (options = {}) => {
  const {
    threshold,
    rootMargin,
    staggerDelay,
    duration,
    once,
    animationType
  } = { ...DEFAULT_OPTIONS, ...options };

  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);
  const observerRef = useRef(null);

  const handleIntersection = useCallback((entries) => {
    entries.forEach(entry => {
      console.log('Intersection entry:', {
        isIntersecting: entry.isIntersecting,
        target: entry.target,
        intersectionRatio: entry.intersectionRatio,
        time: entry.time
      });
      
      if (entry.isIntersecting) {
        console.log('Element is visible, triggering animation');
        setIsVisible(true);
        if (once && observerRef.current) {
          observerRef.current.unobserve(entry.target);
        }
      } else if (!once) {
        console.log('Element is not visible, resetting');
        setIsVisible(false);
      }
    });
  }, [once]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin
    });
    
    observerRef.current = observer;
    const currentRef = containerRef.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, [handleIntersection, threshold, rootMargin]);

  const getItemStyle = useCallback((index = 0) => ({
    '--stagger-delay': `${index * staggerDelay}ms`,
    '--animation-duration': `${duration}ms`,
    animationDelay: `calc(var(--stagger-delay))`,
    animationDuration: `var(--animation-duration)`,
    animationFillMode: 'both',
    animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
    willChange: 'transform, opacity'
  }), [staggerDelay, duration]);

  const getItemClassName = useCallback((baseClasses = '') => {
    const animation = ANIMATION_CLASSES[animationType] || ANIMATION_CLASSES[DEFAULT_OPTIONS.animationType];
    const baseTransition = 'transition-all duration-[--animation-duration] ease-out';
    const visibilityClass = isVisible ? animation.animate : animation.initial;
    
    return [
      baseClasses,
      baseTransition,
      visibilityClass,
      isVisible ? 'animate-in' : ''
    ].filter(Boolean).join(' ');
  }, [isVisible, animationType]);

  return useMemo(() => ({
    isVisible,
    containerRef,
    getItemStyle,
    getItemClassName
  }), [isVisible, getItemStyle, getItemClassName]);
};

export { ANIMATION_TYPES };
