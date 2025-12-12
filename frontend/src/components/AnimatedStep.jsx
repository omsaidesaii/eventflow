import { useEffect, useRef } from 'react';
import './AnimatedStep.css';

const AnimatedStep = ({ icon: Icon, title, description, index }) => {
  const stepRef = useRef(null);

  useEffect(() => {
    const element = stepRef.current;
    if (!element) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      element.classList.add('step-visible');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add visible class when element comes into view
            entry.target.classList.add('step-visible');
            // Unobserve after animation to run only once
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2, // Trigger when 20% of element is visible
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before element enters viewport
      }
    );

    observer.observe(element);

    // Cleanup
    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  return (
    <div
      ref={stepRef}
      className="animated-step"
      style={{ '--delay': `${index * 120}ms` }}
    >
      <div className="step-icon-wrapper">
        <div className="step-icon">
          <Icon size={28} />
        </div>
      </div>
      <h3 className="step-title">{title}</h3>
      <p className="step-description">{description}</p>
    </div>
  );
};

export default AnimatedStep;
