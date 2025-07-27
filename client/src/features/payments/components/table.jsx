import Paginate from "@/components/paginate";
import TableData from "@/components/tableData";
import usePaginate from "@/hooks/usePaginate";
import {
  formatCurrency,
  formatTextDate,
  paymentsStatusColors,
  paymentsTableColumns,
} from "@/utils/constants";
import { RiMoreLine } from "@remixicon/react";
import { useCallback, useState } from "react";
import UpdatePayment from "./updatePayment";
import DeletePayment from "./deletePayment";

export default function Table({ payments, meta }) {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [paymentId, setPaymentId] = useState(null);
  const { handlePageChange, totalPages, hasMore, currentPage, limit } =
    usePaginate({
      totalPages: meta?.totalPages || 1,
      hasMore: meta?.hasMore || false,
      currentPage: meta?.currentPage || 1,
    });
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
          return <p>{formatTextDate(payment?.paymentDate) || "Not available"}</p>;
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
                        setPaymentId(payment._id);
                      }}
                    >
                      Edit
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={() => {
                        setDeleteModalOpen(true);
                        setPaymentId(payment._id);
                      }}
                    >
                      Delete
                    </a>
                  </li>
                </ul>
              </div>
              {isOpen && payment._id === paymentId && (
                <UpdatePayment
                  payment={payment}
                  onClose={() => setIsOpen(false)}
                  isOpen={isOpen}
                />
              )}
              {deleteModalOpen && payment._id === paymentId && (
                <DeletePayment
                  payment={payment}
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
    [deleteModalOpen, isOpen, paymentId]
  );

  return (
    <>
      <TableData
        tableColumns={paymentsTableColumns}
        tableData={payments}
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
