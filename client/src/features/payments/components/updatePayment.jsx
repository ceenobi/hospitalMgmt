import { useFetcher, useRouteLoaderData } from "react-router";
import { useEffect, useState } from "react";
import Modal from "@/components/modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import ErrorAlert from "@/components/errorAlert";
import SelectField from "@/components/selectField";
import FormField from "@/components/formField";
import { validateCreatePaymentSchema } from "@/utils/dataSchema";

export default function UpdatePayment({ payment, onClose, isOpen }) {
  const { paymentMeta } = useRouteLoaderData("payment_data");
  const [showSuccess, setShowSuccess] = useState(false);
  const fetcher = useFetcher();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validateCreatePaymentSchema),
  });
  const { doctorMeta } = paymentMeta?.data || {};

  const doctorsName = doctorMeta?.map((doctor) => ({
    id: doctor.userId._id,
    name: doctor.userId.fullname,
  }));

  useEffect(() => {
    if (payment) {
      setValue("patientId", payment.patientId.fullname);
      setValue(
        "doctorId",
        doctorsName.find(
          (doctor) => doctor.name === payment?.doctorId?.fullname
        )?.id
      );
      setValue("amount", payment.amount);
      setValue("status", payment.status);
      setValue("notes", payment.notes);
    }
  }, [payment, setValue, doctorsName]);

  useEffect(() => {
    if (fetcher.data?.success) {
      setShowSuccess(true);
    }
  }, [fetcher.data, setShowSuccess]);

  const status = ["pending", "confirmed", "cancelled"];

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
      patientId: payment?.patientId?._id,
      doctorId: payment?.doctorId?._id || data.doctorId,
      paymentId: payment._id,
    };
    fetcher.submit(formDetails, {
      method: "patch",
      action: "/dashboard/payments",
    });
  };
  return (
    <>
      <Modal
        isOpen={isOpen}
        id="updatePaymentModal"
        classname="bg-white p-4 rounded-xl shadow-lg w-[90%] max-w-[600px] mx-auto"
        title={`${showSuccess ? "" : "Update Payment"}`}
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
              <div className="md:col-span-12">
                <textarea
                  className="textarea w-full"
                  placeholder="Notes"
                  {...register("notes")}
                ></textarea>
                {errors?.notes?.message && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors?.notes?.message}
                  </p>
                )}
              </div>
              <div className="md:col-span-6">
                <FormField
                  label="Amount"
                  id="amount"
                  register={register}
                  name="amount"
                  placeholder="Amount"
                  errors={errors}
                  type="number"
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
            <p className="text-gray-600">{fetcher.data?.message}</p>
            <button
              onClick={resetModal}
              className="my-4 btn bg-blue-500 hover:bg-blue-600 text-white"
            >
              Go back to Payments
            </button>
          </div>
        )}
      </Modal>
    </>
  );
}
