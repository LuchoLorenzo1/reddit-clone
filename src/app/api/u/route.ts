import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";
import { deleteUser, updateUser } from "@/controllers/users";
import { authorizeBucket, uploadImage } from "@/database/b2";

export const PUT = async (req: NextRequest) => {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return NextResponse.json("", { status: 403 });

  const data = await req.formData();

  const name = data.get("name")?.toString();
  const image = data.get("image");
  let imageId;

  if (image instanceof File && image.size > 0) {
    const res = await authorizeBucket();
    if (!res) {
      return NextResponse.json(
        { message: "A server error ocurred" },
        { status: 500 },
      );
    }

    const result = await uploadImage(
      image,
      "banner",
      name ?? session.user.name!,
      res.uploadUrl,
      res.authorizationToken,
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

  try {
    await updateUser({ name, imageId }, session.user.id);
    return NextResponse.json({}, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "A server error ocurred" },
      { status: 500 },
    );
  }
};

export const DELETE = async () => {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) return NextResponse.json("", { status: 403 });

  try {
    await deleteUser(session.user.id);
    return NextResponse.json({}, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { message: "A server error ocurred" },
      { status: 500 },
    );
  }
};
