import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

import Categories from "./_components/categories";
import SearchInput from "@/components/search-input";
import CoursesList from "@/components/courses-list";

import { getCourses } from "@/actions/get-courses";
import { db } from "@/lib/db";

interface SearchPageProps {
    searchParams: {
        title: string;
        catgoryId: string;
    };
}
const SearchPage = async ({ searchParams }: SearchPageProps) => {
    const { userId } = auth();

    if (!userId) {
        return redirect("/");
    }

    const categories = await db.category.findMany({
        orderBy: {
            name: "asc",
        },
    });

    const courses = await getCourses({ userId, ...searchParams });

    return (
        <>
            <div className="px-6 pt-6 md:hidden md:mb-0 block">
                <SearchInput />
            </div>
            <div className="p-6 space-y-4">
                <Categories items={categories} />
                <CoursesList items={courses} />
            </div>
        </>
    );
};

export default SearchPage;
