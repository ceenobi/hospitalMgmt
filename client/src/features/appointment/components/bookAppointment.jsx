import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { validateBookAppointmentSchema } from "@/shared/utils/dataSchema";
import Modal from "@/shared/components/modal";
import SelectField from "@/shared/components/selectField";
import FormField from "@/shared/components/formField";
import ErrorAlert from "@/shared/components/errorAlert";
import { useFetcher } from "react-router";

export default function BookAppointment() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validateBookAppointmentSchema),
  });
  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.data?.success) {
      setShowSuccess(true);
    }
  }, [fetcher.data, setShowSuccess]);

  const isSubmitting = fetcher.state === "submitting";
  let error = ["fail", "error"].includes(fetcher.data?.status)
    ? fetcher.data.message
    : null;
  const appointmentTime = ["10:00 AM", "1:00 PM", "3:00 PM"];

  const resetModal = () => {
    setIsOpen(false);
    setShowSuccess(false);
    reset();
  };

  const onSubmit = (data) => {
    fetcher.submit(
      { ...data, type: "book" },
      {
        method: "post",
        action: "/dashboard/appointments",
      }
    );
  };

  // const onSubmit = async (data) => {
  //   const res = await bookAppointment(data);
  //   if (res.success) {
  //     setShowSuccess(true);
  //     setMessage(res.message);
  //   } else {
  //     setError(res.message);
  //   }
  // };

  return (
    <>
      <button
        className="btn bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        Book Appointment
      </button>
      <Modal
        isOpen={isOpen}
        id="bookAppointmentModal"
        classname="bg-white p-4 rounded-xl shadow-lg w-[90%] max-w-[600px] mx-auto"
        title={`${showSuccess ? "" : "Book Appointment"}`}
        showClose
        onClose={resetModal}
      >
        {!showSuccess ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            {error && <ErrorAlert error={error} />}
            <div className="md:grid grid-cols-12 gap-4">
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
              <div className="md:col-span-12">
                <textarea
                  className="textarea w-full mt-4"
                  placeholder="Notes"
                  {...register("notes")}
                ></textarea>
                <p className="text-red-500 text-xs">{errors.notes?.message}</p>
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
                {isSubmitting ? "Booking..." : "Book"}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-4 text-center max-w-[300px] mx-auto">
            <img
              src="/Success.svg"
              alt="success"
              className="w-full h-[250px]"
            />
            <h1 className="text-2xl font-bold">Congratulations!</h1>
            <p className="text-gray-600">{fetcher.data?.message}</p>
            <button
              onClick={resetModal}
              className="my-4 btn bg-blue-500 hover:bg-blue-600 text-white"
            >
              Go back to Bookings
            </button>
          </div>
        )}
      </Modal>
    </>
  );
}
