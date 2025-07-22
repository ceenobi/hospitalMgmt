import { RiLogoutCircleRLine } from "@remixicon/react";
import { useState } from "react";
import Modal from "./modal";
import { Form } from "react-router";

export default function Logout() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="p-4 flex gap-2 items-center text-base cursor-pointer text-red-500"
        onClick={() => setIsOpen(true)}
      >
        <RiLogoutCircleRLine />
        Logout
      </button>
      <Modal
        isOpen={isOpen}
        id="logoutModal"
        classname="bg-white p-4 rounded-xl shadow-lg w-[90%] max-w-[400px] mx-auto"
      >
        <div className="flex flex-col items-center gap-2 w-full">
          <RiLogoutCircleRLine size={40} className="text-red-500" />
          <h1 className="text-2xl font-bold">Logout</h1>
          <p className="text-center">Are you sure you want to logout from your account?</p>
          <div className="mt-4 mb-2 flex gap-2">
            <button
              type="button"
              className="btn btn-outline w-[150px] border-[0.2px] border-gray-500"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </button>
            <Form action="/logout" method="post">
              <button
                type="submit"
                className="btn bg-red-500 hover:bg-red-600 text-white w-[150px]"
              >
                Yes, Logout
              </button>
            </Form>
          </div>
        </div>
      </Modal>
    </>
  );
}
