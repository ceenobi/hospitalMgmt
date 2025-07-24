import useMetaArgs from "@/hooks/useMeta";
import { useForm } from "react-hook-form";
import { useFetcher, useNavigate, useSubmit } from "react-router";
import { updatePasswordSchema } from "@/utils/dataSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import FormField from "@/components/formField";
import ErrorAlert from "@/components/errorAlert";

export function Component() {
  useMetaArgs({
    title: "Password - Clinicare",
    description: "Password settings for your Clinicare account.",
    keywords: "Clinicare, password, settings",
  });
  const [isVisible, setIsVisible] = useState(false);
  const [isNewVisible, setIsNewVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updatePasswordSchema),
  });
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const submit = useSubmit();

  useEffect(() => {
    if (fetcher.data?.success) {
      toast.success(fetcher.data.message, { id: "success" });
      const timer = setTimeout(() => {
        toast.info(
          "Logging you out...",
          { id: "info" },
          {
            duration: 1000,
          }
        );
        submit({}, { action: "/logout", method: "post" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [fetcher, submit]);

  const isSubmitting = fetcher.state === "submitting";
  const error = fetcher.data?.status === "fail" ? fetcher.data.message : null;

  const onSubmit = (data) => {
    fetcher.submit(data, {
      method: "patch",
      action: "/dashboard/settings/password",
      encType: "multipart/form-data",
    });
  };
  return (
    <div className="space-y-6">
      <h1 className="font-bold text-2xl border-b border-gray-300 pb-2">
        Update Password
      </h1>
      <fetcher.Form
        onSubmit={handleSubmit(onSubmit)}
        id="/dashboard/settings/password"
        className="max-w-[400px] mx-auto"
      >
        {error && <ErrorAlert error={error} />}
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
          classname="w-full"
        />
        <FormField
          label="New Password"
          type="password"
          placeholder="New Password"
          id="newPassword"
          register={register}
          errors={errors}
          name="newPassword"
          isVisible={isNewVisible}
          setIsVisible={setIsNewVisible}
          classname="w-full"
        />
        <FormField
          label="Confirm Password"
          type="password"
          placeholder="Confirm Password"
          id="confirmPassword"
          register={register}
          errors={errors}
          name="confirmPassword"
          isVisible={isConfirmVisible}
          setIsVisible={setIsConfirmVisible}
          classname="w-full"
        />
        <p className="my-2 text-gray-600 text-sm">
          Note: You will be logged out after updating your password.
        </p>
        <div className="my-6 flex md:hidden gap-4 justify-center">
          <button
            type="button"
            className="btn btn-outline w-[140px] border border-gray-300"
            onClick={() => navigate("/dashboard/settings")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white font-bold border border-gray-300 p-2 rounded-md cursor-pointer w-[140px]"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
        </div>
      </fetcher.Form>
    </div>
  );
}

Component.displayName = "Password";
