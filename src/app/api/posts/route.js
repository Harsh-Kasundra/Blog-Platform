import { getAuthSession } from "@/utils/auth";
import prisma from "@/utils/connect";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get("page"), 10) || 1; // Default to page 1
  const cat = searchParams.get("cat");

  const POST_PER_PAGE = 2;

  const query = {
    take: POST_PER_PAGE,
    skip: POST_PER_PAGE * (page - 1),
    where: {
      ...(cat && { catSlug: cat }),
    },
  };
  try {
    const [posts, count] = await prisma.$transaction([
      prisma.post.findMany(query),
      prisma.post.count({ where: query.where }),
    ]);
    return new NextResponse(JSON.stringify({ posts, count }, { status: 200 }));
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }, { status: 500 })
    );
  }
};

// CREATE A Post
export const POST = async (req) => {
  const session = await getAuthSession();

  if (!session) {
    return NextResponse.json(
      { message: "Not Authenticated!" },
      { status: 401 }
    );
  }

  try {
    const body = await req.formData();

    const file = body.get("file");
    const title = body.get("title");
    const desc = body.get("desc");
    const slug = body.get("slug");
    const catSlug = body.get("catSlug");

    if (!file || !title || !desc || !slug) {
      return NextResponse.json({ success: false, message: "Missing fields" });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save the buffer to local storage or cloud (example code)
    const filePath = `/uploads/${slug}-${file.name}`;
    require("fs").writeFileSync(`./public${filePath}`, buffer);

    // Save post to database
    const post = await prisma.post.create({
      data: {
        title,
        desc,
        slug,
        catSlug,
        userEmail: session.user.email,
        img: filePath, // Save the path or cloud URL
      },
    });

    return NextResponse.json(post, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
};
