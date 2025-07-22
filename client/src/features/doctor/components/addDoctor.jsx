import { useEffect, useMemo, useState } from "react";
import Modal from "@/components/modal";
import { useFetcher } from "react-router";
import { validateDoctorSchema } from "@/utils/dataSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import SelectField from "@/components/selectField";
import FormField from "@/components/formField";
import ErrorAlert from "@/components/errorAlert";

export default function AddDoctor({ meta, users }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fetcher = useFetcher();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validateDoctorSchema),
  });

  const getUserData = useMemo(() => {
    return users.map((user) => ({
      name: user.fullname,
      id: user._id,
      phone: user.phone || "Not available",
    }));
  }, [users]);

  const selectedUser = watch("userId");

  useEffect(() => {
    if (selectedUser) {
      const selectedUserData = getUserData.find(
        (user) => user.id === selectedUser
      );
      if (selectedUserData) {
        setValue("phone", selectedUserData.phone);
      }
    }
  }, [setValue, selectedUser, getUserData]);

  useEffect(() => {
    if (fetcher.data?.success) {
      setShowSuccess(true);
    }
  }, [fetcher.data, setShowSuccess]);

  const error = ["fail", "error"].includes(fetcher.data?.status)
    ? fetcher.data.message
    : null;
  const isSubmitting = fetcher.state === "submitting";

  const resetModal = () => {
    setIsOpen(false);
    setShowSuccess(false);
    reset();
  };

  const onSubmit = (data) => {
    fetcher.submit(data, {
      method: "post",
      action: "/dashboard/doctors",
    });
  };

  return (
    <>
      <button
        className="btn bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        Add Doctor
      </button>
      <Modal
        isOpen={isOpen}
        id="addDoctorModal"
        classname="bg-white p-4 rounded-xl shadow-lg w-[90%] max-w-[600px] mx-auto"
        title={`${showSuccess ? "" : "Add New Doctor"}`}
        showClose
        onClose={() => setIsOpen(false)}
      >
        {!showSuccess ? (
          <fetcher.Form onSubmit={handleSubmit(onSubmit)}>
            <div className="md:grid grid-cols-12 gap-4">
              <div className="md:col-span-6">
                <SelectField
                  label="Name"
                  id="name"
                  register={register}
                  name="userId"
                  placeholder="Name"
                  data={getUserData}
                  errors={errors}
                />
              </div>
              <div className="md:col-span-6">
                <SelectField
                  label="Specialization"
                  id="specialization"
                  register={register}
                  name="specialization"
                  placeholder="Specialization"
                  data={meta?.specialization}
                  errors={errors}
                />
              </div>
              <div className="md:col-span-6">
                <FormField
                  label="Phone"
                  id="phone"
                  register={register}
                  name="phone"
                  placeholder="Phone"
                  errors={errors}
                  type="tel"
                  disabled
                />
              </div>
              <div className="md:col-span-6">
                <SelectField
                  label="Availability"
                  id="availability"
                  register={register}
                  name="availability"
                  placeholder="Availability"
                  data={meta?.availability}
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
                {isSubmitting ? "Adding..." : "Add Doctor"}
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
            <p className="text-gray-600">Doctor added successfully.</p>
            <button
              onClick={resetModal}
              className="my-4 btn bg-blue-500 hover:bg-blue-600 text-white"
            >
              Go back to Doctors
            </button>
          </div>
        )}
        {error && <ErrorAlert error={error} />}
      </Modal>
    </>
  );
}
