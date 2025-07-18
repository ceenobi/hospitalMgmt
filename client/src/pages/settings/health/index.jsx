import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  useFetcher,
  useLoaderData,
  useNavigate,
  useOutletContext,
} from "react-router";
import { validatePatientSchema } from "@/shared/utils/dataSchema";
import { useEffect, useState } from "react";
import useMetaArgs from "@/shared/hooks/useMeta";
import FormField from "@/shared/components/formField";
import SelectField from "@/shared/components/selectField";
import { bloodGroup, formatDate } from "@/shared/utils/constants";
import ErrorAlert from "@/shared/components/errorAlert";

export function Component() {
  useMetaArgs({
    title: "Health - Clinicare",
    description: "Health settings for your Clinicare account.",
    keywords: "Clinicare, health, settings",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const { user } = useOutletContext();
  const patient = useLoaderData();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validatePatientSchema),
  });
  const fetcher = useFetcher();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setValue("fullname", user.fullname);
      setValue("email", user.email);
      setValue("phone", user.phone || "");
      setValue("dateOfBirth", formatDate(user.dateOfBirth || "", "input"));
    }
    if (patient?.success) {
      setValue("gender", patient.data.gender || "");
      setValue("bloodGroup", patient.data.bloodGroup || "");
      setValue("address", patient.data.address || "");
      setValue("emergencyContact", patient.data.emergencyContact || "");
      setValue(
        "emergencyContactPhone",
        patient.data.emergencyContactPhone || ""
      );
      setValue(
        "emergencyContactRelationship",
        patient.data.emergencyContactRelationship || ""
      );
    }
  }, [user, setValue, patient]);

  useEffect(() => {
    if (fetcher.data?.success) {
      setShowSuccess(true);
    }
  }, [fetcher.data]);

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
    fetcher.submit(
      {
        ...data,
        patientId: patient?.data?._id,
      },
      {
        method: "patch",
        action: "/dashboard/settings/health",
        encType: "multipart/form-data",
      }
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="font-bold text-2xl border-b-[0.2px] border-gray-500 pb-2">
        Health Information
      </h1>
      {showSuccess ? (
        <div className="p-4 text-center max-w-[300px] mx-auto">
          <img src="/Success.svg" alt="success" className="w-full h-[250px]" />
          <h1 className="text-xl font-bold">Congratulations!</h1>
          <p className="text-gray-600">
            Health information updated successfully.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="my-4 btn bg-blue-500 hover:bg-blue-600 text-white"
          >
            Go back to Dashboard
          </button>
        </div>
      ) : (
        <fetcher.Form
          onSubmit={handleSubmit(onSubmit)}
          id="/dashboard/settings/health"
          className="pb-6 md:pb-2"
        >
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
          <div className="mt-6 flex md:hidden gap-4 justify-center">
            <button
              type="button"
              className="btn btn-outline w-[140px] border-[0.2px] border-gray-500"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white font-bold border-[0.2px] border-gray-500 p-2 rounded-md cursor-pointer w-[140px]"
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

Component.displayName = "Health";
