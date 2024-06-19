import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(
    req: Request,
    { params }: { params: { courseId: string } },
) {
    try {
        const { userId } = auth();
        const { courseId } = params;
        const { title } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const courseOwner = await db.course.findUnique({
            where: { id: courseId, userId },
        });

        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const lastChapter = await db.chapter.findFirst({
            where: { courseId: courseId },
            orderBy: { position: "desc" },
        });

        const newPosition = lastChapter ? lastChapter.position + 1 : 1;

        const chapter = await db.chapter.create({
            data: {
                courseId: courseId,
                title: title,
                position: newPosition,
            },
        });

        return NextResponse.json(chapter);
    } catch (err) {
        console.log("[CHAPTERS]", err);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
