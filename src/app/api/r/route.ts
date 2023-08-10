import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { getRedditsFromUser, createReddit } from "@/controllers/reddits";
import { authorizeBucket, uploadImage } from "@/database/b2";

export const GET = async () => {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json("", { status: 404 });

  try {
    const reddits = await getRedditsFromUser(session.user.id);
    return NextResponse.json({ reddits }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "A server error ocurred" },
      { status: 500 },
    );
  }
};

export const POST = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json("", { status: 403 });

  const data = await req.formData();

  const name = data.get("name")?.toString();
  const description = data.get("description")?.toString();
  const banner = data.get("banner");
  const image = data.get("image");

  if (name === undefined || description === undefined)
    return NextResponse.json({}, { status: 400 });

  let bannerId: string | undefined;
  let imageId: string | undefined;

  if (banner || image) {
    const res = await authorizeBucket();
    if (!res)
      return NextResponse.json(
        { message: "A server error ocurred" },
        { status: 500 },
      );
    const { authorizationToken, uploadUrl } = res;

    if (banner && banner instanceof File) {
      const result = await uploadImage(
        banner,
        "banner",
        name,
        uploadUrl,
        authorizationToken,
      );
      if (!result.ok) {
        return NextResponse.json(
          { message: result.msg },
          { status: result.status ?? 500 },
        );
      } else {
        bannerId = result.res;
      }
    }

    if (image && image instanceof File) {
      const result = await uploadImage(
        image,
        "icon",
        name,
        uploadUrl,
        authorizationToken,
      );
      if (!result.ok) {
        return NextResponse.json(
          { message: result.msg },
          { status: result.status ?? 500 },
        );
      } else {
        imageId = result.res;
      }
    }
  }

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
