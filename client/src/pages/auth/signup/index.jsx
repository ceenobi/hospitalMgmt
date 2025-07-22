import FormField from "@/components/formField";
import { validateSignUpSchema } from "@/utils/dataSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { RiUser4Fill } from "@remixicon/react";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { Link, useFetcher, useOutletContext } from "react-router";
import useMetaArgs from "@/hooks/useMeta";
import { toast } from "sonner";
import ErrorAlert from "@/components/errorAlert";

export function Component() {
  useMetaArgs({
    title: "Register - Clinicare",
    description:
      "Create your Clinicare account to start managing your health easily.",
    keywords: "Clinicare, register, account",
  });
  const [isVisible, setIsVisible] = useState(false);
  const { setAccessToken } = useOutletContext();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validateSignUpSchema),
  });

  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";
  const error = fetcher.data?.status === "fail" ? fetcher.data.message : null;

  useEffect(() => {
    if (fetcher.data?.success) {
      toast.success(fetcher.data.message);
      setAccessToken(fetcher.data.data.accessToken);
    }
  }, [fetcher.data, setAccessToken]);

  const onSubmit = (data) => {
    fetcher.submit(data, {
      method: "post",
      action: "/account/signup",
    });
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow w-full max-w-[400px]">
      <fetcher.Form
        className="flex flex-col items-center gap-2 w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <RiUser4Fill
          size={40}
          className="text-blue-500 p-2 border-[0.2px] border-blue-500 rounded-full shadow-lg"
        />
        <h1 className="text-2xl font-bold">Create Account</h1>
        <p className="text-muted-foreground text-center">Enter your details to sign up</p>
        <div className="w-full md:w-[350px]">
          {error && <ErrorAlert error={error} />}
          <FormField
            label="Full name"
            type="text"
            placeholder="Full name"
            id="fullname"
            register={register}
            errors={errors}
            name="fullname"
          />
          <FormField
            label="Email"
            type="email"
            placeholder="Email"
            id="email"
            register={register}
            errors={errors}
            name="email"
          />
          <FormField
            label="Password"
            type="password"
            placeholder="Password"
            id="password"
            register={register}
            errors={errors}
            name="password"
            isVisible={isVisible}
            setIsVisible={setIsVisible}
          />
        </div>
        <button
          type="submit"
          className="my-4 btn bg-blue-500 hover:bg-blue-600 text-white w-full md:w-[350px]"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing up..." : "Sign up"}
        </button>
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/account/signin" className="text-blue-500 font-bold">
            Login
          </Link>
        </p>
      </fetcher.Form>
    </div>
  );
}

Component.displayName = "SignUp";
