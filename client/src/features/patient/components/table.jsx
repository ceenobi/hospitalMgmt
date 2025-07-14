import Paginate from "@/shared/components/paginate";
import TableData from "@/shared/components/tableData";
import {
  bloodGroupDisplay,
  formatTextDate,
  patientsTableColumns,
} from "@/shared/utils/constants";
import { useCallback, useState } from "react";
import usePaginate from "@/shared/hooks/usePaginate";
import { RiMoreLine } from "@remixicon/react";
import { useRouteLoaderData } from "react-router";
import ViewPatient from "./viewPatient";
import UpdatePatient from "./updatePatient";
import DeletePatient from "./deletePatient";

export default function Table({ patients, meta }) {
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [patientId, setPatientId] = useState(null);
  const loggedInUser = useRouteLoaderData("auth_user");
  const { handlePageChange, totalPages, hasMore, currentPage, limit } =
    usePaginate({
      totalPages: meta?.totalPages || 1,
      hasMore: meta?.hasMore || false,
      currentPage: meta?.currentPage || 1,
    });

  const tableColumns = patientsTableColumns.filter((column) => {
    if (column.uid === "action") {
      return loggedInUser?.role === "admin";
    }
    return true;
  });

  const renderCell = useCallback(
    (patient, columnKey) => {
      const cellValue = patient[columnKey];
      switch (columnKey) {
        case "name":
          return (
            <div>
              <h1 className="font-bold">{patient?.fullname}</h1>
              <a
                href={`mailto:${patient?.email}`}
                target="_blank"
                title="Send email"
              >
                {patient?.email}
              </a>
            </div>
          );
        case "gender":
          return <div className="capitalize">{patient.gender}</div>;
        case "dateOfBirth":
          return <div>{formatTextDate(patient.dateOfBirth)}</div>;
        case "address":
          return <div>{patient.address}</div>;
        case "bloodGroup":
          return <div>{bloodGroupDisplay[patient.bloodGroup]}</div>;
        case "phone":
          return <div>{patient.phone}</div>;
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
                        setIsViewOpen(true);
                        setPatientId(patient._id);
                      }}
                    >
                      View
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => {
                        setIsOpen(true);
                        setPatientId(patient._id);
                      }}
                    >
                      Edit
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => {
                        setDeleteModalOpen(true);
                        setPatientId(patient._id);
                      }}
                    >
                      Delete
                    </a>
                  </li>
                </ul>
              </div>
              {isViewOpen && patient._id === patientId && (
                <ViewPatient
                  patient={patient}
                  onClose={() => setIsViewOpen(false)}
                  isOpen={isViewOpen}
                />
              )}
              {isOpen && patient._id === patientId && (
                <UpdatePatient
                  patient={patient}
                  onClose={() => setIsOpen(false)}
                  isOpen={isOpen}
                />
              )}
              {deleteModalOpen && patient._id === patientId && (
                <DeletePatient
                  patient={patient}
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
    [deleteModalOpen, isOpen, isViewOpen, patientId]
  );

  return (
    <>
      <TableData
        tableColumns={tableColumns}
        tableData={patients}
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
