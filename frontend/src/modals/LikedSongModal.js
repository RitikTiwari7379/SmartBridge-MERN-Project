import { useState, useEffect } from "react";
import {
  makeAuthenticatedPOSTRequest,
  makeAuthenticatedGETRequest,
} from "../utils/serverHelper";
import { useNavigate } from "react-router-dom";

const LikedSongModal = ({ closeModal, addSongToPlaylist }) => {
  const navigate = useNavigate();
  const [likedSongsPlaylistId, setLikedSongsPlaylistId] = useState(null);

  const createPlaylist = async () => {
    try {
      const response = await makeAuthenticatedPOSTRequest("/playlist/create", {
        name: "Liked Songs",
        thumbnail: "link",
        description: "something",
        songs: [],
      });

      console.log("Create Playlist Response:", response);

      if (response && response._id) {
        console.log("Playlist created successfully:", response);
        setLikedSongsPlaylistId(response._id);

        // Add the song to the "Liked Songs" playlist
        addSongToPlaylist(response._id);
      } else {
        console.error("Failed to create playlist:", response);
      }
    } catch (error) {
      console.error("Error creating playlist:", error);
    }
    closeModal();
  };

  const AddToPlaylistModal = ({ closeModal, addSongToPlaylist }) => {
    const [myPlaylists, setMyPlaylists] = useState([]);

    useEffect(() => {
      const getData = async () => {
        const response = await makeAuthenticatedGETRequest("/playlist/get/me");
        setMyPlaylists(response.data);
      };
      getData();
    }, []);

    const checkLikedSongsPlaylist = async () => {
      // If "Liked Songs" playlist doesn't exist, create it
      await makeAuthenticatedPOSTRequest("/playlist/create", {
        name: "Liked Songs",
        thumbnail: "", // You can provide a default thumbnail for Liked Songs
        description: "Your Liked Songs",
        songs: [],
      });
      // Fetch updated playlists after creating the "Liked Songs" playlist
      const updatedResponse = await makeAuthenticatedGETRequest(
        "/playlist/get/me"
      );

      if (updatedResponse.status === 404) {
        console.error("Playlist not found:", updatedResponse.statusText);
      } else if (updatedResponse.ok) {
        // Process the successful response
        const playlistData = await updatedResponse.json();
        console.log("Playlist data:", playlistData);
      } else {
        console.error("Unexpected error:", updatedResponse.statusText);
      }
      setMyPlaylists(updatedResponse.data);
    };

    useEffect(() => {
      checkLikedSongsPlaylist();
    }, []); // Run this effect only once when the component mounts

    // Filter out the "Liked Songs" playlist from the display
    const playlistsToDisplay = myPlaylists.filter(
      (playlist) => playlist.name !== "Liked Songs"
    );

    return (
      <div
        className="modal absolute bg-black w-screen h-screen bg-opacity-80 flex justify-center items-center"
        onClick={closeModal}
      >
        <div
          className="bg-white w-1/3 rounded-md p-8"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="text-black mb-5 font-semibold text-lg">
            Select Playlist
          </div>
          <div className="space-y-4 flex flex-col justify-center items-center">
            {playlistsToDisplay.map((item) => {
              return (
                <PlaylistListComponent
                  key={item._id}
                  info={item}
                  addSongToPlaylist={addSongToPlaylist}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const PlaylistListComponent = ({ info, addSongToPlaylist }) => {
    return (
      <div
        className="bg-app-black w-full flex items-center space-x-4 hover:bg-coral hover:bg-opacity-90 cursor-pointer p-3"
        onClick={() => {
          addSongToPlaylist(info._id);
        }}
      >
        <div>
          <img
            src={info.thumbnail}
            className="w-10 h-10 rounded"
            alt="thumbnail"
          />
        </div>
        <div className="text-white font-semibold text-sm">{info.name}</div>
      </div>
    );
  };

  return (
    <div
      className="modal absolute bg-app-black  w-screen h-screen bg-opacity-80 flex justify-center items-center"
      onClick={closeModal}
    >
      <div
        className="bg-app-black w-1/3 rounded-md p-8"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="text-white mb-5 font-semibold text-lg">Liked Song</div>
        <div className="space-y-4 flex flex-col justify-center items-center">
          <div
            className="btn"
            onClick={() => {
              createPlaylist();
            }}
          >
            add
          </div>
        </div>
      </div>
    </div>
  );
};

// export default LikedSongModal;
// import { useState, useEffect } from "react";
// import {
//   makeAuthenticatedPOSTRequest,
//   makeAuthenticatedGETRequest,
// } from "../utils/serverHelper";
// import { useNavigate } from "react-router-dom";

// const LikedSongModal = ({ closeModal, addSongToPlaylist }) => {
//   const navigate = useNavigate();
//   const [likedSongsPlaylistId, setLikedSongsPlaylistId] = useState(null);

//   const createPlaylist = async () => {
//     try {
//       // Check if the "Liked Songs" playlist already exists
//       const existingPlaylists = await makeAuthenticatedGETRequest(
//         "/playlist/get/me"
//       );

//       const likedSongsPlaylist = existingPlaylists.data.find(
//         (playlist) => playlist.name === "Liked Songs"
//       );

//       if (likedSongsPlaylist) {
//         // "Liked Songs" playlist already exists, use its ID
//         setLikedSongsPlaylistId(likedSongsPlaylist._id);
//       } else {
//         // "Liked Songs" playlist doesn't exist, create it
//         const response = await makeAuthenticatedPOSTRequest(
//           "/playlist/create",
//           {
//             name: "Liked Songs",
//             thumbnail: "link",
//             description: "something",
//             songs: [],
//           }
//         );

//         if (response && response._id) {
//           alert("Playlist created successfully:");
//           setLikedSongsPlaylistId(response._id);
//         } else {
//           console.error("Failed to create playlist:", response);
//           // Return here to avoid further execution if the playlist creation fails
//           return;
//         }
//       }

//       // Add the song to the "Liked Songs" playlist
//       if (likedSongsPlaylistId) {
//         addSongToPlaylist(likedSongsPlaylistId);
//       }
//     } catch (error) {
//       console.error("Error creating or updating playlist:", error);
//     }

//     closeModal();
//   };

//   return (
//     <div
//       className="modal absolute bg-app-black  w-screen h-screen bg-opacity-80 flex justify-center items-center"
//       onClick={closeModal}
//     >
//       <div
//         className="bg-app-black w-1/3 rounded-md p-8"
//         onClick={(e) => {
//           e.stopPropagation();
//         }}
//       >
//         <div className="text-white mb-5 font-semibold text-lg">Liked Song</div>
//         <div className="space-y-4 flex flex-col justify-center items-center">
//           <div
//             className="btn"
//             onClick={() => {
//               createPlaylist();
//             }}
//           >
//             add
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

export default LikedSongModal;
