import useMetaArgs from "@/shared/hooks/useMeta";
import { useRouteLoaderData, useFetcher, useNavigate } from "react-router";
import UploadImage from "@/features/settings/components/uploadImage";
import { validateUserSchema } from "@/shared/utils/dataSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormField from "@/shared/components/formField";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { formatDate } from "@/shared/utils/constants";
import DeleteAccount from "@/features/settings/components/deleteAccount";
import ErrorAlert from "@/shared/components/errorAlert";

export function Component() {
  useMetaArgs({
    title: "Account - Clinicare",
    description: "Account settings for your Clinicare account.",
    keywords: "Clinicare, account, settings",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const user = useRouteLoaderData("auth_user");
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validateUserSchema),
  });
  const fetcher = useFetcher();
  const navigate = useNavigate();

  useEffect(() => {
    if (fetcher.data?.success) {
      setShowSuccess(true);
    }
  }, [fetcher.data]);

  useEffect(() => {
    if (user) {
      setValue("fullname", user.fullname);
      setValue("email", user.email);
      setValue("phone", user.phone || "");
      setValue("dateOfBirth", formatDate(user.dateOfBirth || "", "input"));
    }
  }, [user, setValue]);

  const isSubmitting = fetcher.state === "submitting";
  const error = fetcher.data?.status === "fail" ? fetcher.data.message : null;

  useEffect(() => {
    if (fetcher.data?.success) {
      toast.success(fetcher.data.message);
    }
  }, [fetcher.data]);

  const onSubmit = (data) => {
    fetcher.submit(
      {
        ...data,
        title: "account",
      },
      {
        method: "patch",
        action: "/dashboard/settings/account",
        encType: "multipart/form-data",
      }
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="font-bold text-2xl border-b-[0.2px] border-gray-500 pb-2">
        Account
      </h1>
      <>
        <UploadImage user={user} />
        {showSuccess ? (
          <div className="p-4 text-center max-w-[300px] mx-auto">
            <img
              src="/Success.svg"
              alt="success"
              className="w-full h-[250px]"
            />
            <h1 className="text-xl font-bold">Congratulations!</h1>
            <p className="text-gray-600">
              Account information updated successfully.
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="my-4 btn bg-blue-500 hover:bg-blue-600 text-white"
            >
              Go back to Dashboard
            </button>
          </div>
        ) : (
          <fetcher.Form
            onSubmit={handleSubmit(onSubmit)}
            id="/dashboard/settings/account"
            className="border-b-[0.2px] border-gray-500 pb-6 md:pb-2"
          >
            {error && <ErrorAlert error={error} />}
            <div className="my-4 md:grid grid-cols-12 gap-4">
              <div className="col-span-6">
                <FormField
                  label="Full name"
                  type="text"
                  placeholder="Full name"
                  id="fullname"
                  register={register}
                  errors={errors}
                  name="fullname"
                  classname="w-full"
                />
              </div>
              <div className="col-span-6">
                <FormField
                  label="Email"
                  type="email"
                  placeholder="Email"
                  id="email"
                  register={register}
                  errors={errors}
                  name="email"
                  classname="w-full"
                />
              </div>
              <div className="col-span-6">
                <FormField
                  label="Phone"
                  type="tel"
                  placeholder="Phone"
                  id="phone"
                  register={register}
                  errors={errors}
                  name="phone"
                  classname="w-full"
                />
              </div>
              <div className="col-span-6">
                <FormField
                  label="Date of birth"
                  type="date"
                  placeholder="Date of birth"
                  id="dateOfBirth"
                  register={register}
                  errors={errors}
                  name="dateOfBirth"
                  classname="w-full"
                />
              </div>
            </div>
            <div className="mt-6 flex md:hidden gap-4 justify-center">
              <button
                type="button"
                className="btn btn-outline w-[140px] border-[0.2px] border-gray-500"
                onClick={() => navigate(-1)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white font-bold border-[0.2px] border-gray-500 p-2 rounded-md cursor-pointer w-[140px]"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save"}
              </button>
            </div>
          </fetcher.Form>
        )}
        <div className="md:flex justify-between items-center">
          <div className="mb-6 md:mb-0 md:w-[50%]">
            <h1 className="font-bold text-xl">Delete account</h1>
            <p className="text-gray-500 text-sm">
              When you delete your account, you lose access to medical history
              and appointments. We permanently delete your account and all
              associated data.
            </p>
          </div>
          <DeleteAccount />
        </div>
      </>
    </div>
  );
}

Component.displayName = "Account";
