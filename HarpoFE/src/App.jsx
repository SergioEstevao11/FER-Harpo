import { useRef, useEffect, useState } from 'react'
import './App.css'

function App() {
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

  useEffect(() => {
    getVideo();
  }, [videoRef])

  return (
    <>
      
      <div className='App'>
        <video ref={videoRef}></video>
        <button>SNAP!</button>
      </div>
      <div className={'result' + (hasPhoto ? 'hasPhoto' : '')}>
        <canvas ref={photoRef}></canvas>
        <button>CLOSE!</button>
      </div>
    </>
  )
}

export default App
