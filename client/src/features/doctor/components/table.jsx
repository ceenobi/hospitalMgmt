import TableData from "@/components/tableData";
import {
  doctorsAvailabilityColors,
  doctorsTableColumns,
} from "@/utils/constants";
import { useCallback, useState } from "react";
import { RiMoreLine } from "@remixicon/react";
import EditDoctor from "./editDoctor";
import DeleteDoctor from "./deleteDoctor";

export default function Table({ doc }) {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [doctorId, setDoctorId] = useState(null);
  const renderCell = useCallback(
    (doctor, columnKey) => {
      const cellValue = doctor[columnKey];
      switch (columnKey) {
        case "name":
          return (
            <div className="flex gap-2 items-center">
              <div className="avatar avatar-placeholder">
                <div className="w-10 rounded-full bg-gray-300">
                  {doctor?.userId?.avatar ? (
                    <img
                      src={doctor?.userId?.avatar}
                      alt={doctor?.userId?.fullname.split(" ")[0].charAt(0)}
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="text-md">
                      {doctor?.userId?.fullname
                        ?.split(" ")
                        .map((name) => name[0])
                        .join("")
                        .toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              <h1 className="font-bold">Dr. {doctor?.userId?.fullname}</h1>
            </div>
          );
        case "email":
          return (
            <a
              href={`mailto:${doctor?.userId?.email}`}
              target="_blank"
              title="Send email"
            >
              {doctor?.userId?.email}
            </a>
          );
        case "specialization":
          return <div>{doctor.specialization}</div>;
        case "phone":
          return <div>{doctor.userId?.phone || "N/A"}</div>;
        case "availability":
          return (
            <div
              className={`capitalize badge font-semibold ${
                doctorsAvailabilityColors[doctor.availability]
              }`}
            >
              {doctor.availability}
            </div>
          );
        case "action": {
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
                        setDoctorId(doctor._id);
                      }}
                    >
                      Edit
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => {
                        setDeleteModalOpen(true);
                        setDoctorId(doctor._id);
                      }}
                    >
                      Delete
                    </a>
                  </li>
                </ul>
              </div>
              {isOpen && doctor._id === doctorId && (
                <EditDoctor
                  doctor={doctor}
                  onClose={() => setIsOpen(false)}
                  isOpen={isOpen}
                />
              )}
              {deleteModalOpen && doctor._id === doctorId && (
                <DeleteDoctor
                  doctor={doctor}
                  onClose={() => setDeleteModalOpen(false)}
                  isOpen={deleteModalOpen}
                />
              )}
            </>
          );
        }
        default:
          return cellValue;
      }
    },
    [deleteModalOpen, doctorId, isOpen]
  );

  return (
    <div>
      <TableData
        tableColumns={doctorsTableColumns}
        tableData={doc}
        renderCell={renderCell}
      />
    </div>
  );
}
