import { formatDate, usersRoleColors } from "@/utils/constants";
import { useState } from "react";
import { useOutletContext } from "react-router";
import UpdateUser from "./updateUser";
import DeleteUser from "./deleteUser";
import { RiPhoneLine } from "@remixicon/react";

export default function Card({ users }) {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const { user: loggedInUser } = useOutletContext();
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users?.map((user) => (
          <div
            className="card border border-slate-200 rounded-xl shadow bg-white"
            key={user._id}
          >
            <div className="card-body">
              <div className="flex gap-2">
                <div>
                  <div className="avatar avatar-placeholder">
                    <div className="w-12 rounded-full bg-gray-300">
                      {user?.avatar ? (
                        <img
                          src={user?.avatar}
                          alt={user?.fullname.split(" ")[0].charAt(0)}
                          referrerPolicy="no-referrer"
                          loading="lazy"
                        />
                      ) : (
                        <span className="text-md">
                          {user?.fullname
                            ?.split(" ")
                            .map((name) => name[0])
                            .join("")
                            .toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <h2 className="card-title capitalize">{user.fullname}</h2>
                  <a
                    href={`mailto:${user?.email}`}
                    target="_blank"
                    title="Send email"
                    className="text-gray-500 font-medium"
                  >
                    {user?.email}
                  </a>
                  <div>
                    <div
                      className={`capitalize badge badge-sm font-semibold my-2 ${
                        usersRoleColors[user.role]
                      }`}
                    >
                      {user.role}
                    </div>

                    <div className="flex items-center gap-1 text-gray-500 ">
                      <RiPhoneLine size={16} />
                      <a
                        href={`tel:${user?.phone || ""}`}
                        className="font-medium text-sm"
                      >
                        {user.phone || "N/A"}
                      </a>
                    </div>

                    <div>
                      <p className="text-gray-500 font-medium">
                        Joined: {formatDate(user.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {loggedInUser?.role === "admin" && (
                <div className="mt-2 card-actions justify-end">
                  <button
                    className="btn btn-sm"
                    onClick={() => {
                      setIsOpen(true);
                      setUserId(user._id);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm bg-red-500 text-white"
                    onClick={() => {
                      setDeleteModalOpen(true);
                      setUserId(user._id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
              {isOpen && user._id === userId && (
                <UpdateUser
                  user={user}
                  onClose={() => setIsOpen(false)}
                  isOpen={isOpen}
                />
              )}
              {deleteModalOpen && user._id === userId && (
                <DeleteUser
                  user={user}
                  onClose={() => setDeleteModalOpen(false)}
                  isOpen={deleteModalOpen}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
