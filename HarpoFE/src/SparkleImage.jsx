import React, { useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import './index.css';

const SparkleImage = ({ src, name }) => {
  const [fadeIn, setFadeIn] = useSpring(() => ({
    from: { opacity: 0 },
    to: { opacity: 1 }
  }));

  useEffect(() => {
    setFadeIn({ opacity: 1, reset: true });
  }, [src, setFadeIn]);

  return (
    <animated.div style={fadeIn} className="sparkle-wrapper">
      <img src={src} id={name} alt="Sparkling" className="sparkle-image" />
    </animated.div>
  );
};

export default SparkleImage;
