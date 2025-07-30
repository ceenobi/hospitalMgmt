import { useCallback } from "react";
import { useOutletContext } from "react-router";
import {
  appointmentsStatusColors,
  appointmentsTableColumns,
  formatTextDate,
} from "@/utils/constants";
import TableData from "@/components/tableData";

export default function PatientTable({ appointments }) {
  const { user: loggedInUser } = useOutletContext();
  const tableColumns = appointmentsTableColumns.filter((column) => {
    if (column.uid === "action") {
      return loggedInUser?.role === "admin";
    }
    if (column.uid === "patientName") {
      return false;
    }
    return true;
  });
  const renderCell = useCallback((appointment, columnKey) => {
    const cellValue = appointment[columnKey];
    switch (columnKey) {
      case "notes":
        return <div className="capitalize">{appointment?.notes}</div>;
      case "doctor":
        return (
          <div className="capitalize">
            {appointment?.doctorId?.fullname
              ? `Dr. ${appointment?.doctorId?.fullname}`
              : "Not assigned"}
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
      default:
        return cellValue;
    }
  }, []);

  return (
    <>
      <TableData
        tableColumns={tableColumns}
        tableData={appointments}
        renderCell={renderCell}
      />
    </>
  );
}
