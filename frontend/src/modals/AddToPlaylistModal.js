import { useState, useEffect } from "react";
import { makeAuthenticatedGETRequest } from "../utils/serverHelper";

const AddToPlaylistModal = ({
  closeModal,
  addSongToPlaylist,
  likedSongsPlaylistId,
}) => {
  const [myPlaylists, setMyPlaylists] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const response = await makeAuthenticatedGETRequest("/playlist/get/me");

      // Filter out the "Liked Songs" playlist from the display
      const playlistsToDisplay = response.data.filter(
        (playlist) => playlist.name !== "Liked Songs"
      );

      setMyPlaylists(playlistsToDisplay);
    };
    getData();
  }, [likedSongsPlaylistId]);

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
          {myPlaylists.map((item) => (
            <PlaylistListComponent
              key={item._id}
              info={item}
              addSongToPlaylist={addSongToPlaylist}
            />
          ))}
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

export default AddToPlaylistModal;
