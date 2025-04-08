import { useState, useEffect } from "react";
import SingleSongCard from "../components/shared/SingleSongCard";
import { makeAuthenticatedGETRequest } from "../utils/serverHelper";
import LoggedInContainer from "../containers/LoggedInContainer";

const HomeCard = () => {
  const [songDataHome, setSongDataHome] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const response = await makeAuthenticatedGETRequest("/song/get/mysongs");
      const firstFiveSongs = response.data.slice(0, 5);
      setSongDataHome(firstFiveSongs);
    };

    getData();
  }, []);

  useEffect(() => {
    console.log("songData:", songDataHome);
  }, [songDataHome]);

  return (
    <LoggedInContainer curActiveScreen="myMusic">
      <div className="p-8 rounded  ">{/* ... (previous code) */}</div>
      <div className="text-black text-xl font-semibold pb-4 pl-2 pt-8">
        playlist
      </div>
      <div className="space-y-3 overflow-auto">
        {songDataHome.map((item) => (
          <SingleSongCard key={item.id} info={item} playSound={() => {}} />
        ))}
      </div>
    </LoggedInContainer>
  );
};

export default HomeCard;
