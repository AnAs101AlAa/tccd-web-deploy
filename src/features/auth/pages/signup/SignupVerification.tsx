import { useParams } from "react-router-dom";
import { useVerifyStudent } from "@/shared/queries/auth";
import { useEffect, useState } from "react";
import { ErrorScreen, SuccessScreen } from "tccd-ui";
import { Loader2 } from "lucide-react";

export default function SignupVerification() {
    const { token } = useParams();
    const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
    const verifyStudentMutation = useVerifyStudent();

    useEffect(() => {
        if (token) {
            verifyStudentMutation.mutate(token, {
                onSuccess: () => setStatus("success"),
                onError: () => setStatus("error"),
            });

        }
    }, [token]);

    if (status === "verifying") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="max-w-md w-full mx-4">
                    <div className="bg-background rounded-2xl shadow-xl p-8 flex flex-col items-center space-y-6">
                        <div className="relative">
                            <div className="w-20 h-20 bg-linear-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-lg animate-pulse">
                                <Loader2 className="w-12 h-12 text-text animate-spin" />
                            </div>
                            <div className="absolute inset-0 w-20 h-20 bg-primary rounded-full animate-ping opacity-20"></div>
                        </div>
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-bold text-contrast">
                                Verifying Your Account
                            </h2>
                            <p className="text-label">
                                Please wait while we confirm your registration...
                            </p>
                        </div>
                        <div className="flex space-x-2">
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-muted-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    } else if (status === "success") {
        return <SuccessScreen title="Account Verified" message="Your account has been successfully verified! You can now log in." />;
    } else {
        return <ErrorScreen title="Verification Error" message="There was an error verifying your account. Please try again or contact support." />;
    }
}
