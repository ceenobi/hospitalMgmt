import React, { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { validateAppointmentSchema } from "@/utils/dataSchema";
import Modal from "@/components/modal";
import SelectField from "@/components/selectField";
import FormField from "@/components/formField";
import ErrorAlert from "@/components/errorAlert";

export default function CreateAppointment({ appointmentMeta }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fetcher = useFetcher();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validateAppointmentSchema),
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
  const { patientMeta, doctorMeta } = appointmentMeta?.data || {};

  const patientsName = patientMeta?.map((patient) => ({
    id: patient.userId._id,
    name: patient.userId.fullname,
  }));

  const doctorsName = doctorMeta?.map((doctor) => ({
    id: doctor.userId._id,
    name: doctor.userId.fullname,
  }));
  const status = ["scheduled", "confirmed", "cancelled"];
  const appointmentTime = ["10:00 AM", "1:00 PM", "3:00 PM"];
  const resetModal = () => {
    setIsOpen(false);
    setShowSuccess(false);
    reset();
  };

  const onSubmit = (data) => {
    fetcher.submit(
      { ...data, type: "create" },
      {
        method: "post",
        action: "/dashboard/appointments",
      }
    );
  };

  return (
    <>
      <button
        className="btn bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        Create <span className="hidden md:inline">Appointment</span>
      </button>
      <Modal
        isOpen={isOpen}
        id="createAppointmentModal"
        classname="bg-white p-4 rounded-xl shadow-lg w-[90%] max-w-[600px] mx-auto"
        title={`${showSuccess ? "" : "New Appointment"}`}
        showClose
        onClose={resetModal}
      >
        {!showSuccess ? (
          <fetcher.Form onSubmit={handleSubmit(onSubmit)}>
            {error && <ErrorAlert error={error} />}
            <div className="md:grid grid-cols-12 gap-4">
              <div className="md:col-span-6">
                <SelectField
                  label="Patient Name"
                  id="patientId"
                  register={register}
                  name="patientId"
                  placeholder="Patient name"
                  data={patientsName}
                  errors={errors}
                />
              </div>
              <div className="md:col-span-6">
                <SelectField
                  label="Doctor Name"
                  id="doctorId"
                  register={register}
                  name="doctorId"
                  placeholder="Doctor name"
                  data={doctorsName}
                  errors={errors}
                />
              </div>
              <div className="md:col-span-6">
                <FormField
                  label="Appointment Date"
                  id="appointmentDate"
                  register={register}
                  name="appointmentDate"
                  placeholder="Date"
                  errors={errors}
                  type="date"
                />
              </div>
              <div className="md:col-span-6">
                <SelectField
                  label="Appointment Time"
                  id="appointmentTime"
                  register={register}
                  name="appointmentTime"
                  placeholder="Time"
                  data={appointmentTime}
                  errors={errors}
                />
              </div>
              <div className="md:col-span-6">
                <SelectField
                  label="Status"
                  id="status"
                  register={register}
                  name="status"
                  placeholder="Status"
                  data={status}
                  errors={errors}
                />
              </div>
              <div className="md:col-span-6">
                <textarea
                  className="textarea w-full my-4"
                  placeholder="Notes"
                  {...register("notes")}
                ></textarea>
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
                {isSubmitting ? "Creating..." : "Create"}
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
            <p className="text-gray-600">Appointment created successfully.</p>
            <button
              onClick={resetModal}
              className="my-4 btn bg-blue-500 hover:bg-blue-600 text-white"
            >
              Go back to Appointments
            </button>
          </div>
        )}
      </Modal>
    </>
  );
}
