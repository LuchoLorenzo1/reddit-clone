import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { updateReddit, getRedditById } from "@/controllers/reddits";
import { authorizeBucket, uploadImage } from "@/database/b2";

export const PUT = async (
  req: NextRequest,
  { params }: { params: { redditId: number } },
) => {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json("", { status: 403 });

  if (isNaN(params.redditId))
    return NextResponse.json({ error: "ID is invalid" }, { status: 400 });

  const reddit = await getRedditById(params.redditId);
  if (!reddit)
    return NextResponse.json({ error: "Reddit not found" }, { status: 404 });

  const data = await req.formData();

  const name = data.get("name")?.toString();
  const description = data.get("description")?.toString();
  const banner = data.get("banner");
  const image = data.get("image");

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

    if (banner instanceof File && banner.size > 0) {
      const result = await uploadImage(
        banner,
        "banner",
        reddit.name,
        uploadUrl,
        authorizationToken,
      );
      if (!result.ok) {
        return NextResponse.json(
          { message: "A server error ocurred" },
          { status: 500 },
        );
      } else {
        bannerId = result.res;
      }
    }

    if (image instanceof File && image.size > 0) {
      const result = await uploadImage(
        image,
        "icon",
        reddit.name,
        uploadUrl,
        authorizationToken,
      );
      if (!result.ok) {
        return NextResponse.json(
          { message: "A server error ocurred" },
          { status: result.status ?? 500 },
        );
      } else {
        imageId = result.res;
      }
    }
  }

  try {
    await updateReddit(
      { name, description, bannerId, imageId },
      params.redditId,
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
