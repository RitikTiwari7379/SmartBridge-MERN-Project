import { useContext } from "react";
import songContext from "../../contexts/songContext";

const SingleSongCard = ({ info, playSound, duration }) => {
  const { setCurrentSong } = useContext(songContext);

  return (
    <div
      className="flex bg-gray-300  hover:bg-coral p-2 rounded-sm"
      onClick={() => {
        setCurrentSong(info);
      }}
    >
      <div
        className="w-12 h-12 bg-cover bg-center"
        style={{ backgroundImage: `url("${info.thumbnail}")` }}
      ></div>
      <div className="flex w-full">
        <div className="text-black flex justify-center  flex-col pl-4 w-5/6">
          <div className="cursor-pointer font-semibold hover:underline">
            {info.name}
          </div>
          <div className="text-xs text-black cursor-pointer hover:underline">
            {info.artist.firstName + " " + info.artist.lastName}
          </div>
        </div>
        <div className="w-1/6 flex items-center justify-center text-black text-sm">
          <div>3:44</div>
        </div>
      </div>
    </div>
  );
};

export default SingleSongCard;
