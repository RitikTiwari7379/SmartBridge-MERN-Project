import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoggedInContainer from "../containers/LoggedInContainer";
import { makeAuthenticatedGETRequest } from "../utils/serverHelper";
import SingleSongCard from "../components/shared/SingleSongCard";

const SinglePlaylistView = () => {
  const [playlistDetails, setPlaylistDetails] = useState({});
  const { playlistId } = useParams();

  useEffect(() => {
    const getData = async () => {
      const response = await makeAuthenticatedGETRequest(
        "/playlist/get/playlist/" + playlistId
      );
      // setPlaylistDetails(response);
      setPlaylistDetails(response);
    };
    getData();
  }, []);

  return (
    <LoggedInContainer curActiveScreen={"library"}>
      {playlistDetails._id && (
        <div>
          <div className="p-8 rounded  ">
            <div className="bg-img5  rounded-lg flex flex-col justify-center items-center ">
              <div className="flex flex-col justify-center items-center">
                <h1 className="font-black text-white text-border-black text-7xl flex flex-col justify-center items-center">
                  {playlistDetails.name}
                </h1>
              </div>
            </div>
          </div>
          <div className="pt-10 space-y-3">
            {playlistDetails.songs.map((item) => {
              return (
                <SingleSongCard
                  info={item}
                  key={JSON.stringify(item)}
                  playSound={() => {}}
                />
              );
            })}
            ,
          </div>

          <div className="pt-10 space-y-3"></div>
        </div>
      )}
    </LoggedInContainer>
  );
};

export default SinglePlaylistView;
