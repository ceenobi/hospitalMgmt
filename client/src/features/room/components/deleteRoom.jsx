import { useEffect, useState } from "react";
import Modal from "@/shared/components/modal";
import { useFetcher } from "react-router";
import ErrorAlert from "@/shared/components/errorAlert";
import { RiDeleteBinLine } from "@remixicon/react";

export default function DeleteRoom({ room, onClose, isOpen }) {
  const [showSuccess, setShowSuccess] = useState(false);
  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.data?.success) {
      setShowSuccess(true);
    }
  }, [fetcher.data, setShowSuccess]);
  const error = ["fail", "error"].includes(fetcher.data?.status)
    ? fetcher.data.message
    : null;
  const isSubmitting = fetcher.state === "submitting";
  const roomId = room._id;

  const submit = (e) => {
    e.preventDefault();
    fetcher.submit(
      { roomId },
      {
        method: "delete",
        action: "/dashboard/rooms",
      }
    );
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        id="deleteRoomModal"
        classname="bg-white p-4 rounded-xl shadow-lg w-[90%] max-w-[400px] mx-auto"
        showClose
        onClose={onClose}
      >
        {error && <ErrorAlert error={error} />}
        {!showSuccess ? (
          <div className="flex flex-col items-center gap-2 w-full">
            <RiDeleteBinLine
              size={40}
              className="text-red-500 p-2 border-[0.2px] border-red-500 rounded-full shadow-lg"
            />
            <h1 className="text-2xl font-bold">Confirm Delete</h1>
            <p>
              Are you sure you want to delete room <b>{room?.roomNumber}</b>?
            </p>
            <div className="mt-4 mb-2 flex gap-2">
              <button
                type="button"
                className="btn btn-outline w-[150px] border-[0.2px] border-gray-500"
                onClick={() => onClose()}
              >
                Cancel
              </button>
              <fetcher.Form onSubmit={submit}>
                <button
                  type="submit"
                  className="btn bg-red-500 hover:bg-red-600 text-white w-[150px]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Deleting..." : "Yes, Delete"}
                </button>
              </fetcher.Form>
            </div>
          </div>
        ) : (
          <div className="p-4 text-center max-w-[300px] mx-auto">
            <img
              src="/Success.svg"
              alt="success"
              className="w-full h-[250px]"
            />
            <h1 className="text-2xl font-bold">Success!</h1>
            <p className="text-gray-600">Room deleted successfully.</p>
            <button
              onClick={onClose}
              className="my-4 btn bg-blue-500 hover:bg-blue-600 text-white"
            >
              Go back to Rooms
            </button>
          </div>
        )}
      </Modal>
    </>
  );
}
