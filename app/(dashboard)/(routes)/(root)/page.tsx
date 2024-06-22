import { redirect } from "next/navigation";

import { auth } from "@clerk/nextjs/server";
import { CheckCircle, Clock } from "lucide-react";

import CoursesList from "@/components/courses-list";
import InfoCard from "./_components/info-card";

import { getDashboardCourses } from "@/actions/get-dashboard-courses";

const Dashboard = async () => {
    const { userId } = auth();

    if (!userId) {
        return redirect("/");
    }

    const { completedCourses, courseInProgress } = await getDashboardCourses(
        userId,
    );

    return (
        <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoCard
                    icon={Clock}
                    label={"In Progress"}
                    numberOfItems={courseInProgress.length}
                    variant="default"
                />
                <InfoCard
                    icon={CheckCircle}
                    label={"Completed"}
                    numberOfItems={completedCourses.length}
                    variant="success"
                />
            </div>
            <CoursesList items={[...courseInProgress, ...completedCourses]} />
        </div>
    );
};

export default Dashboard;
