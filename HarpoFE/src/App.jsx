import React, { useRef, useEffect, useState } from 'react';
import './App.css';
import SparkleImage from './SparkleImage';
import Axios from 'axios';

function App() {
  const videoRef = useRef(null);
  const photoRef = useRef(null);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [data, setData] = useState("")

  const getVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: { width: 1920, height: 1080 } })
      .then(stream => {
        let video = videoRef.current;
        video.srcObject = stream;
        video.play();
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
      setData(response["data"]["emotion"])
    } catch (error) {
      console.error('Error uploading file', error);
    }
  };

  const closePhoto = () => {
    let photo = photoRef.current;
    let ctx = photo.getContext('2d');

    ctx.clearRect(0, 0, photo.width, photo.height);
    setHasPhoto(false);
  };

  useEffect(() => {
    getVideo();
    const interval = setInterval(takePhoto, 1000); // Take a photo every 1 second
    return () => clearInterval(interval); // Clear the interval when the component unmounts
  }, [videoRef]);

  return (
    <>
      <div className='App'>
        <div>{data}</div>
        <div className='image-container'>
          <SparkleImage src="./src/assets/womenReactions/neutral.png" id="reaction_pic" />
        </div>
        <video ref={videoRef} className="video-stream"></video>
        <button onClick={takePhoto}>SNAP!</button>
      </div>
      <div className={'result ' + (hasPhoto ? 'hasPhoto' : '')}>
        <canvas ref={photoRef}></canvas>
        <button onClick={closePhoto}>CLOSE!</button>
      </div>
    </>
  );
}

export default App;
