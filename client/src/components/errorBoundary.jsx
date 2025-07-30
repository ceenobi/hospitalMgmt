import { useAuthToken } from "@/context";
import { refreshTokenAction } from "@/features/auth/services/actions";
import { useEffect, useMemo } from "react";
import {
  isRouteErrorResponse,
  useRouteError,
  useNavigate,
  useSubmit,
} from "react-router";

export default function ErrorBoundary() {
  const { accessToken, setAccessToken, setIsAuthenticating } = useAuthToken();
  const submit = useSubmit();
  const error = useRouteError();
  const navigate = useNavigate();
  if (import.meta.env.DEV) {
    console.error(error);
  }
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details =
      error?.response?.data?.message ||
      error?.response?.data?.error?.name ||
      error.message;
    stack = error.stack;
    console.log(stack);
  }
  const msgs = useMemo(
    () => ["You are not logged in!", "jwt expired", "jwt malformed"],
    []
  );

  const redirect = () => {
    details === "Invalid refresh token"
      ? submit({}, { action: "/logout", method: "post" })
      : navigate("/dashboard");
  };

  useEffect(() => {
    if (msgs.includes(details)) {
      setIsAuthenticating(true);
      async function refresh() {
        const res = await refreshTokenAction({ accessToken, setAccessToken });
        if (res?.success) {
          setIsAuthenticating(false);
        } else {
          submit({}, { action: "/logout", method: "post" });
        }
      }
      refresh();
    }
  }, [accessToken, details, msgs, setAccessToken, setIsAuthenticating, submit]);

  return (
    <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen gap-2">
      {error.status === 404 ? (
        <img src="/404.svg" alt="404" className="w-[30%]" />
      ) : (
        <img src="/Error-page.svg" alt="Error" className="w-[30%]" />
      )}
      <h1 className="text-2xl font-bold">Something went wrong</h1>
      <p className="text-red-600 font-bold text-xl">{message}</p>
      <p className="text-gray-600">
        {details === "jwt expired" || details === "jwt malformed"
          ? "Checking session..."
          : details}
      </p>
      {!msgs.includes(details) && (
        <button
          onClick={redirect}
          type="button"
          className="my-4 btn bg-blue-500 hover:bg-blue-700 text-white"
        >
          Go back
        </button>
      )}
    </div>
  );
}
