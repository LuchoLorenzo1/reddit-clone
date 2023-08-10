import { Result } from "@/types/result";
import B2 from "backblaze-b2";
import { fileTypeFromBuffer } from "file-type";

const b2 = new B2({
  applicationKeyId: process.env.BACKBLAZE_APPKEY_ID!,
  applicationKey: process.env.BACKBLAZE_APPKEY!,
});

const allowedMimeTypes = ["image/png", "image/jpeg"];

export const uploadImage = async (
  file: File,
  folder: string,
  fileName: string,
  uploadUrl: string,
  uploadAuthToken: string,
): Promise<Result<string>> => {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const fileType = await fileTypeFromBuffer(buffer);
  if (!fileType || !allowedMimeTypes.includes(fileType.mime))
    return { ok: false, msg: "Invalid message type", status: 400 };

  try {
    const res = await b2.uploadFile({
      uploadUrl,
      uploadAuthToken,
      fileName: `${folder}/${fileName}.${fileType.ext}`,
      data: buffer,
    });
    if (res.status == "200") return { ok: true, res: res.data.fileId };
    return { ok: false, msg: "Server error occurred" };
  } catch (err) {
    console.log("B2 ERROR: ", err);
    return { ok: false, msg: "Server error occurred" };
  }
};

export const authorizeBucket = async (): Promise<
  { authorizationToken: string; uploadUrl: string } | undefined
> => {
  try {
    await b2.authorize();
    const res = await b2.getUploadUrl({
      bucketId: process.env.BACKBLAZE_BUCKET_ID!,
    });
    if (res.status == "200") {
      const { authorizationToken, uploadUrl } = res.data;
      return { authorizationToken, uploadUrl };
    }
    return;
  } catch (err) {
    console.log("B2 ERROR: ", err);
    return;
  }
};
