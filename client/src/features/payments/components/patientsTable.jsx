import TableData from "@/components/tableData";
import {
  formatCurrency,
  formatTextDate,
  paymentsStatusColors,
  paymentsTableColumns,
} from "@/utils/constants";
import { RiUploadCloudLine } from "@remixicon/react";
import { useCallback, useState } from "react";
import UploadPayment from "./uploadPayment";

export default function PatientsTable({ payments }) {
  const [isOpen, setIsOpen] = useState(false);
  const [paymentId, setPaymentId] = useState(null);
  const renderCell = useCallback(
    (payment, columnKey) => {
      const cellValue = payment[columnKey];
      switch (columnKey) {
        case "patient":
          return <p>{payment?.patientId?.fullname}</p>;
        case "doctor":
          return (
            <p className="capitalize">
              {payment?.doctorId?.fullname
                ? `Dr. ${payment?.doctorId?.fullname}`
                : "Not assigned"}
            </p>
          );
        case "notes":
          return <p className="capitalize">{payment?.notes}</p>;
        case "amount":
          return (
            <p className="capitalize">{formatCurrency(payment?.amount)}</p>
          );
        case "paymentDate":
          return (
            <p>
              {payment?.paymentDate
                ? formatTextDate(payment?.paymentDate)
                : "Not available"}
            </p>
          );
        case "receipt":
          return (
            <a
              href={payment?.receipt}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 hover:underline"
            >
              {payment?.receipt ? "View" : "Not available"}
            </a>
          );
        case "status":
          return (
            <p
              className={`capitalize badge font-semibold ${
                paymentsStatusColors[payment.status]
              }`}
            >
              {payment.status}
            </p>
          );
        case "action":
          return (
            <>
              <button
                onClick={() => {
                  setIsOpen(true);
                  setPaymentId(payment._id);
                }}
                className="flex items-center gap-1 hover:underline cursor-pointer"
                type="button"
              >
                <RiUploadCloudLine
                  size={16}
                  className={payment?.receipt ? "text-green-500" : ""}
                />
                {payment?.receipt ? "Update receipt" : "Upload receipt"}
              </button>
              {isOpen && payment._id === paymentId && (
                <UploadPayment
                  payment={payment}
                  onClose={() => setIsOpen(false)}
                  isOpen={isOpen}
                />
              )}
            </>
          );
        default:
          return cellValue;
      }
    },
    [isOpen, paymentId]
  );
  return (
    <>
      <TableData
        tableColumns={paymentsTableColumns}
        tableData={payments}
        renderCell={renderCell}
      />
    </>
  );
}
