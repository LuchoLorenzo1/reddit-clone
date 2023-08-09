import B2 from "backblaze-b2";

const b2 = new B2({
  applicationKeyId: process.env.BACKBLAZE_APPKEY_ID!,
  applicationKey: process.env.BACKBLAZE_APPKEY!,
});

export default b2;
