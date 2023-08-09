import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { createReddit } from "@/controllers/reddits";
import b2 from "@/database/b2";

export const POST = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json("", { status: 403 });

  const data = await req.formData();

  const name = data.get("name")?.toString();
  const description = data.get("description")?.toString();

  let bannerId;
  let imageId;

  const banner = data.get("banner");
  const image = data.get("image");

  if (banner || image) {
    let res;
    try {
      await b2.authorize();
      res = await b2.getUploadUrl({
        bucketId: process.env.BACKBLAZE_BUCKET_ID!,
      });
    } catch (err) {
      console.log("Error", err);
      return NextResponse.json(
        { message: "A server error ocurred" },
        { status: 500 },
      );
    }

    const { authorizationToken, uploadUrl } = res.data;
    if (banner && banner instanceof File) {
      const bytes = await banner.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const extension = banner.name.split(".").pop() ?? "jpg";
      try {
        res = await b2.uploadFile({
          uploadUrl,
          uploadAuthToken: authorizationToken,
          fileName: `${name}-banner.${extension}`,
          data: buffer,
        });
        if (res.status == "200") bannerId = res.data.fileId;
      } catch (err) {
        console.log("Error", err);
        return NextResponse.json(
          { message: "A server error ocurred" },
          { status: 500 },
        );
      }
    }

    if (image && image instanceof File) {
      const bytes = await image.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const extension = image.name.split(".").pop() ?? "jpg";
      try {
        res = await b2.uploadFile({
          uploadUrl,
          uploadAuthToken: authorizationToken,
          fileName: `${name}-icon.${extension}`,
          data: buffer,
        });
        if (res.status == "200") imageId = res.data.fileId;
      } catch (err) {
        console.log("Error", err);
        return NextResponse.json(
          { message: "A server error ocurred" },
          { status: 500 },
        );
      }
    }
  }

  if (name === undefined || description === undefined)
    return NextResponse.json({}, { status: 400 });

  try {
    await createReddit(
      { name, description, bannerId, imageId },
      session.user.id,
    );
    return NextResponse.json({}, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "A server error ocurred" },
      { status: 500 },
    );
  }
};
