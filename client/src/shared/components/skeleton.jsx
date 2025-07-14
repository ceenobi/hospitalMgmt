import React from "react";

export function SkeletonTable() {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Specialization</th>
            <th>Phone</th>
            <th>Availability</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
            <div className="skeleton h-4 w-20"></div>
            </td>
            <td>
            <div className="skeleton h-4 w-20"></div>
            </td>
            <td>
            <div className="skeleton h-4 w-20"></div>
            </td>
            <td>
            <div className="skeleton h-4 w-20"></div>
            </td>
            <td>
            <div className="skeleton h-4 w-20"></div>
            </td>
            <td>
            <div className="skeleton h-4 w-20"></div>
            </td>
            <td>
            <div className="skeleton h-4 w-20"></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
