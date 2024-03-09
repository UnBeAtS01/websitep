// pages/index.tsx
import Head from 'next/head';
import React,{useRef} from 'react';

const Presence: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleVideoClick = () => {
      if (videoRef.current) {
        if (videoRef.current.paused) {
          videoRef.current.play();
        } else {
          videoRef.current.pause();
        }
      }
    };
  
  return (
    <div className="container" onClick={handleVideoClick}>
      <div className="video-background">
        <video  ref={videoRef} autoPlay muted loop>
          <source src={"/koladBungee4_video.mp4"}  type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="overlay">
        <h1 className='text1'>Our Partners</h1>
        <h1 className="text">Kolad Bungee</h1>
      </div>

      <style jsx global>{`
        body {
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Avenir Next, Avenir,
            Helvetica, sans-serif;
          background: black;
          color: white;
        }
      `}</style>

      <style jsx>{`
        .container {
          position: relative;
          height: 100vh;
          overflow: hidden;
          border-radius:40px;
          margin-top:10px;
        }

        .video-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: -1;
        }

        video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.5);
        }
        .heading{
            position:absolute;
            font-size: 4rem;
            color: green;
            left:10px;
            top:10px ;
        }
        .text {
         position:absolute;
          font-size: 4rem;
          color: #90EE90;
          left:5%;
          top:10%;
          z-index:10;
        }
      `}</style>
    </div>
  );
};

export default Presence;
