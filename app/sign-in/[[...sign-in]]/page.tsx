import { SignIn } from "@clerk/nextjs";

export default function Page() {
    return (
        <div className="flex justify-center items-center text-center min-h-screen">
            <SignIn forceRedirectUrl="/dashboard" />
        </div>
    );
}
