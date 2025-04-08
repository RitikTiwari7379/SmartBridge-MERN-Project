import { useState } from "react";
import TextInput from "../components/shared/TextInput";

import { makeAuthenticatedPOSTRequest } from "../utils/serverHelper";
import { useNavigate } from "react-router-dom";
const CreatePlaylistModal = ({ closeModal }) => {
  const [playlistName, setPlaylistName] = useState("");
  const [playlistThumbnail, setPlaylistThumbnail] = useState("");
  const [playlistDescription, setPlaylistDescrption] = useState("");
  const navigate = useNavigate();
  const createPlaylist = async () => {
    const response = await makeAuthenticatedPOSTRequest("/playlist/create", {
      name: playlistName,
      thumbnail: playlistThumbnail,
      description: playlistDescription,
      songs: [],
    });
    if (response._id) {
      closeModal();
    }
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
        <div className="text-white mb-5 font-semibold text-lg">
          Create Playlist
        </div>
        <div className="space-y-4 flex flex-col justify-center items-center">
          <TextInput
            type={"text"}
            label="Name"
            labelClassName={"text-white"}
            placeholder="Playlist Name"
            className={"w-4/5 mb-5 mt-5"}
            value={playlistName}
            setValue={setPlaylistName}
          />
          <TextInput
            type={"text"}
            label="Thumbnail"
            labelClassName={"text-white"}
            placeholder="Thumbnail"
            className={"w-4/5 mb-5"}
            value={playlistThumbnail}
            setValue={setPlaylistThumbnail}
          />

          <div
            className="btn"
            onClick={() => {
              createPlaylist();
              alert(`Playlist ${playlistName} created Successfully!`);
              navigate("/library");
            }}
          >
            Create
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePlaylistModal;
