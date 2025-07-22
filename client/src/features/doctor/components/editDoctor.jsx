import { useEffect, useState } from "react";
import Modal from "@/components/modal";
import { useFetcher } from "react-router";
import { validateDoctorSchema } from "@/utils/dataSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import SelectField from "@/components/selectField";
import FormField from "@/components/formField";
import ErrorAlert from "@/components/errorAlert";
import { useRouteLoaderData } from "react-router";

export default function EditDoctor({ doctor, onClose, isOpen }) {
  const { meta } = useRouteLoaderData("doctor_users");
  const [showSuccess, setShowSuccess] = useState(false);
  const fetcher = useFetcher();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validateDoctorSchema),
  });
  const { specialization, availability } = meta?.data?.meta || {};

  useEffect(() => {
    if (doctor) {
      setValue("userId", doctor.userId?.fullname);
      setValue("specialization", doctor.specialization);
      setValue("availability", doctor.availability);
      setValue("phone", doctor.userId?.phone || "Not available");
    }
  }, [setValue, doctor]);

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
    onClose();
    setShowSuccess(false);
    reset();
  };

  const onSubmit = (data) => {
    fetcher.submit(
      {
        ...data,
        doctorId: doctor._id,
        userId: doctor.userId._id,
      },
      {
        method: "patch",
        action: "/dashboard/doctors",
      }
    );
  };
  return (
    <>
      <Modal
        isOpen={isOpen}
        id="editDoctorModal"
        classname="bg-white p-4 rounded-xl shadow-lg w-[90%] max-w-[600px] mx-auto"
        title={`${showSuccess ? "" : "Edit Doctor"}`}
        showClose
        onClose={onClose}
      >
        {!showSuccess ? (
          <fetcher.Form onSubmit={handleSubmit(onSubmit)}>
            <div className="md:grid grid-cols-12 gap-4">
              <div className="md:col-span-6">
                <FormField
                  label="Name"
                  id="name"
                  register={register}
                  name="userId"
                  placeholder="Name"
                  errors={errors}
                  disabled
                />
              </div>
              <div className="md:col-span-6">
                <SelectField
                  label="Specialization"
                  id="specialization"
                  register={register}
                  name="specialization"
                  placeholder="Specialization"
                  data={specialization}
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
                  data={availability}
                  errors={errors}
                />
              </div>
            </div>
            <div className="mt-6 mb-2 flex w-full justify-end gap-4">
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
            <p className="text-gray-600">Doctor data updated successfully.</p>
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
