import { Button } from '@/components/ui/button';

export default function Home() {
    return (
        <>
            <div className="flex flex-col items-center gap-5">
                <p className="text-3xl font-medium text-sky-700 text-center">
                    LMS Platform
                </p>
                <Button>Click me!</Button>
            </div>
        </>
    );
}
