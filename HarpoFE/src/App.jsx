import React, { useRef, useEffect, useState } from 'react';
import './App.css';
import './index.css';
import SparkleImage from './SparkleImage';
import Axios from 'axios';
import LetterModal from './LetterModal'; // Import the modal component


function App() {
  const videoRef = useRef(null);
  const photoRef = useRef(null);
  const audioRef = useRef(null);
  const [audioPlayed, setAudioPlayed] = useState(false)
  const [hasPhoto, setHasPhoto] = useState(false);
  const [emotion, setEmotion] = useState("neutral");
  const [letter, setLetter] = useState("V"); // State to store the current letter



  const getVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: { width: 1920, height: 1080 } })
      .then(stream => {
        let video = videoRef.current;
        video.srcObject = stream;
        video.onloadedmetadata = () => {
          video.play();
        };
      })
      .catch(err => {
        console.error(err);
      });
  };
  

  const takePhoto = () => {
    const width = 414;
    const height = width / (16 / 9);

    let video = videoRef.current;
    let photo = photoRef.current;

    photo.width = width;
    photo.height = height;

    let ctx = photo.getContext('2d');
    ctx.drawImage(video, 0, 0, width, height);

    photo.toBlob(blob => uploadPhoto(blob), 'image/jpeg');
    setHasPhoto(true);
  };

  const uploadPhoto = async (blob) => {
    const formData = new FormData();
    formData.append('file', blob);

    try {
      const response = await Axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('File uploaded successfully', response);
      const newEmotion = response.data.emotion;
      console.log(newEmotion)
      setEmotion(newEmotion);

      if (newEmotion === 'success' && !audioPlayed){
        console.log(audioPlayed)
        audioRef.current.play();
        setAudioPlayed(true)
        console.log(audioPlayed)

      }
      
      setData(response.data);  // Assuming you want to keep this for some other purpose
    } catch (error) {
      console.error('Error uploading file', error);
    }
  };


  useEffect(() => {
    if (emotion === 'success') {
      setShowModal(true);
    }
  }, [emotion]);

  const changeLetter = async (newLetter) => {
    try {
      await Axios.post('http://localhost:5000/letter', { letter: newLetter });
      console.log(`Letter changed to ${newLetter}`);
    } catch (error) {
      console.error('Error changing letter', error);
    }
    setShowModal(false);
  };

  useEffect(() => {
    getVideo();
    const interval = setInterval(takePhoto, 1000); // Take a photo every 1 second
    return () => clearInterval(interval); // Clear the interval when the component unmounts
  }, [videoRef, setEmotion, letter]);

  return (
    <>
      <div className='App'>
        <div>{emotion}</div>
        <div className='image-container'>
          {emotion && <SparkleImage src={`./src/assets/womenReactions/${emotion}.png`} name="reaction_pic" />}
          {letter && <SparkleImage src={`./src/assets/handSigns/${letter}.png`} name="hand_pic"/>}
        </div>
        <video ref={videoRef} className="video-stream"></video>
        <audio ref={audioRef} src="./src/assets/sound/success.mp3" />
      </div>
      <div className={'result ' + (hasPhoto ? 'hasPhoto' : '')}>
        <canvas hidden ref={photoRef}></canvas>
      </div>
      <LetterModal emotion={emotion} setEmotion={setEmotion} setLetter={setLetter} setAudioPlayed={setAudioPlayed} />
    </>
  );
}

export default App;
