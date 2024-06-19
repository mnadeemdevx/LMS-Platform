import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib/db";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string } },
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { courseId } = params;

        const courseOwner = await db.course.findUnique({
            where: { id: courseId, userId },
        });

        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const course = await db.course.findUnique({
            where: { id: courseId, userId },
            include: {
                chapters: {
                    include: {
                        muxData: true,
                    },
                },
            },
        });

        if (!course) {
            return new NextResponse("Not found", { status: 404 });
        }

        const unPublishedCourse = await db.course.update({
            where: { id: courseId, userId },
            data: { isPublished: false },
        });

        return NextResponse.json(unPublishedCourse);
    } catch (err) {
        console.log("[CHAPTER_ID_PUBLISH]", err);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
