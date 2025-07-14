import Modal from "@/shared/components/modal";
import { RiDeleteBinLine } from "@remixicon/react";
import { useEffect, useState } from "react";
import { useFetcher, useSubmit } from "react-router";
import { toast } from "sonner";

export default function DeleteAccount() {
  const [isOpen, setIsOpen] = useState(false);
  const fetcher = useFetcher();
  const submit = useSubmit();

  useEffect(() => {
    if (fetcher.data?.success) {
      toast.success(fetcher.data.message);
      submit({}, { action: "/logout", method: "post" });
    }
  }, [fetcher.data, submit]);

  return (
    <>
      <button
        className="btn flex gap-2 items-center text-base cursor-pointer bg-red-500 text-white"
        onClick={() => setIsOpen(true)}
      >
        Delete Account
      </button>
      <Modal
        isOpen={isOpen}
        id="deleteAccountModal"
        classname="bg-white p-4 rounded-xl shadow-lg w-[90%] max-w-[400px] mx-auto"
      >
        <div className="flex flex-col items-center gap-2 w-full">
          <RiDeleteBinLine size={40} className="text-red-500 p-2 border-[0.2px] border-red-500 rounded-full shadow-lg" />
          <h1 className="text-2xl font-bold">Delete account</h1>
          <p className="text-center">
            Are you sure you want to delete your account?
          </p>
          <div className="mt-4 mb-2 flex gap-2">
            <button
              type="button"
              className="btn w-[160px] border-[0.2px] border-gray-500"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </button>
            <fetcher.Form action="/dashboard/settings/account" method="delete">
              <button
                type="submit"
                className="btn bg-red-500 hover:bg-red-600 text-white w-[160px]"
              >
                Yes, Delete
              </button>
            </fetcher.Form>
          </div>
        </div>
      </Modal>
    </>
  );
}
