import { useState } from "react";
import LoggedInContainer from "../containers/LoggedInContainer";

import { makeAuthenticatedGETRequest } from "../utils/serverHelper";
import SingleSongCard from "../components/shared/SingleSongCard";

import { Icon } from "@iconify/react";
const SearchPage = () => {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [songData, setSongData] = useState([]);

  const searchSong = async () => {
    // This function will call the search api
    const response = await makeAuthenticatedGETRequest(
      `/song/get/songname/${searchText}?caseSensitive=false`
    );
    setSongData(response.data);
  };

  return (
    <LoggedInContainer curActiveScreen="search">
      <div className="p-8 rounded  ">
        <div className="bg-img rounded-lg flex flex-col justify-center items-center ">
          <div className="justify-center items-center">
            <h1 className="font-black text-white text-border-black text-7xl flex flex-col justify-center items-center">
              what do you
            </h1>
            <h1 className="font-bold p-4	text-white text-7xl justify-center items-center">
              want to listen to?
            </h1>
          </div>
          <div
            className={` w-3/5 p-3 mt-4 flex  text-sm rounded-full bg-gray-800 border border-white flex text-white items-center justify-center ${
              isInputFocused ? "border border-black" : ""
            }`}
          >
            <Icon icon="ic:outline-search" className="text-lg" />
            <input
              type="text"
              placeholder="  search for songs "
              className="w-full bg-gray-800 focus:outline-none"
              onFocus={() => {
                setIsInputFocused(true);
              }}
              onBlur={() => {
                setIsInputFocused(false);
              }}
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  searchSong();
                }
              }}
            />
          </div>
        </div>
        {songData.length > 0 ? (
          <div className="pt-10 space-y-3">
            <div className="text-black">
              Showing search results for
              <span className="font-bold"> {searchText}</span>
            </div>
            {songData.map((item) => {
              return (
                <SingleSongCard
                  info={item}
                  key={JSON.stringify(item)}
                  playSound={() => {}}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-gray-400 flex flex-col items-center justify-center pt-4">
            <Icon icon="arcticons:vinyl" fontSize={60} className="p-2" />
            Nothing to show here :(
          </div>
        )}
      </div>
    </LoggedInContainer>
  );
};

export default SearchPage;
