import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { createPost, getPosts } from "@/controllers/posts";
import { SubmitPostData } from "@/types/post";
import { authorizeBucket, uploadImage } from "@/database/b2";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json("", { status: 403 });

  const data = await req.formData();

  const title = data.get("title")?.toString();
  const content = data.get("content")?.toString();
  const redditId = data.get("redditId")?.toString();
  const image = data.get("image");

  if (!title || !redditId || isNaN(+redditId))
    return NextResponse.json({ message: "Invalid post" }, { status: 400 });

  if (!!image && !!content)
    return NextResponse.json(
      { message: "You can't post image with text" },
      { status: 400 },
    );

  let imageId;
  if (image instanceof File && image.size > 0) {
    const res = await authorizeBucket();
    if (!res)
      return NextResponse.json(
        { message: "A server error ocurred" },
        { status: 500 },
      );
    const { authorizationToken, uploadUrl } = res;

    if (image instanceof File && image.size > 0) {
      const result = await uploadImage(
        image,
        `post/${session.user.name?.replace(" ", "_").toLowerCase() ?? ""}`,
        image.name.split(".")[0].replace(" ", "_").toLowerCase(),
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

  const post: SubmitPostData = {
    title,
    redditId: parseInt(redditId),
    content,
    imageId,
  };

  try {
    const res = await createPost(post, session.user.id);
    if (!res)
      return NextResponse.json(
        { message: "Couldn't create post" },
        { status: 400 },
      );
    return NextResponse.json({ message: "Posted succesfuly" }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "A server error ocurred, try again later" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const posts = await getPosts();
    return NextResponse.json({ posts }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "A server error ocurred" },
      { status: 500 },
    );
  }
}
