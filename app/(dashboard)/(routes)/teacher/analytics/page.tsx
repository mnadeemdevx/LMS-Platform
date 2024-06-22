import { redirect } from "next/navigation";

import { auth } from "@clerk/nextjs/server";

import { DataCard } from "./_components/data-card";
import { Chart } from "./_components/chart";

import { getAnalytics } from "@/actions/get-analytics";

interface AnalyticsProps {
    data: {
        name: string;
        total: number;
    }[];
    totalRevenue: number;
    totalSales: number;
}

const AnalyticsPage = async () => {
    const { userId } = auth();

    if (!userId) {
        return redirect("/");
    }

    const { data, totalRevenue, totalSales }: AnalyticsProps =
        await getAnalytics(userId);

    return (
        <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <DataCard
                    label={"Total Revenue"}
                    value={totalRevenue}
                    shouldFormat
                />
                <DataCard label={"Total Sales"} value={totalSales} />
            </div>
            <Chart data={data} />
        </div>
    );
};

export default AnalyticsPage;
