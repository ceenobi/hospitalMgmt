import ErrorAlert from "@/components/errorAlert";
import FormField from "@/components/formField";
import Modal from "@/components/modal";
import SelectField from "@/components/selectField";
import { validateUpdateUserRoleSchema } from "@/utils/dataSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useFetcher } from "react-router";

export default function UpdateUser({ user, onClose, isOpen }) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const fetcher = useFetcher();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validateUpdateUserRoleSchema),
  });

  useEffect(() => {
    if (user) {
      setValue("fullname", user.fullname);
      setValue("email", user.email);
      setValue("role", user.role);
    }
  }, [user, setValue]);

  useEffect(() => {
    if (fetcher.data?.success) {
      setShowSuccess(true);
    }
  }, [fetcher.data, setShowSuccess]);

  const error = ["fail", "error"].includes(fetcher.data?.status)
    ? fetcher.data.message
    : null;
  const isSubmitting = fetcher.state === "submitting";
  const roles = ["admin", "staff", "doctor", "nurse"];

  const resetModal = () => {
    onClose();
    setShowSuccess(false);
    reset();
  };

  const onSubmit = (data) => {
    fetcher.submit(
      {
        ...data,
        userId: user._id,
      },
      {
        method: "patch",
        action: "/dashboard/users",
      }
    );
  };
  return (
    <>
      <Modal
        isOpen={isOpen}
        id="updateUserModal"
        classname="bg-white p-4 rounded-xl shadow-lg w-[90%] max-w-[600px] mx-auto"
        title={`${showSuccess ? "" : "Update user data"}`}
        showClose
        onClose={onClose}
      >
        {!showSuccess ? (
          <fetcher.Form onSubmit={handleSubmit(onSubmit)}>
            <div className="md:grid grid-cols-12 gap-4">
              <div className="md:col-span-6">
                <FormField
                  label="Full Name"
                  id="fullname"
                  register={register}
                  name="fullname"
                  placeholder="Full Name"
                  errors={errors}
                  type="text"
                  disabled
                />
              </div>
              <div className="md:col-span-6">
                <FormField
                  label="Email"
                  type="email"
                  placeholder="Email"
                  id="email"
                  register={register}
                  errors={errors}
                  name="email"
                  disabled
                />
              </div>
              <div className="md:col-span-6">
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
                  disabled
                />
              </div>
              <div className="md:col-span-6">
                <SelectField
                  label="Role"
                  id="role"
                  register={register}
                  name="role"
                  placeholder="Role"
                  data={roles}
                  errors={errors}
                />
              </div>
            </div>
            <div className="mt-6 mb-2 flex w-full justify-end gap-2">
              <button
                type="button"
                className="btn btn-outline w-[120px] border-[0.2px] border-gray-500"
                onClick={resetModal}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn bg-blue-500 hover:bg-blue-600 text-white w-[120px]"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update"}
              </button>
            </div>
          </fetcher.Form>
        ) : (
          <div className="p-4 text-center max-w-[300px] mx-auto">
            <img
              src="/Success.svg"
              alt="success"
              className="w-full h-[250px]"
            />
            <h1 className="text-2xl font-bold">Congratulations!</h1>
            <p className="text-gray-600">User data updated successfully.</p>
            <button
              onClick={resetModal}
              className="my-4 btn bg-blue-500 hover:bg-blue-600 text-white"
            >
              Go back to Users
            </button>
          </div>
        )}
        {error && <ErrorAlert error={error} />}
      </Modal>
    </>
  );
}
