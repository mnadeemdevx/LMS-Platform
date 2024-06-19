import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib/db";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string; chapterId: string } },
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { courseId, chapterId } = params;

        const courseOwner = await db.course.findUnique({
            where: { id: courseId, userId },
        });

        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const chapter = await db.chapter.findUnique({
            where: { id: chapterId, courseId },
        });

        const muxData = await db.muxData.findUnique({
            where: { chapterId },
        });

        if (
            !chapter ||
            !muxData ||
            !chapter.title ||
            !chapter.description ||
            !chapter.videoUrl
        ) {
            return new NextResponse("Missing required fields", { status: 400 });
        }

        const publishChapter = await db.chapter.update({
            where: {
                id: chapterId,
                courseId,
            },
            data: {
                isPublished: true,
            },
        });

        return NextResponse.json(publishChapter);
    } catch (err) {
        console.log("[CHAPTER_ID_PUBLISH]", err);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
