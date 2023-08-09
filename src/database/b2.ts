import B2 from "backblaze-b2";

const b2 = new B2({
  applicationKeyId: process.env.BACKBLAZE_APPKEY_ID!,
  applicationKey: process.env.BACKBLAZE_APPKEY!,
});

export const uploadImage = async (
  file: File,
  folder: string,
  fileName: string,
  uploadUrl: string,
  uploadAuthToken: string,
): Promise<string | undefined> => {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const extension = file.name.split(".").pop() ?? "jpg";

  try {
    const res = await b2.uploadFile({
      uploadUrl,
      uploadAuthToken,
      fileName: `${folder}/${fileName}.${extension}`,
      data: buffer,
    });
    if (res.status == "200") return res.data.fileId;
    return;
  } catch (err) {
    console.log("B2 ERROR: ", err);
    return;
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
