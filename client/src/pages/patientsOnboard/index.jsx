import { useFetcher, useOutletContext } from "react-router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { validatePatientSchema } from "@/utils/dataSchema";
import { useEffect } from "react";
import { bloodGroup, formatDate } from "@/utils/constants";
import ErrorAlert from "@/components/errorAlert";
import FormField from "@/components/formField";
import SelectField from "@/components/selectField";
import useMetaArgs from "@/hooks/useMeta";

export function Component() {
  const { user } = useOutletContext();
  useMetaArgs({
    title: "Patients Onboard - Clinicare",
    description: "Complete your patient profile.",
    keywords: "Clinicare, patients, account",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validatePatientSchema),
  });
  const fetcher = useFetcher();
  useEffect(() => {
    if (fetcher.data?.success) {
      setShowSuccess(true);
    }
  }, [fetcher.data, setShowSuccess]);

  useEffect(() => {
    if (user) {
      setValue("fullname", user.fullname);
      setValue("email", user.email);
      setValue("phone", user.phone || "");
      setValue("dateOfBirth", formatDate(user.dateOfBirth || "", "input"));
    }
  }, [user, setValue]);

  const isSubmitting = fetcher.state === "submitting";
  const error = ["fail", "error"].includes(fetcher.data?.status)
    ? fetcher.data.message
    : null;
  const gender = ["male", "female", "other"];
  const bloodGroupOptions = Object.entries(bloodGroup).map(([key, value]) => ({
    id: value,
    name: key,
  }));

  const onSubmit = (data) => {
    fetcher.submit(data, {
      method: "post",
      action: "/patients-onboard",
    });
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] flex flex-col items-start md:items-center justify-center gap-2">
      <h1 className="mt-10 md:mt-0 text-2xl font-bold">Patients Onboard</h1>
      {showSuccess || user?.isCompletedOnboard ? (
        <div className="p-4 text-center max-w-[400px] mx-auto">
          <img src="/Success.svg" alt="success" className="w-full h-[250px]" />
          <h1 className="text-xl font-bold">Congratulations!</h1>
          <p className="text-gray-600 my-2">
            Health information updated successfully.
          </p>
          <button
            onClick={() => (window.location.href = "/dashboard")}
            className="btn bg-blue-500 hover:bg-blue-600 text-white"
          >
            Go back to Home
          </button>
        </div>
      ) : (
        <fetcher.Form
          onSubmit={handleSubmit(onSubmit)}
          className="my-4 w-full max-w-[600px] mx-auto bg-white py-6 px-4 rounded-xl shadow-lg"
        >
          <p className="text-muted-foreground text-center font-medium">
            Hello <b>{user?.fullname}</b>, Please complete your patient profile
          </p>
          {error && <ErrorAlert error={error} />}
          <div className="my-4 md:grid grid-cols-12 gap-4">
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
                placeholder="Select Gender"
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
                placeholder="Select Blood group"
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
          <div className="mt-6 flex gap-4 justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white font-bold border-[0.2px] border-gray-500 p-2 rounded-md cursor-pointer w-full md:w-[140px]"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </fetcher.Form>
      )}
    </div>
  );
}

Component.displayName = "PatientsOnboard";
