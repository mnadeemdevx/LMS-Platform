import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function DELETE(
    req: Request,
    { params }: { params: { courseId: string; attachmentId: string } },
) {
    try {
        const { userId } = auth();
        const { courseId, attachmentId } = params;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const courseOwner = await db.course.findUnique({
            where: { id: courseId, userId },
        });

        if (!courseOwner) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const attachment = await db.attachment.delete({
            where: { id: attachmentId, courseId },
        });

        return NextResponse.json(attachment);
    } catch (err) {
        console.log("ATTACHMENT_ID", err);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
