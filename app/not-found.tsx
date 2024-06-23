import { ArrowLeftCircleIcon } from "lucide-react";
import Link from "next/link";

const NotFound = () => {
    return (
        <main className="not-found">
            <h1 className="text-sky-400">Not Found</h1>
            <p className="text-slate-700">
                Unfortunately, we could not find the requested page or resource.
            </p>
            <Link href={"/"} className="flex items-center gap-x-2">
                <ArrowLeftCircleIcon size={40} className="text-sky-400" />
                Get back
            </Link>
        </main>
    );
};
export default NotFound;
