import Modal from "@/shared/components/modal";
import { useEffect, useState } from "react";
import { useFetcher, useRouteLoaderData } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { validateAppointmentSchema } from "@/shared/utils/dataSchema";
import ErrorAlert from "@/shared/components/errorAlert";
import SelectField from "@/shared/components/selectField";
import FormField from "@/shared/components/formField";
import { formatDate } from "@/shared/utils/constants";

export default function UpdateAppointment({ appointment, isOpen, onClose }) {
  const { appointmentMeta } = useRouteLoaderData("appointment_data");
  const [showSuccess, setShowSuccess] = useState(false);
  const fetcher = useFetcher();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validateAppointmentSchema),
  });

  useEffect(() => {
    if (appointment) {
      setValue("patientName", appointment.patientId?.fullname);
      setValue("doctorId", appointment.doctorId?._id);
      setValue(
        "appointmentDate",
        formatDate(appointment.appointmentDate, "input")
      );
      setValue("appointmentTime", appointment.appointmentTime);
      setValue("status", appointment.status);
      setValue("notes", appointment.notes);
    }
  }, [appointment, setValue]);

  useEffect(() => {
    if (fetcher.data?.success) {
      setShowSuccess(true);
    }
  }, [fetcher.data, setShowSuccess]);
  const { doctorMeta } = appointmentMeta?.data || {};

  // const patientsName = patientMeta?.map((patient) => ({
  //   id: patient._id,
  //   name: patient.fullname,
  // }));

  const doctorsName = doctorMeta?.map((doctor) => ({
    id: doctor.userId._id,
    name: doctor.userId.fullname,
  }));
  const status = ["scheduled", "confirmed", "cancelled"];
  const appointmentTime = ["10:00 AM", "1:00 PM", "3:00 PM"];

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
        appointmentId: appointment._id,
      },
      {
        method: "patch",
        action: "/dashboard/appointments",
      }
    );
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        id="updateAppointmentModal"
        classname="bg-white p-4 rounded-xl shadow-lg w-[90%] max-w-[600px] mx-auto"
        title={`${showSuccess ? "" : "Update Appointment"}`}
        showClose
        onClose={onClose}
      >
        {!showSuccess ? (
          <fetcher.Form onSubmit={handleSubmit(onSubmit)}>
            {error && <ErrorAlert error={error} />}
            <div className="md:grid grid-cols-12 gap-4">
              <div className="md:col-span-6">
                <FormField
                  label="Patient Name"
                  id="patientName"
                  register={register}
                  name="patientName"
                  placeholder="Patient name"
                  errors={errors}
                  type="text"
                  disabled
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
