// LetterModal.jsx
import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import Axios from 'axios';

const LetterModal = ({ emotion, setEmotion, setLetter, setAudioPlayed }) => {
  const [show, setShow] = useState(true);
  const [newLetter, setNewLetter] = useState('');

  // useEffect(() => {
  //   setShow(emotion === 'success');
  // }, [emotion]);

  const animation = useSpring({
    opacity: show ? 1 : 0,
    transform: show ? `translateY(0)` : `translateY(-100%)`
  });

  const handleChange = (e) => {
    const { value } = e.target;
    // Check if value is a single alphabetic character and convert it to uppercase
    if (value.match(/^[A-Za-z]?$/)) {
      setNewLetter(value.toUpperCase());
    }
  };

  const changeLetter = async (newLetter) => {
    try {
      await Axios.post('http://localhost:5000/letter', { letter: newLetter });
      console.log(`Letter changed to ${newLetter}`);
      setLetter(newLetter); // Update the letter state in the App component
      setEmotion('neutral'); // Reset emotion after changing the letter
    } catch (error) {
      console.error('Error changing letter', error);
    }

    setAudioPlayed(false)
    // setShow(ture);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ensure only a single uppercase letter is submitted
    if (newLetter.match(/^[A-Z]$/)) {
      changeLetter(newLetter);
    } else {
      console.error('Invalid input: Must be a single uppercase letter');
    }
  };

  return (
    <animated.div style={animation} className="modal">
      <form onSubmit={handleSubmit}>
        <label>
          Choose a new letter:
          <input
            type="text"
            value={newLetter}
            onChange={handleChange}
            maxLength="1"
            pattern="[A-Za-z]"
            title="Enter a single letter"
            required
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    </animated.div>
  );
};

export default LetterModal;
