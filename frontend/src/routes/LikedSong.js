import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoggedInContainer from "../containers/LoggedInContainer";
import {
  makeAuthenticatedGETRequest,
  makeAuthenticatedPOSTRequest,
} from "../utils/serverHelper";

const Library = () => {
  const [likedSongsPlaylist, setLikedSongsPlaylist] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await makeAuthenticatedGETRequest("/playlist/get/me");
      console.log(response);
      const likedSongsPlaylist = response.data.find(
        (playlist) => playlist.name === "Liked Songs"
      );

      if (likedSongsPlaylist) {
        // Fetch the songs associated with the Liked Songs playlist
        const playlistWithSongs = await makeAuthenticatedGETRequest(
          `/playlist/get/me/${likedSongsPlaylist._id}`
        );
        setLikedSongsPlaylist(playlistWithSongs);
      }
    };

    fetchData();
  }, []);

  const addToLikedSongs = async (songId) => {
    // Add the song to the Liked Songs playlist
    await makeAuthenticatedPOSTRequest(
      `/playlist/add-song/${likedSongsPlaylist._id}`,
      {
        songId: songId,
      }
    );

    // Refetch the updated Liked Songs playlist
    const updatedLikedSongsPlaylist = await makeAuthenticatedGETRequest(
      `/playlist/get/me/${likedSongsPlaylist._id}`
    );
    setLikedSongsPlaylist(updatedLikedSongsPlaylist);
  };

  return (
    <LoggedInContainer curActiveScreen={"library"}>
      <div className="p-8 rounded  ">
        <div className="bg-img3 rounded-lg flex flex-col justify-center items-center ">
          <div className="flex flex-col justify-center items-center">
            <h1 className="font-black text-white text-border-black text-7xl flex flex-col justify-center items-center">
              Liked Songs
            </h1>
          </div>
        </div>
      </div>

      {likedSongsPlaylist && (
        <>
          <div className="text-black text-xl px-7 pt-3 font-semibold">
            Liked Songs
          </div>
          <div className="py-7 px-5 grid gap-5 grid-cols-5">
            {likedSongsPlaylist.songs.map((song) => (
              <div
                key={song._id}
                className="bg-black hover:opacity-80 w-full p-4 rounded-lg cursor-pointer"
                onClick={() => navigate(`/song/${song._id}`)}
              >
                <div className=" ">
                  <img
                    className=" py-2 w-full rounded-md"
                    src={song.thumbnail}
                    alt={song.name}
                  />
                  <div className="text-white text-lg font-semibold py-2">
                    {song.name}
                  </div>
                  <div className="text-white text-sm">{`${song.artist.firstName} ${song.artist.lastName}`}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </LoggedInContainer>
  );
};

export default Library;
