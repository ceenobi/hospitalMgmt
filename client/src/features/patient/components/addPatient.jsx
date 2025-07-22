import { useEffect, useState } from "react";
import Modal from "@/components/modal";
import { useFetcher } from "react-router";
import { validatePatientSchema } from "@/utils/dataSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import SelectField from "@/components/selectField";
import FormField from "@/components/formField";
import ErrorAlert from "@/components/errorAlert";
import { bloodGroup } from "@/utils/constants";

export default function AddPatient() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fetcher = useFetcher();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validatePatientSchema),
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
  const gender = ["male", "female", "other"];

  const bloodGroupOptions = Object.entries(bloodGroup).map(([key, value]) => ({
    id: value,
    name: key,
  }));

  const resetModal = () => {
    setIsOpen(false);
    setShowSuccess(false);
    reset();
  };

  const onSubmit = (data) => {
    fetcher.submit(data, {
      method: "post",
      action: "/dashboard/patients",
    });
  };

  return (
    <>
      <button
        className="btn bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        Add Patient
      </button>
      <Modal
        isOpen={isOpen}
        id="addPatientModal"
        classname="bg-white p-4 rounded-xl shadow-lg w-[90%] max-w-[600px] mx-auto"
        title={`${showSuccess ? "" : "Add New Patient"}`}
        showClose
        onClose={() => setIsOpen(false)}
      >
        {!showSuccess ? (
          <fetcher.Form onSubmit={handleSubmit(onSubmit)}>
            <div className="md:grid grid-cols-12 gap-4">
              <div className="md:col-span-6">
                <FormField
                  label="Full name"
                  id="fullname"
                  register={register}
                  name="fullname"
                  placeholder="Full name"
                  errors={errors}
                  type="text"
                />
              </div>
              <div className="md:col-span-6">
                <FormField
                  label="Email"
                  id="email"
                  register={register}
                  name="email"
                  placeholder="Email"
                  errors={errors}
                  type="email"
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
                />
              </div>
              <div className="md:col-span-6">
                <FormField
                  label="Date of birth"
                  id="dateOfBirth"
                  register={register}
                  name="dateOfBirth"
                  placeholder="Date of birth"
                  errors={errors}
                  type="date"
                />
              </div>
              <div className="md:col-span-6">
                <SelectField
                  label="Gender"
                  id="gender"
                  register={register}
                  name="gender"
                  placeholder="Gender"
                  data={gender}
                  errors={errors}
                />
              </div>
              <div className="md:col-span-6">
                <SelectField
                  label="Blood group"
                  id="bloodGroup"
                  register={register}
                  name="bloodGroup"
                  placeholder="Blood group"
                  data={bloodGroupOptions}
                  errors={errors}
                />
              </div>
              <div className="md:col-span-12">
                <FormField
                  label="Address"
                  id="address"
                  register={register}
                  name="address"
                  placeholder="Address"
                  errors={errors}
                  type="text"
                />
              </div>
              <div className="md:col-span-6">
                <FormField
                  label="Emergency contact"
                  id="emergencyContact"
                  register={register}
                  name="emergencyContact"
                  placeholder="Emergency contact"
                  errors={errors}
                  type="text"
                />
              </div>
              <div className="md:col-span-6">
                <FormField
                  label="Emergency contact phone"
                  id="emergencyContactPhone"
                  register={register}
                  name="emergencyContactPhone"
                  placeholder="Emergency contact phone"
                  errors={errors}
                  type="tel"
                />
              </div>
              <div className="md:col-span-6">
                <FormField
                  label="Emergency contact relationship"
                  id="emergencyContactRelationship"
                  register={register}
                  name="emergencyContactRelationship"
                  placeholder="Emergency contact relationship"
                  errors={errors}
                  type="text"
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
                {isSubmitting ? "Adding..." : "Add Patient"}
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
            <p className="text-gray-600">Patient added successfully.</p>
            <button
              onClick={resetModal}
              className="my-4 btn bg-blue-500 hover:bg-blue-600 text-white"
            >
              Go back to Patients
            </button>
          </div>
        )}
        {error && <ErrorAlert error={error} />}
      </Modal>
    </>
  );
}
