
import { useState } from "react";

import "../index.css";
import TextInput from "../components/shared/TextInput";
import CloudinaryUpload from "../components/shared/CloudinaryUpload";
import { useNavigate } from "react-router-dom";
import { makeAuthenticatedPOSTRequest } from "../utils/serverHelper";
import LoggedInContainer from "../containers/LoggedInContainer";

const UploadSong = () => {
  const [name, setName] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [playlistURL, setPlaylistURL] = useState("");
  const [uploadedSongFileName, setUploadedSongFileName] = useState();
  const navigate = useNavigate();

  const submitSong = async () => {
    const data = { name, thumbnail, track: playlistURL };
    const response = await makeAuthenticatedPOSTRequest("/song/create", data);
    if (response.err) {
      alert("Could not create song");
      return;
    }
    alert("Success");
    navigate("/MyMusic");
  };
  return (
    <>
      <LoggedInContainer>
        <div className="p-8 rounded  ">
          <div className="bg-img5  rounded-lg flex flex-col justify-center items-center ">
            <div className="flex flex-col justify-center items-center">
              <h1 className="font-black text-white text-border-black text-7xl flex flex-col justify-center items-center">
                Upload Song
              </h1>
            </div>
          </div>
        </div>
        <div className="text-black  mt-8 px-0">
          <div className="text-2xl px-20 font-bold"></div>
          {uploadedSongFileName ? (
            <div className="border-dashed border-2 shadow-lg m-10 ">
              <div className="h-24 mt-20 flex items-center justify-center ">
                <button className="text-black  m-20 bg-coral font-bold w-1/6 p-3 rounded-full shadow-lg">
                  {uploadedSongFileName.substring(0, 20)}.mp3
                </button>
              </div>
              <h6 className="flex items-center justify-center mb-20 font-semibold ">
                File succesfully uploaded!
              </h6>
            </div>
          ) : (
            <CloudinaryUpload
              setUrl={setPlaylistURL}
              setNameOfSong={setUploadedSongFileName}
            />
          )}
        </div>
        <div className="flex items-center justify-center ">
          <div className="w-3/5 flex space-x-3 py-7 ">
            <TextInput
              type={"text"}
              label="Name"
              labelClassname={"text-black"}
              placeholder={"name"}
              className={"w-3/5"}
              value={name}
              setValue={setName}
            />
            <TextInput
              type={"text"}
              label="Thumbnail"
              labelClassname={"text-black"}
              placeholder={"thumbnail"}
              className={"w-3/5 "}
              value={thumbnail}
              setValue={setThumbnail}
            />
          </div>
        </div>
        <div className="px-5  flex items-center justify-center">
          <button className="btn " onClick={submitSong}>
            Submit Song
          </button>
        </div>
      </LoggedInContainer>
    </>
  );
};

export default UploadSong;
