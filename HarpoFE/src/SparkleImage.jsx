import React from 'react';
import { useSpring, animated } from 'react-spring';
import './index.css'

const SparkleImage = ({ src }) => {
  // This animation will fade in the image
  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 1000 }, // This controls the duration of the fade
  });

  return (
    <animated.div style={fadeIn} className="sparkle-wrapper">
      <img src={src} alt="Sparkling" className="sparkle-image" />
    </animated.div>
  );
};

export default SparkleImage;
