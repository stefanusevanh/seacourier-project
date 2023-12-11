import {
  CLOUDINARY_API_URL,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_UPLOAD_PRESET,
} from "./apiURL";
import { useFetch } from "@/hooks/useFetch";
import { ICloudinaryResponse, IUser } from "@/types/api";

export const useCloudinary = () => {
  const { data, isLoading, error, fetchData } = useFetch<ICloudinaryResponse>();

  const uploadPhotoToCloudinary = (imageFile: File) => {
    const bodyData = new FormData();
    bodyData.append("file", imageFile);
    bodyData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    bodyData.append("cloud_name", CLOUDINARY_CLOUD_NAME);

    const url = `${CLOUDINARY_API_URL}/image/upload`;
    const options = {
      method: "POST",
      body: bodyData,
    };
    fetchData(url, options);
  };
  return {
    uploadedPhotoURL: data,
    uploadPhotoIsLoading: isLoading,
    uploadPhotoError: error,
    uploadPhotoToCloudinary,
  };
};
export default useCloudinary;
