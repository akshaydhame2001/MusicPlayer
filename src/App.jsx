import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./index.css";

const App = () => {
  const [songs, setSongs] = useState([]);
  const [curr, setCurr] = useState({});
  const [showPlayer, setShowPlayer] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const audioPlayer = useRef();
  const [gridView, setGridView] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  useEffect(() => {
    axios
      .get(
        "https://s3-ap-southeast-1.amazonaws.com/he-public-data/studiod9c0baf.json"
      )
      .then((response) => {
        setSongs(response.data);
      });
  }, []);

  const handlePlay = (song) => {
    setCurr(song);
    if (audioPlayer.current) {
      audioPlayer.current.pause();
      audioPlayer.current.load();
      audioPlayer.current.play();
    }
    setShowPlayer(true);
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      audioPlayer.current.pause();
    } else {
      audioPlayer.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    const duration = audioPlayer.current.duration;
    const currentTime = audioPlayer.current.currentTime;
    setProgress((currentTime / duration) * 100);
  };

  const handleProgressBarClick = (e) => {
    const progressBarWidth = e.target.clientWidth;
    const clickPosition = e.nativeEvent.offsetX;
    const clickPercent = (clickPosition / progressBarWidth) * 100;
    const newTime = (clickPercent * audioPlayer.current.duration) / 100;
    audioPlayer.current.currentTime = newTime;
    setProgress(clickPercent);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = songs.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const hasScrollbar = document.body.scrollHeight > document.body.clientHeight;

  return (
    <>
      <div className="head">
        <div>
          <img
            className="coke-studio-logo"
            src="https://yt3.ggpht.com/ytc/AKedOLTNtHgVmX114S4cnjoyFaDDJE6N1zNBwKgRNnYNAg=s900-c-k-c0x00ffffff-no-rj"
            alt="Coke-studio-logo"
          />
        </div>
        <div className="heading">
          <h1 className="coke">
            Coke <span className="studio">Studio</span>
          </h1>
        </div>
        <div className="view-select">
          <button
            className="view-btn"
            onClick={() => {
              setGridView(true);
            }}
          >
            <div className="grid-symbol">
              <span>&#9724;</span>
              <span>&#9724;</span>
              <span>&#9724;</span>
            </div>
            <div className="grid-symbol">
              <span>&#9724;</span>
              <span>&#9724;</span>
              <span>&#9724;</span>
            </div>
            <div className="grid-symbol">
              <span>&#9724;</span>
              <span>&#9724;</span>
              <span>&#9724;</span>
            </div>
          </button>
          <button
            className="view-btn"
            onClick={() => {
              setGridView(false);
            }}
          >
            <div className="list-symbol">
              <span>&#9634;</span>
            </div>
            <div className="list-symbol">
              <span>&#9634;</span>
            </div>
            <div className="list-symbol">
              <span>&#9634;</span>
            </div>
          </button>
        </div>
      </div>
      {gridView ? (
        <h4 className="view-heading">Play Now from grid</h4>
      ) : (
        <h4 className="view-heading"> Play now from list </h4>
      )}

      <div>
        {gridView ? (
          <div className="grid">
            {currentItems.map((element, index) => (
              <div
                key={index}
                className="inside-grid"
                onClick={() => handlePlay(element)}
              >
                <img src={element.cover_image} alt={element.song} />
                <div className="grid-details">
                  <h4 style={{ margin: "0px 0px" }}>{element.song}</h4>
                  <p style={{ margin: "0px" }}>{element.artists}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="list">
            {currentItems.map((element, index) => (
              <div
                key={index}
                className="inside-list"
                onClick={() => handlePlay(element)}
              >
                <img src={element.cover_image} alt={element.song} />
                <div className="list-details">
                  <h4 style={{ margin: "0px 0px 5px 0px" }}>{element.song}</h4>
                  <p style={{ margin: "0px" }}>{element.artists}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showPlayer ? (
        <div className="music-player">
          <div>
            {" "}
            <img src={curr.cover_image} alt={curr.song} />{" "}
          </div>
          <div>
            <div> {curr.song} </div>
            <div> {curr.artists} </div>
          </div>

          <audio
            controls
            ref={audioPlayer}
            autoPlay
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleTimeUpdate}
          >
            <source src={curr.url}></source>
          </audio>
          {/* <div className="progress-container" onClick={handleProgressBarClick}>
            <div
              className="progress"
              style={{ width: `${progress}%`, zIndex: "1" }}
            ></div>
          </div>
          <div>
            <button className="audio-btn" onClick={handleTogglePlay}>
              {isPlaying ? "Pause" : "Play"}
            </button>
          </div> */}
        </div>
      ) : null}

      <ul className="pagination">
        {songs.length > 0 &&
          Array.from({ length: Math.ceil(songs.length / itemsPerPage) }).map(
            (_, index) => (
              <li key={index} className="page-item">
                <button
                  onClick={() => paginate(index + 1)}
                  className={`page-link ${
                    currentPage === index + 1 ? "active" : ""
                  }`}
                >
                  {index + 1}
                </button>
              </li>
            )
          )}
      </ul>
    </>
  );
};

export default App;
