import useMetaArgs from "@/shared/hooks/useMeta";
import { RiMailFill } from "@remixicon/react";
import { useEffect, useState } from "react";
import { useFetcher, Link, useRouteLoaderData } from "react-router";
import PinField from "react-pin-field";
import { usePrivateRoutes } from "@/shared/hooks/useProtected";
import ErrorAlert from "@/shared/components/errorAlert";

export function Component() {
  usePrivateRoutes();
  useMetaArgs({
    title: "Verify Account - Clinicare",
    description: "Verify your Clinicare account.",
    keywords: "Clinicare, verify account, account",
  });
  const user = useRouteLoaderData("auth_user");
  const [verificationToken, setVerificationToken] = useState("");
  const [timer, setTimer] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";
  const error = fetcher.data?.status === "fail" ? fetcher.data.message : null;

  useEffect(() => {
    if (
      (fetcher.data?.success &&
        fetcher.data?.message === "Account verified successfully") ||
      user?.isVerified
    ) {
      setShowSuccess(true);
    }
  }, [fetcher.data, user]);

  // Timer effect
  useEffect(() => {
    let interval;

    if (timer > 0) {
      setIsResendDisabled(true);
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setIsResendDisabled(false);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  const handleResendCode = (e) => {
    e.preventDefault();
    if (isResendDisabled) return;
    // Start the timer
    setTimer(150);
    // Submit the resend request
    fetcher.submit(
      {},
      {
        method: "post",
        action: "/verify-account",
      }
    );
  };

  const onSubmit = (e) => {
    e.preventDefault();
    fetcher.submit(
      { verificationToken },
      {
        method: "patch",
        action: "/verify-account",
      }
    );
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-[calc(100vh-6rem)] gap-2">
        {showSuccess ? (
          <div className="p-4 max-w-[800px] mx-auto text-center">
            <img src="/Success.svg" alt="success" className="w-full h-full" />
            <h1 className="text-2xl font-bold">Congratulations!</h1>
            <p className="text-gray-600">
              {user?.isVerified
                ? "Your account has already been verified."
                : "Your account has been verified successfully."}
            </p>
            <Link
              to="/"
              className="my-4 btn bg-blue-600 hover:bg-blue-700 text-white"
            >
              Go back to home
            </Link>
          </div>
        ) : (
          <div className="bg-white p-4 rounded-xl shadow w-full max-w-[400px]">
            {error && <ErrorAlert error={error} />}
            <fetcher.Form
              className="flex flex-col items-center gap-2 w-full"
              onSubmit={onSubmit}
            >
              <RiMailFill
                size={40}
                className="text-blue-500 p-2 border-[0.2px] border-blue-500 rounded-full shadow-lg"
              />
              <h1 className="text-2xl font-bold">OTP Verification</h1>
              <p className="text-gray-600 text-center">
                We have sent a verification code to your email. Please enter it
                below.
              </p>
              <div className="my-4 w-full md:w-[350px] text-center">
                <PinField
                  length={6}
                  className="w-[50px] sm:w-[58px] text-center border border-gray-300 rounded-md p-2 font-bold"
                  autoComplete="one-time-code"
                  autoCorrect="off"
                  dir="ltr"
                  pattern="[0-9]+"
                  type="text"
                  value={verificationToken}
                  onChange={(value) => {
                    setVerificationToken(value);
                  }}
                />
              </div>
              <button
                type="submit"
                className="btn bg-blue-500 hover:bg-blue-600 text-white w-full md:w-[350px]"
                disabled={isSubmitting || verificationToken.length !== 6}
              >
                {isSubmitting ? "Verifying..." : "Verify"}
              </button>
            </fetcher.Form>
            <fetcher.Form
              onSubmit={handleResendCode}
              className="mt-4 flex flex-col items-center gap-2 w-full"
            >
              <p className="text-[var(--paint-gray)] text-sm">Code expired?</p>
              <button
                className={`btn bg-blue-500 hover:bg-blue-600 ${
                  isResendDisabled
                    ? "text-black cursor-not-allowed"
                    : "text-white"
                }`}
                type="submit"
                disabled={isResendDisabled}
              >
                {isResendDisabled ? `Resend in ${timer}s` : "Resend Code"}
              </button>
            </fetcher.Form>
          </div>
        )}
      </div>
    </>
  );
}
Component.displayName = "VerifyAccount";
