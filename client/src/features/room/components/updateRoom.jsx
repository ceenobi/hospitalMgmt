import ErrorAlert from "@/shared/components/errorAlert";
import FormField from "@/shared/components/formField";
import Modal from "@/shared/components/modal";
import SelectField from "@/shared/components/selectField";
import { validateRoomSchema } from "@/shared/utils/dataSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useFetcher, useRouteLoaderData } from "react-router";

export default function UpdateRoom({ room, onClose, isOpen }) {
  const [showSuccess, setShowSuccess] = useState(false);
  const fetcher = useFetcher();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validateRoomSchema),
  });
  const data = useRouteLoaderData("room_data");
  const { roomMeta } = data || {};
  const { roomType, roomStatus } = roomMeta?.data || {};

  useEffect(() => {
    if (room) {
      setValue("roomNumber", room.roomNumber);
      setValue("roomDescription", room.roomDescription);
      setValue("roomType", room.roomType);
      setValue("roomCapacity", room.roomCapacity);
      setValue("roomPrice", room.roomPrice);
      setValue("roomStatus", room.roomStatus);
      setValue("isFilled", room.isFilled);
    }
  }, [room, setValue]);

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

  const resetModal = () => {
    onClose();
    setShowSuccess(false);
    reset();
  };

  const onSubmit = (data) => {
    fetcher.submit(
      {
        ...data,
        roomId,
      },
      {
        method: "patch",
        action: "/dashboard/rooms",
      }
    );
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        id="updateRoomModal"
        classname="bg-white p-4 rounded-xl shadow-lg w-[90%] max-w-[600px] mx-auto"
        title={`${showSuccess ? "" : "Update Room"}`}
        showClose
        onClose={onClose}
      >
        {!showSuccess ? (
          <fetcher.Form onSubmit={handleSubmit(onSubmit)}>
            <div className="md:grid grid-cols-12 gap-4">
              <div className="md:col-span-6">
                <FormField
                  label="Room Number"
                  id="roomNumber"
                  register={register}
                  name="roomNumber"
                  placeholder="Room Number (1-20)"
                  errors={errors}
                  type="number"
                />
              </div>
              <div className="md:col-span-6">
                <SelectField
                  label="Room Type"
                  id="roomType"
                  register={register}
                  name="roomType"
                  placeholder="Room Type"
                  data={roomType}
                  errors={errors}
                />
              </div>
              <div className="md:col-span-6">
                <FormField
                  label="Room Price"
                  id="roomPrice"
                  register={register}
                  name="roomPrice"
                  placeholder="Room Price"
                  errors={errors}
                  type="number"
                />
              </div>

              <div className="md:col-span-6">
                <SelectField
                  label="Room Status"
                  id="roomStatus"
                  register={register}
                  name="roomStatus"
                  placeholder="Room Status"
                  data={roomStatus}
                  errors={errors}
                />
              </div>
              <div className="md:col-span-12">
                <FormField
                  label="Room Description"
                  id="roomDescription"
                  register={register}
                  name="roomDescription"
                  placeholder="Room Description"
                  errors={errors}
                  type="text"
                />
              </div>
              <div className="md:col-span-6">
                <FormField
                  label="Room Capacity"
                  id="roomCapacity"
                  register={register}
                  name="roomCapacity"
                  placeholder="Room Capacity (1-5)"
                  errors={errors}
                  type="number"
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
                {isSubmitting ? "Adding..." : "Add Room"}
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
            <p className="text-gray-600">Room updated successfully.</p>
            <button
              onClick={resetModal}
              className="my-4 btn bg-blue-500 hover:bg-blue-600 text-white"
            >
              Go back to Rooms
            </button>
          </div>
        )}
        {error && <ErrorAlert error={error} />}
      </Modal>
    </>
  );
}
