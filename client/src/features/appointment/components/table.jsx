import { useCallback, useState } from "react";
import usePaginate from "@/shared/hooks/usePaginate";
import { useOutletContext } from "react-router";
import {
  appointmentsStatusColors,
  appointmentsTableColumns,
  formatTextDate,
} from "@/shared/utils/constants";
import TableData from "@/shared/components/tableData";
import Paginate from "@/shared/components/paginate";
import { RiMoreLine } from "@remixicon/react";
import UpdateAppointment from "./updateAppointment";
import DeleteAppointment from "./deleteAppointment";

export default function Table({ appointments, meta }) {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [appointmentId, setAppointmentId] = useState(null);
  const { user: loggedInUser } = useOutletContext();
  const { handlePageChange, totalPages, hasMore, currentPage, limit } =
    usePaginate({
      totalPages: meta?.totalPages || 1,
      hasMore: meta?.hasMore || false,
      currentPage: meta?.currentPage || 1,
    });

  const tableColumns = appointmentsTableColumns.filter((column) => {
    if (column.uid === "action") {
      return loggedInUser?.role === "admin";
    }
    return true;
  });
  const renderCell = useCallback(
    (appointment, columnKey) => {
      const cellValue = appointment[columnKey];
      switch (columnKey) {
        case "patientName":
          return <div className="">{appointment?.patientId?.fullname}</div>;
        case "notes":
          return <div className="capitalize">{appointment?.notes}</div>;
        case "doctor":
          return (
            <div className="capitalize">
              {appointment?.doctorId?.fullname
                ? `Dr. ${appointment?.doctorId?.fullname}`
                : "N/A"}
            </div>
          );
        case "appointmentDate":
          return <div>{formatTextDate(appointment?.appointmentDate)}</div>;
        case "appointmentTime":
          return <div>{appointment?.appointmentTime}</div>;
        case "status":
          return (
            <div
              className={`capitalize badge font-semibold ${
                appointmentsStatusColors[appointment.status]
              }`}
            >
              {appointment.status}
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
                        setAppointmentId(appointment._id);
                      }}
                    >
                      Edit
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => {
                        setDeleteModalOpen(true);
                        setAppointmentId(appointment._id);
                      }}
                    >
                      Delete
                    </a>
                  </li>
                </ul>
              </div>
              {isOpen && appointment._id === appointmentId && (
                <UpdateAppointment
                  appointment={appointment}
                  onClose={() => setIsOpen(false)}
                  isOpen={isOpen}
                />
              )}
              {deleteModalOpen && appointment._id === appointmentId && (
                <DeleteAppointment
                  appointment={appointment}
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
    [appointmentId, deleteModalOpen, isOpen]
  );

  return (
    <>
      <TableData
        tableColumns={tableColumns}
        tableData={appointments}
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
