"use client";

import { createSupabaseClient } from "@/api/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Loader2, AlertCircle, MailOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exchangeCodeForSession } from "./actions";

type CallbackStatus = "processing" | "error";

interface CallbackError {
    title: string;
    message: string;
    action?: { label: string; href: string };
}

function AuthCallbackInner() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<CallbackStatus>("processing");
    const [error, setError] = useState<CallbackError | null>(null);
    const processed = useRef(false);

    const next = searchParams.get("next") ?? "/";
    const isVendorFlow = next.includes("/vendor");
    const signinPath = isVendorFlow ? "/auth/vendor/signin" : "/auth/signin";

    const handleError = useCallback(
        (errorCode: string | null, errorDescription: string | null) => {
            if (errorCode === "otp_expired") {
                setError({
                    title: "Invitation Link Expired",
                    message:
                        "This link has expired. Please ask the vendor admin to resend the invitation from the branch management page.",
                    action: { label: "Go to Sign In", href: signinPath },
                });
            } else if (errorCode === "access_denied") {
                setError({
                    title: "Access Denied",
                    message:
                        errorDescription ?? "This link is no longer valid. Please request a new one.",
                    action: { label: "Go to Sign In", href: signinPath },
                });
            } else {
                setError({
                    title: "Something Went Wrong",
                    message:
                        errorDescription ?? "We couldn't process your request. Please try again or contact support.",
                    action: { label: "Go to Sign In", href: signinPath },
                });
            }
            setStatus("error");
        },
        [signinPath]
    );

    const processCallback = useCallback(async () => {
        if (processed.current) return;
        processed.current = true;

        // 1. Check for errors in hash fragment (Supabase puts them there)
        const hash = window.location.hash.substring(1);
        const hashParams = new URLSearchParams(hash);

        const hashError = hashParams.get("error");
        const hashErrorCode = hashParams.get("error_code");
        const hashErrorDescription = hashParams.get("error_description");

        if (hashError) {
            handleError(hashErrorCode, hashErrorDescription?.replace(/\+/g, " ") ?? null);
            return;
        }

        // 2. Check for access_token in hash (implicit/magic-link flow)
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");

        if (accessToken && refreshToken) {
            const supabase = createSupabaseClient();
            const { error } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
            });
            if (error) {
                handleError(null, error.message);
                return;
            }
            router.replace(`/${next}`);
            return;
        }

        // 3. Check for code in query params (PKCE flow)
        const code = searchParams.get("code");
        if (code) {
            const result = await exchangeCodeForSession(code);
            if (result.success) {
                router.replace(`/${next}`);
                return;
            }
            handleError(null, result.error ?? null);
            return;
        }

        // 4. Nothing to process
        handleError(null, null);
    }, [handleError, next, router, searchParams]);

    useEffect(() => {
        processCallback();
    }, [processCallback]);

    if (status === "error" && error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background px-4">
                <div className="w-full max-w-md space-y-6 text-center">
                    <div className="flex justify-center">
                        <div className="rounded-full bg-destructive/10 p-4">
                            {error.title.includes("Expired") ? (
                                <MailOpen className="h-8 w-8 text-destructive" />
                            ) : (
                                <AlertCircle className="h-8 w-8 text-destructive" />
                            )}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold text-foreground">{error.title}</h1>
                        <p className="text-sm text-muted-foreground">{error.message}</p>
                    </div>
                    {error.action && (
                        <Button
                            onClick={() => router.push(error.action!.href)}
                            className="w-full"
                        >
                            {error.action.label}
                        </Button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                    Verifying your credentials...
                </p>
            </div>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center bg-background">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            }
        >
            <AuthCallbackInner />
        </Suspense>
    );
}
