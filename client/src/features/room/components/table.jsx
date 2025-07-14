import Paginate from "@/shared/components/paginate";
import TableData from "@/shared/components/tableData";
import usePaginate from "@/shared/hooks/usePaginate";
import { roomsStatusColors, roomsTableColumns } from "@/shared/utils/constants";
import { RiMoreLine } from "@remixicon/react";
import { useCallback, useState } from "react";
import { useRouteLoaderData } from "react-router";
import UpdateRoom from "./updateRoom";
import DeleteRoom from "./deleteRoom";

export default function Table({ rooms, meta }) {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [roomId, setRoomId] = useState(null);
  const loggedInUser = useRouteLoaderData("auth_user");
  const { handlePageChange, totalPages, hasMore, currentPage, limit } =
    usePaginate({
      totalPages: meta?.totalPages || 1,
      hasMore: meta?.hasMore || false,
      currentPage: meta?.currentPage || 1,
    });

  const tableColumns = roomsTableColumns.filter((column) => {
    if (column.uid === "action") {
      return loggedInUser?.role === "admin";
    }
    return true;
  });

  const renderCell = useCallback(
    (room, columnKey) => {
      const cellValue = room[columnKey];
      switch (columnKey) {
        case "roomNumber":
          return (
            <div className="font-semibold">
              Room {room?.roomNumber} - {room?.roomDescription}
            </div>
          );
        case "roomType":
          return <div className="capitalize">{room.roomType}</div>;
        case "roomCapacity":
          return <div>{room.roomCapacity}</div>;
        case "roomPrice":
          return <div>{room.roomPrice}</div>;
        case "roomStatus":
          return (
            <div
              className={`capitalize badge font-semibold ${
                roomsStatusColors[room.roomStatus]
              }`}
            >
              {room.roomStatus}
            </div>
          );
        case "isFilled":
          return (
            <div
              className={`capitalize badge font-semibold ${
                room.isFilled
                  ? "bg-green-200 text-green-700"
                  : "bg-red-200 text-red-700"
              }`}
            >
              {room.isFilled ? "Filled" : "Not Filled"}
            </div>
          );
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
                        setRoomId(room._id);
                      }}
                    >
                      Edit
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => {
                        setDeleteModalOpen(true);
                        setRoomId(room._id);
                      }}
                    >
                      Delete
                    </a>
                  </li>
                </ul>
              </div>
              {isOpen && room._id === roomId && (
                <UpdateRoom
                  room={room}
                  onClose={() => setIsOpen(false)}
                  isOpen={isOpen}
                />
              )}
              {deleteModalOpen && room._id === roomId && (
                <DeleteRoom
                  room={room}
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
    [isOpen, roomId, deleteModalOpen]
  );

  return (
    <>
      <TableData
        tableColumns={tableColumns}
        tableData={rooms}
        renderCell={renderCell}
      />
      <Paginate
        totalPages={totalPages}
        hasMore={hasMore}
        handlePageChange={handlePageChange}
        currentPage={currentPage}
        limit={limit}
      />
    </>
  );
}
