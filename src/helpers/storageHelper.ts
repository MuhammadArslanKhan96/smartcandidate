import { storage } from "@/utils/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export async function uploadAndGetURL(blob: Blob | File, id: string) {
  const fileRef = ref(storage, id + ".mp3");

  // 'file' comes from the Blob or File API
  await uploadBytes(fileRef, blob, {
    contentType: "audio/mpeg"
  });

  const url = await getDownloadURL(fileRef);


  return url;


}