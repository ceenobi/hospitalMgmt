import useMetaArgs from "@/shared/hooks/useMeta";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useFetcher, useSearchParams, useNavigate } from "react-router";
import { toast } from "sonner";
import { validateResetPasswordSchema } from "@/shared/utils/dataSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import FormField from "@/shared/components/formField";
import { RiLockFill } from "@remixicon/react";
import ErrorAlert from "@/shared/components/errorAlert";

export function Component() {
  useMetaArgs({
    title: "Reset Password - Clinicare",
    description: "Reset Password to your Clinicare account.",
    keywords: "Clinicare, reset password, account",
  });
  const [isVisiblePassword, setIsVisiblePassword] = useState(false);
  const [isVisibleConfirmPassword, setIsVisibleConfirmPassword] =
    useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validateResetPasswordSchema),
  });
  const [searchParams] = useSearchParams();
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const isSubmitting = fetcher.state === "submitting";
  const email = searchParams.get("email");
  const token = searchParams.get("token");
  const error = fetcher.data?.status === "fail" ? fetcher.data.message : null;

  useEffect(() => {
    if (fetcher.data?.success) {
      toast.success(fetcher.data.message);
      navigate("/account/signin");
    }
  }, [fetcher.data, navigate]);

  const onSubmit = (data) => {
    fetcher.submit(
      {
        ...data,
        email,
        token,
      },
      {
        method: "patch",
        action: "/account/reset-password",
      }
    );
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-lg w-full max-w-[400px]">
      <fetcher.Form
        className="flex flex-col items-center gap-2 w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <RiLockFill
          size={40}
          className="text-blue-500 p-2 border-[0.2px] border-blue-500 rounded-full shadow-lg"
        />
        <h1 className="text-2xl font-bold">Create New Password</h1>
        <p className="text-gray-600 text-center">
          Please enter a new password. Your new password must be different from
          your previous password.
        </p>
        <div className="w-full md:w-[350px]">
          {error && <ErrorAlert error={error} />}
          <FormField
            label="Password"
            type="password"
            placeholder="Password"
            id="password"
            register={register}
            errors={errors}
            name="password"
            isVisible={isVisiblePassword}
            setIsVisible={setIsVisiblePassword}
          />
          <FormField
            label="Confirm Password"
            type="password"
            placeholder="Confirm Password"
            id="passwordConfirm"
            register={register}
            errors={errors}
            name="passwordConfirm"
            isVisible={isVisibleConfirmPassword}
            setIsVisible={setIsVisibleConfirmPassword}
          />
        </div>
        <button
          type="submit"
          className="btn bg-blue-500 hover:bg-blue-600 text-white w-full md:w-[350px]"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </button>
      </fetcher.Form>
    </div>
  );
}

Component.displayName = "ResetPassword";
