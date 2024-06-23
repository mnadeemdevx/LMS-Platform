import { redirect } from "next/navigation";

import { auth } from "@clerk/nextjs/server";

import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";

const CoursesPage = async () => {
    const { userId } = auth();

    if (!userId || !isTeacher(userId)) {
        console.log("in here");

        return redirect("/");
    }

    const courses = await db.course.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    return (
        <div className="p-6">
            <DataTable columns={columns} data={courses} />
        </div>
    );
};

export default CoursesPage;
