import ErrorAlert from "@/components/errorAlert";
import FormField from "@/components/formField";
import Modal from "@/components/modal";
import SelectField from "@/components/selectField";
import { validateSignUpSchema } from "@/utils/dataSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useFetcher } from "react-router";

export default function AddUser() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const fetcher = useFetcher();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validateSignUpSchema),
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      role: "",
    },
  });

  useEffect(() => {
    if (fetcher.data?.success) {
      setShowSuccess(true);
    }
  }, [fetcher.data, setShowSuccess]);

  const error = ["fail", "error"].includes(fetcher.data?.status)
    ? fetcher.data.message
    : null;
  const isSubmitting = fetcher.state === "submitting";
  const roles = ["admin", "staff", "doctor", "nurse", "patient"];

  const resetModal = () => {
    setIsOpen(false);
    setShowSuccess(false);
    reset();
  };

  const onSubmit = (data) => {
    fetcher.submit(data, {
      method: "post",
      action: "/dashboard/users",
    });
  };

  return (
    <>
      <button
        className="btn bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        Add New User
      </button>
      <Modal
        isOpen={isOpen}
        id="addNewUserModal"
        classname="bg-white p-4 rounded-xl shadow-lg w-[90%] max-w-[600px] mx-auto"
        title={`${showSuccess ? "" : "Create User"}`}
        showClose
        onClose={() => setIsOpen(false)}
      >
        {!showSuccess ? (
          <fetcher.Form onSubmit={handleSubmit(onSubmit)}>
            {error && <ErrorAlert error={error} />}
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
                />
              </div>
              <div className="md:col-span-6">
                <SelectField
                  label="Role"
                  id="role"
                  register={register}
                  name="role"
                  placeholder="Select Role"
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
                {isSubmitting ? "Creating..." : "Create User"}
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
            <h1 className="text-2xl font-bold">Success!</h1>
            <p className="text-gray-600">User created successfully.</p>
            <button
              onClick={resetModal}
              className="my-4 btn bg-blue-500 hover:bg-blue-600 text-white"
            >
              Go back to Users
            </button>
          </div>
        )}
      </Modal>
    </>
  );
}
