import { useState, useEffect } from "react";
import SingleSongCard from "../components/shared/SingleSongCard";
import { makeAuthenticatedGETRequest } from "../utils/serverHelper";
import LoggedInContainer from "../containers/LoggedInContainer";

const MyMusic = () => {
  const [songData, setSongData] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const response = await makeAuthenticatedGETRequest("/song/get/mysongs");
      setSongData(response.data);
    };
    getData();
  }, []);

  return (
    <LoggedInContainer curActiveScreen="myMusic">
      <div className="p-8 rounded  ">
        <div className="bg-img4  rounded-lg flex flex-col justify-center items-center ">
          <div className="flex flex-col justify-center items-center">
            <h1 className="font-black text-white text-border-black text-7xl flex flex-col justify-center items-center">
              My Songs
            </h1>
          </div>
        </div>
      </div>
      <div className="text-black text-xl font-semibold pb-4 pl-2 pt-8">
        My Songs
      </div>
      <div className="space-y-3 overflow-auto">
        {songData.map((item) => {
          return <SingleSongCard info={item} playSound={() => {}} />;
        })}
      </div>
    </LoggedInContainer>
  );
};

export default MyMusic;
