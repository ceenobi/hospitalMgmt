import Paginate from "@/shared/components/paginate";
import TableData from "@/shared/components/tableData";
import {
  formatDate,
  usersRoleColors,
  usersTableColumns,
} from "@/shared/utils/constants";
import { useCallback, useState } from "react";
import usePaginate from "@/shared/hooks/usePaginate";
import { RiMoreLine } from "@remixicon/react";
import UpdateUser from "./updateUser";
import DeleteUser from "./deleteUser";
import { useRouteLoaderData } from "react-router";

export default function Table({ users, meta }) {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userId, setUserId] = useState(null);
  const loggedInUser = useRouteLoaderData("auth_user");
  const { handlePageChange, totalPages, hasMore, currentPage, limit } =
    usePaginate({
      totalPages: meta?.totalPages || 1,
      hasMore: meta?.hasMore || false,
      currentPage: meta?.currentPage || 1,
    });

  const tableColumns = usersTableColumns.filter((column) => {
    if (column.uid === "action") {
      return loggedInUser?.role === "admin";
    }
    return true;
  });
  const renderCell = useCallback(
    (user, columnKey) => {
      const cellValue = user[columnKey];
      switch (columnKey) {
        case "name":
          return (
            <div className="flex gap-2 items-center">
              <div className="avatar avatar-placeholder">
                <div className="w-10 rounded-full bg-gray-300">
                  {user?.avatar ? (
                    <img
                      src={user?.avatar}
                      alt={user?.fullname.split(" ")[0].charAt(0)}
                      referrerPolicy="no-referrer"
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
              <h1 className="font-bold">{user?.fullname}</h1>
            </div>
          );
        case "email":
          return (
            <a
              href={`mailto:${user?.email}`}
              target="_blank"
              title="Send email"
            >
              {user?.email}
            </a>
          );
        case "role":
          return (
            <div className={`capitalize badge font-semibold ${usersRoleColors[user.role]}`}>
              {user.role}
            </div>
          );
        case "createdAt":
          return <div>{formatDate(user.createdAt)}</div>;
        case "action":
          return (
            <>
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-sm btn-ghost m-1"
                >
                  <RiMoreLine />
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu bg-base-100 rounded-box z-30 w-52 p-2 shadow-sm"
                >
                  <li>
                    <a
                      onClick={() => {
                        setIsOpen(true);
                        setUserId(user._id);
                      }}
                    >
                      Edit
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => {
                        setDeleteModalOpen(true);
                        setUserId(user._id);
                      }}
                    >
                      Delete
                    </a>
                  </li>
                </ul>
              </div>
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
            </>
          );
        default:
          return cellValue;
      }
    },
    [isOpen, userId, deleteModalOpen]
  );

  return (
    <div>
      <TableData
        tableColumns={tableColumns}
        tableData={users}
        renderCell={renderCell}
      />
      <Paginate
        totalPages={totalPages}
        hasMore={hasMore}
        handlePageChange={handlePageChange}
        currentPage={currentPage}
        limit={limit}
      />
    </div>
  );
}
