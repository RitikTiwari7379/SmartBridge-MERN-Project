import { openUploadWidget } from "../../utils/CloudinaryService";
import { cloudinary_upload_preset } from "../../config";

const CloudinaryUpload = ({ setUrl, setNameOfSong }) => {
  const uploadImageWidget = () => {
    let myUploadWidget = openUploadWidget(
      {
        cloudName: "dkovhh2xz",
        uploadPreset: cloudinary_upload_preset,
        sources: ["local"],
      },
      function (error, result) {
        if (!error && result.event === "success") {
          setUrl(result.info.secure_url);
          setNameOfSong(result.info.original_filename);
        } else {
          if (error) {
            console.log(error);
          }
        }
      }
    );
    myUploadWidget.open();
  };

  return (
    <div>
      <div className="border-dashed border-2 border-black shadow-lg m-10">
        <div className="h-24 mt-20 flex items-center justify-center ">
          <button
            className="hover:text-white m-20 hover:bg-black font-bold w-1/6 p-3 rounded-full shadow-lg bg-coral text-black"
            onClick={uploadImageWidget}
          >
            Select Track
          </button>
        </div>
        <h6 className="flex items-center justify-center mb-20 font-semibold ">
          Upload any track from your system.
        </h6>
      </div>
    </div>
  );
};

export default CloudinaryUpload;
