import useMetaArgs from "@/hooks/useMeta";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useFetcher } from "react-router";
import { toast } from "sonner";
import { validateResendPasswordTokenSchema } from "@/utils/dataSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import FormField from "@/components/formField";
import { RiLockFill } from "@remixicon/react";
import ErrorAlert from "@/components/errorAlert";

export function Component() {
  useMetaArgs({
    title: "Forgot Password - Clinicare",
    description: "Forgot Password to your Clinicare account.",
    keywords: "Clinicare, forgot password, account",
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validateResendPasswordTokenSchema),
  });
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";
  const error = fetcher.data?.status === "fail" ? fetcher.data.message : null;

  useEffect(() => {
    if (fetcher.data?.success) {
      toast.success(fetcher.data.message);
    }
  }, [fetcher.data]);

  const onSubmit = (data) => {
    fetcher.submit(data, {
      method: "post",
      action: "/account/forgot-password",
    });
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow w-full max-w-[400px]">
      <fetcher.Form
        className="flex flex-col items-center gap-2 w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <RiLockFill
          size={40}
          className="text-blue-500 p-2 border-[0.2px] border-blue-500 rounded-full shadow-lg"
        />
        <h1 className="text-2xl font-bold">Forgot Password</h1>
        <p className="text-muted-foreground text-center">
          Enter your email address and we'll send you a code to reset your
          password.
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
        </div>
        <button
          type="submit"
          className="btn bg-blue-500 hover:bg-blue-600 text-white w-full md:w-[350px]"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send Reset Token"}
        </button>
      </fetcher.Form>
    </div>
  );
}

Component.displayName = "ForgotPassword";
