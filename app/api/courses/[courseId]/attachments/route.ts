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
        const { url } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const courseOwner = await db.course.findUnique({
            where: { id: courseId, userId },
        });

        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const attachment = await db.attachment.create({
            data: {
                url,
                courseId,
                name: url.split("/").pop(),
            },
        });

        return NextResponse.json(attachment);
    } catch (err) {
        console.log("COURSE_ID_ATTACHMENTS", err);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
