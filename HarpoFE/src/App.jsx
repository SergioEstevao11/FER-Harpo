import { useRef, useEffect, useState } from 'react'
import './App.css'
import SparkleImage from './SparkleImage';
import Axios from "axios";


function App() {
  const [data,setData]=useState("")

  const videoRef = useRef(null)
  const photoRef = useRef(null)

  const [hasPhoto, setHasPhoto] = useState(false)

  const getVideo = () => {
    navigator.mediaDevices.getUserMedia({video: {
      width: 1920,
      height: 1080
    }})
    .then(stream => {
      let video = videoRef.current
      video.srcObject = stream
      video.play()
    })
    .catch(err => {
      console.log(err)
    })
  }

  const takePhoto = () => {
    const width = 414;
    const height = width / (16/9)

    let video = videoRef.current
    let photo = photoRef.current

    photo.width = width
    photo.height = height

    let ctx = photo.getContext('2d')
    ctx.drawImage(video, 0, 0, width, height)
    setHasPhoto(true)
  }

  const closePhoto = () => {
    let photo = photoRef.current
    let ctx = photo.getContext('2d')

    ctx.clearRect(0, 0, photo.width, photo.height)

    setHasPhoto(false)
  }

  const getFeedback=async()=>{
    const response=await Axios.get("http://localhost:5000/test");
    setData(response.data)
  }

  useEffect(() => {
    //getFeedback();
    getVideo();
    getFeedback();
  }, [videoRef])

  return (
    <>
      <div className='App'>
        <div className='image-container'>
          <SparkleImage src="./src/assets/womenReactions/women-clap.png" id="reaction_pic"/>
        </div>
        <video ref={videoRef} className="video-stream"></video>
        <button onClick={takePhoto}>SNAP!</button>
      </div>
      <div className={'result ' + (hasPhoto ? 'hasPhoto' : '')}>
        <canvas ref={photoRef}></canvas>
        <button onClick={closePhoto}>CLOSE!</button>
      </div>
    </>
  )
}

export default App
