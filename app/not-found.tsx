import Link from "next/link";

import { ArrowLeftCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

const NotFound = () => {
    return (
        <main className="not-found">
            <h1 className="text-[#0369a1]">Not Found</h1>
            <p className="text-slate-700">
                Unfortunately, we could not find the requested page or resource.
            </p>
            <Button variant="outline">
                <Link href={"/"} className="flex items-center gap-x-2">
                    <ArrowLeftCircleIcon size={20} className="text-[#0369a1]" />
                    Get back
                </Link>
            </Button>
        </main>
    );
};
export default NotFound;
