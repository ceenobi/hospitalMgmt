import FormField from "@/shared/components/formField";
import { validateSignInSchema } from "@/shared/utils/dataSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { RiUser4Fill } from "@remixicon/react";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { Link, useFetcher, useSearchParams } from "react-router";
import useMetaArgs from "@/shared/hooks/useMeta";
import { toast } from "sonner";
import ErrorAlert from "@/shared/components/errorAlert";

export function Component() {
  useMetaArgs({
    title: "Login - Clinicare",
    description:
      "Login to your Clinicare account to start managing your health easily.",
    keywords: "Clinicare, login, account",
  });
  const [isVisible, setIsVisible] = useState(false);
  const [searchParams] = useSearchParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validateSignInSchema),
  });
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";
  const error = fetcher.data?.status === "fail" ? fetcher.data.message : null;
  const role = searchParams.get("role");

  useEffect(() => {
    if (fetcher.data?.success) {
      toast.success(fetcher.data.message);
    }
  }, [fetcher.data]);

  const onSubmit = (data) => {
    fetcher.submit(data, {
      method: "post",
      action: `/account/signin?role=${role}`,
    });
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg w-full max-w-[400px]">
      <fetcher.Form
        className="flex flex-col items-center gap-2 w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <RiUser4Fill
          size={40}
          className="text-blue-500 p-2 border-[0.2px] border-blue-500 rounded-full shadow-lg"
        />
        <h1 className="text-2xl font-bold">Welcome Back</h1>
        <p className="text-gray-600">
          Glad to see you again. Log in to your account.
        </p>
        <div className="w-full md:w-[350px]">
          {error && <ErrorAlert error={error} />}
          <FormField
            label="Email"
            type="email"
            placeholder="Email"
            id="email"
            register={register}
            errors={errors}
            name="email"
          />
          <div>
            <FormField
              label="Password"
              type="password"
              placeholder="Password"
              id="password"
              register={register}
              errors={errors}
              name="password"
              isVisible={isVisible}
              setIsVisible={setIsVisible}
            />
            <Link
              to="/account/forgot-password"
              className="text-blue-500 font-bold text-sm"
            >
              Forgot Password?
            </Link>
          </div>
        </div>
        <button
          type="submit"
          className="my-4 btn bg-blue-500 hover:bg-blue-600 text-white w-full md:w-[350px]"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing In..." : "Sign In"}
        </button>
        <p className="text-gray-600 text-sm">
          Don't have an account?{" "}
          <Link to="/account/signup" className="text-blue-500 font-bold">
            Sign Up
          </Link>
        </p>
      </fetcher.Form>
    </div>
  );
}

Component.displayName = "SignIn";
