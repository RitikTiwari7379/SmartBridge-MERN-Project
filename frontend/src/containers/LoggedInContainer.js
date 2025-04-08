import logo from "../../src/logotr.png";
import { Icon } from "@iconify/react";
import TextHover from "../components/shared/TextHover";
import Cookies from "js-cookie";
import { heart } from "./heart.png";
import { useNavigate } from "react-router-dom";
import { useState, useLayoutEffect, useRef, useEffect } from "react";
import IconText from "../components/shared/IconText";
import "../index.css";
import { Howl } from "howler";
import songContext from "../contexts/songContext";
import { useContext } from "react";
import CreatePlaylistModal from "../modals/CreatePlaylistModal";
import AddToPlaylistModal from "../modals/AddToPlaylistModal";
import LikedSongModal from "../modals/LikedSongModal";
import { removeTokenFromStorage } from "../utils/LogoutHelper"; // You need to implement this utility function

import {
  makeAuthenticatedPOSTRequest,
  makeAuthenticatedGETRequest,
} from "../utils/serverHelper";

const LoggedInContainer = ({ children, curActiveScreen, toggleTheme }) => {
  const [createPlaylistModalOpen, setCreatePlaylistModalOpen] = useState(false);
  const [addToPlaylistModalOpen, setAddToPlaylistModalOpen] = useState(false);
  const [LikedSongModalOpen, setLikedSongModalOpen] = useState(false);
  const [songProgress, setSongProgress] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [songDuration, setSongDuration] = useState(0);
  const [clickedPosition, setClickedPosition] = useState(null);
  const [queue, setQueue] = useState([]); // Add a queue state
  const [queueIndex, setQueueIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const logout = () => {
    // Destroy the JWT token and redirect to the login page
    Cookies.remove("token");
    removeTokenFromStorage();
    navigate("/login");
  };

  const {
    currentSong,
    setCurrentSong,
    soundPlayed,
    setSoundPlayed,
    isPaused,
    setIsPaused,
  } = useContext(songContext);

  const firstUpdate = useRef(true);

  useLayoutEffect(() => {
    // the following if statement will prevent the useEffect from running on the first render.
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    if (!currentSong) {
      return;
    }
    changeSong(currentSong.track);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSong && currentSong.track]);

  const addSongToPlaylist = async (playlistId) => {
    const songId = currentSong._id;

    const payload = { playlistId, songId };
    const response = await makeAuthenticatedPOSTRequest(
      "/playlist/add/song",
      payload
    );
    if (response._id) {
      setAddToPlaylistModalOpen(false);
      console.log(response);
    }
  };

  const playSound = () => {
    if (!soundPlayed) {
      return;
    }
    soundPlayed.play();
  };

  const playNextSong = () => {
    // Check if there's a next song in the queue
    if (queueIndex < queue.length - 1) {
      setQueueIndex((prevIndex) => prevIndex + 1);
      changeSong(queue[queueIndex + 1].track);
    } else {
      // If there's no next song, stop playing
      setIsPaused(true);
      setSoundPlayed(null);
      setQueue([]);
      setQueueIndex(0);
    }
  };

  const changeSong = (songSrc) => {
    // If there's a currently playing sound, stop it
    if (soundPlayed) {
      soundPlayed.stop();
    }

    let sound = new Howl({
      src: [songSrc],
      html5: true,
      onplay: () => {
        const id = setInterval(() => {
          setSongProgress((prevProgress) => prevProgress + 1);
        }, 1000);
        setSongDuration(sound.duration());
        setIntervalId(id);
      },
      onend: () => {
        clearInterval(intervalId);
        setSongProgress(0);
        setSongDuration(0);
        playNextSong(); // Play the next song when the current song ends
      },
    });

    setSoundPlayed(sound);
    sound.play();
    setIsPaused(false);
  };
  const pauseSound = () => {
    soundPlayed.pause();
  };

  const togglePlayPause = () => {
    if (isPaused) {
      playSound();
      setIsPaused(false);
    } else {
      pauseSound();
      setIsPaused(true);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const ProgressBar = ({ duration }) => {
    const [markerPosition, setMarkerPosition] = useState(0);

    const handleProgressBarClick = (e) => {
      if (soundPlayed) {
        const clickPosition = e.nativeEvent.offsetX;
        const containerWidth = e.currentTarget.clientWidth;
        const newPosition = (clickPosition / containerWidth) * duration;

        soundPlayed.seek(newPosition);
        setProgress((newPosition / duration) * 100);
        setMarkerPosition(newPosition);
      }
    };

    useEffect(() => {
      if (soundPlayed) {
        soundPlayed.on("play", () => {
          setIsPlaying(true);

          // Fetch and set the duration
          const duration = soundPlayed.duration();
          setSongDuration(duration);

          // Start tracking progress
          const id = setInterval(() => {
            setProgress((soundPlayed.seek() / duration) * 100);
          }, 1000); // Update progress every second
          setIntervalId(id);
        });

        soundPlayed.on("pause", () => {
          setIsPlaying(false);
        });

        soundPlayed.on("stop", () => {
          setIsPlaying(false);
          setProgress(0);
        });

        soundPlayed.on("end", () => {
          setIsPlaying(false);
          setProgress(0);
        });

        soundPlayed.on("seek", () => {
          setProgress((soundPlayed.seek() / duration) * 100);
          setMarkerPosition(soundPlayed.seek());
        });
      }
    }, [soundPlayed, duration]);

    // Clear the interval when the component is unmounted or paused
    useEffect(() => {
      return () => {
        clearInterval(intervalId);
      };
    }, [intervalId]);

    return (
      <div
        className="progress-bar-container pt-2"
        onClick={handleProgressBarClick}
      >
        {isPlaying && (
          <>
            <div
              className="progress-bar"
              style={{
                width: `${progress.toFixed(2)}%`,
              }}
            ></div>
            <div className="time-display font-semibold text-sm">
              {formatTime(soundPlayed.seek())} / {formatTime(duration)}
            </div>
          </>
        )}
      </div>
    );
  };

  const addToQueue = (song) => {
    setQueue((prevQueue) => [...prevQueue, song]);
    if (!soundPlayed) {
      // If there's no currently playing song, start playing the added song
      changeSong(song.track);
    }
  };

  const navigate = useNavigate();
  const [likedSongsPlaylistId, setLikedSongsPlaylistId] = useState(null);

  useEffect(() => {
    // Check local storage for the likedSongsPlaylistId
    const storedPlaylistId = localStorage.getItem("likedSongsPlaylistId");
    if (storedPlaylistId) {
      setLikedSongsPlaylistId(storedPlaylistId);
    }
  }, []);

  // const createPlaylist = async () => {
  //   try {
  //     // Check if the "Liked Songs" playlist already exists
  //     if (storedPlaylistId && likedSongsPlaylistId) {
  //       console.log(
  //         "Liked Songs playlist already exists:",
  //         likedSongsPlaylistId
  //       );

  //       // Check if the song is already in the "Liked Songs" playlist
  //       const playlistInfo = await makeAuthenticatedGETRequest(
  //         `/playlist/get/playlist/${likedSongsPlaylistId}`
  //       );

  //       if (playlistInfo && playlistInfo.songs.includes(currentSong._id)) {
  //         alert("Song is already in the Liked Songs playlist");
  //       } else {
  //         // Add the song to the existing "Liked Songs" playlist
  //         alert("Song Added");
  //         addSongToPlaylist(likedSongsPlaylistId);
  //       }
  //     } else {
  //       // If the "Liked Songs" playlist doesn't exist, create it
  //       const response = await makeAuthenticatedPOSTRequest(
  //         "/playlist/create",
  //         {
  //           name: "Liked Songs",
  //           thumbnail:
  //             "https://t4.ftcdn.net/jpg/04/27/18/13/360_F_427181303_ufsuIfzyLb5Mb0VAOlMEYiDtSkUSubKf.jpg",
  //           description: "something",
  //           songs: [currentSong._id], // Add the current song to the playlist
  //         }
  //       );

  //       console.log("Create Playlist Response:", response);

  //       if (response && response._id) {
  //         console.log("Playlist created successfully:", response);
  //         setLikedSongsPlaylistId(response._id);

  //         // Save the playlistId to local storage
  //         localStorage.setItem("likedSongsPlaylistId", response._id);

  //         // Add the song to the newly created "Liked Songs" playlist
  //       } else {
  //         console.error("Failed to create playlist:", response);
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error creating or updating playlist:", error);
  //   }
  // };
  const createPlaylist = async () => {
    try {
      // Check if the "Liked Songs" playlist already exists
      if (likedSongsPlaylistId) {
        console.log(
          "Liked Songs playlist already exists:",
          likedSongsPlaylistId
        );

        // Check if the song is already in the "Liked Songs" playlist
        const playlistInfo = await makeAuthenticatedGETRequest(
          `/playlist/get/playlist/${likedSongsPlaylistId}`
        );

        if (playlistInfo && playlistInfo.songs.includes(currentSong._id)) {
          alert("Song is already in the Liked Songs playlist");
        } else {
          // Add the song to the existing "Liked Songs" playlist
          alert("Song Added");
          addSongToPlaylist(likedSongsPlaylistId);
        }
      } else {
        // If the "Liked Songs" playlist doesn't exist, create it
        // and if local storage is not set, create a new playlist
        const storedPlaylistId = localStorage.getItem("likedSongsPlaylistId");

        if (!storedPlaylistId) {
          const response = await makeAuthenticatedPOSTRequest(
            "/playlist/create",
            {
              name: "Liked Songs",
              thumbnail:
                "https://t4.ftcdn.net/jpg/04/27/18/13/360_F_427181303_ufsuIfzyLb5Mb0VAOlMEYiDtSkUSubKf.jpg",
              description: "something",
              songs: [currentSong._id], // Add the current song to the playlist
            }
          );

          console.log("Create Playlist Response:", response);

          if (response && response._id) {
            console.log("Playlist created successfully:", response);
            setLikedSongsPlaylistId(response._id);

            // Save the playlistId to local storage
            localStorage.setItem("likedSongsPlaylistId", response._id);

            // Add the song to the newly created "Liked Songs" playlist
          } else {
            console.error("Failed to create playlist:", response);
          }
        }
      }
    } catch (error) {
      console.error("Error creating or updating playlist:", error);
    }
  };

  return (
    <div className="h-full w-full">
      {createPlaylistModalOpen && (
        <CreatePlaylistModal
          closeModal={() => {
            setCreatePlaylistModalOpen(false);
          }}
        />
      )}
      {addToPlaylistModalOpen && (
        <AddToPlaylistModal
          closeModal={() => {
            setAddToPlaylistModalOpen(false);
          }}
          addSongToPlaylist={addSongToPlaylist}
          onClick={createPlaylist}
        />
      )}
      {LikedSongModalOpen && (
        <LikedSongModal
          closeModal={() => {
            setLikedSongModalOpen(false);
          }}
          addSongToPlaylist={addSongToPlaylist}
        />
      )}

      <div className={`${currentSong ? "h-9/10" : "h-full"} w-full flex`}>
        <div className="left-panel">
          <div className="flex flex-col justify-between">
            {/* left panel */}
            <div className="logo w-40">
              <img src={logo} alt="hello" />
            </div>

            <div className="py-2 px-5 ">
              <IconText
                targetLink={"/LoggedInHome"}
                iconName={"material-symbols:home"}
                display={"Home"}
                active={curActiveScreen === "home"}
              />
              <IconText
                iconName={"material-symbols:search"}
                display={"Search"}
                active={curActiveScreen === "search"}
                targetLink={"/Search"}
              />
              <IconText
                iconName={"fluent:library-20-filled"}
                display={"Library"}
                active={curActiveScreen === "Library"}
                targetLink={"/Library"}
              />
              <IconText
                iconName={"material-symbols:library-music"}
                display={"My Music"}
                targetLink={"/MyMusic"}
                active={curActiveScreen === "MyMusic"}
              />
            </div>
            <div className="py-10 px-5">
              <IconText
                iconName={"icon-park-solid:add"}
                display={"Create playlist"}
                onClick={() => {
                  setCreatePlaylistModalOpen(true);
                }}
              />
              <IconText
                iconName={"solar:heart-bold-duotone"}
                display={"Liked songs"}
                targetLink={"/Liked"}
              />
            </div>

            <div
              className={`app-container ${
                curActiveScreen === "home" ? "home-bg" : ""
              }`}
            >
              <div className="px-10 py-20 flex py-0">
                <div className="cursor-pointer  ">
                  <div className="ml-2 text-sm font-semibold hover:text-grey">
                    <div>
                      <input
                        type="checkbox"
                        className="checkbox"
                        id="checkbox"
                        onClick={toggleTheme}
                      />
                      <label htmlFor="checkbox" className="checkbox-label">
                        <Icon
                          icon="akar-icons:moon-fill"
                          color="black"
                          fontSize={18}
                        />
                        <Icon
                          icon="fa-solid:sun"
                          color="#f1410d"
                          fontSize={18}
                        />
                        <span className="ball"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-full w-4/5 overflow-auto ">
          <div className="navbar w-full h-24 bg-black  opacity-90 flex items-center justify-end ">
            <div className="w-1/2 flex h-full">
              <div className="w-2/3 flex justify-around items-center">
                <TextHover display={"Premium"} />
                <TextHover display={"Support"} />
                <TextHover display={"Download"} />
                <div className="h-1/2 border-r border-white"></div>
              </div>
              <div className="w-1/3 flex justify-around h-full items-center">
                <TextHover display={"Upload Song"} targetLink={"/UploadSong"} />
                <div
                  className="bg-white w-24 h-10 flex items-center justify-center rounded-full font-semibold cursor-pointer"
                  onClick={logout}
                >
                  Logout
                </div>
              </div>
            </div>
          </div>
          <div className="content p-7 pt-0  overflow-auto ">{children}</div>
        </div>
      </div>
      <ProgressBar duration={songDuration} />
      {/* current playing song */}
      {currentSong && (
        <div
          className="h-1/10 w-full bg-app-black
       opacity-90 flex text-white flex items-center p-3"
        >
          <div className="w-1/4 flex items-center">
            <img
              src={currentSong.thumbnail}
              alt="currentSongThumbail"
              className="h-14 w-14 rounded"
            />
            <div className="text-white pl-4 flex flex-col items-center justify center flex center ">
              <div className="cursor-pointer">{currentSong.name}</div>
              <div className="text-xs cursor-pointer  text-gray-400 ">
                {currentSong.artist.firstName +
                  " " +
                  currentSong.artist.lastName}
              </div>
            </div>
          </div>

          <div className="w-1/2 h-full flex justify-center flex-col items-center cursor-pointer">
            <div className="flex items-center justify-between space-x-8  ">
              <Icon
                icon="mingcute:shuffle-line"
                className="cursor-pointer h-6 w-6 hover:text-red-600"
              />

              <Icon
                icon="ant-design:backward-outlined"
                className="cursor-pointer h-6 w-6 text-coral hover:text-red-600"
              />
              <Icon
                icon={isPaused ? "carbon:play-filled" : "carbon:pause-filled"}
                className="hover:text-red-600 cursor-pointer h-10 w-10"
                onClick={togglePlayPause}
              />
              <Icon
                icon="ant-design:forward-outlined"
                className="cursor-pointer h-6 w-6 hover:text-red-600"
              />
              <Icon
                icon="icomoon-free:loop"
                className="cursor-pointer text-coral h-5 w-5 hover:text-red-600"
              />
            </div>

            {/* <div>progress bar</div> */}
          </div>
          <div className="w-1/4 flex justify-end pr-4 space-x-4 items-center">
            <Icon
              icon="ic:round-playlist-add"
              fontSize={30}
              className="cursor-pointer text-gray-500 hover:text-white"
              onClick={() => {
                setAddToPlaylistModalOpen(true);
              }}
            />
            <Icon
              icon="ph:heart-bold"
              fontSize={25}
              className="cursor-pointer text-gray-500 hover:text-white"
              onClick={() => {
                createPlaylist();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LoggedInContainer;
