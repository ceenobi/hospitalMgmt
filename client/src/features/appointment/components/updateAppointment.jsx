import Modal from "@/components/modal";
import { useEffect, useState } from "react";
import { useFetcher, useRouteLoaderData } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { validateAppointmentSchema } from "@/utils/dataSchema";
import ErrorAlert from "@/components/errorAlert";
import SelectField from "@/components/selectField";
import FormField from "@/components/formField";
import { formatDate } from "@/utils/constants";

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
  const { doctorMeta } = appointmentMeta?.data || {};

  const doctorsName = doctorMeta?.map((doctor) => ({
    id: doctor.userId._id,
    name: doctor.userId.fullname,
  }));

  useEffect(() => {
    if (appointment) {
      setValue("patientId", appointment?.patientId?.fullname);
      setValue(
        "doctorId",
        doctorsName.find(
          (doctor) => doctor.name === appointment?.doctorId?.fullname
        )?.id
      );
      setValue(
        "appointmentDate",
        formatDate(appointment.appointmentDate, "input")
      );
      setValue("appointmentTime", appointment.appointmentTime);
      setValue("status", appointment.status);
      setValue("notes", appointment.notes);
    }
  }, [appointment, doctorsName, setValue]);

  useEffect(() => {
    if (fetcher.data?.success) {
      setShowSuccess(true);
    }
  }, [fetcher.data, setShowSuccess]);
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
    const formDetails = {
      ...data,
      patientId: appointment?.patientId?._id,
      doctorId: appointment?.doctorId?._id || data.doctorId,
      appointmentId: appointment._id,
    };
    fetcher.submit(formDetails, {
      method: "patch",
      action: "/dashboard/appointments",
    });
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
                  id="patientId"
                  register={register}
                  name="patientId"
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
                <fieldset className="fieldset relative">
                  <legend className="fieldset-legend">Notes</legend>
                  <textarea
                    className="textarea w-full"
                    placeholder="Notes"
                    {...register("notes")}
                  ></textarea>
                </fieldset>
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
