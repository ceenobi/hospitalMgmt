import { sortRoomMethods } from "@/utils/sortMethods";
import { RiFilterLine } from "@remixicon/react";
import { useState } from "react";
import { useSearchParams, useRouteLoaderData } from "react-router";

export default function Filter() {
  const data = useRouteLoaderData("room_data");
  const { roomMeta } = data || {};
  const { roomType, roomStatus } = roomMeta?.data || {};
  const [openOptions, setOpenOptions] = useState(false);
  const [filters, setFilters] = useState({
    roomType: "",
    roomStatus: "",
    sort: "",
  });
  const [searchParams, setSearchParams] = useSearchParams();

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const updatedSearchParams = new URLSearchParams(searchParams);
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        updatedSearchParams.set(key, value);
      } else {
        updatedSearchParams.delete(key);
      }
    });
    setSearchParams(updatedSearchParams);
    setOpenOptions(false);
  };

  const handleClearFilters = () => {
    setFilters({
      roomType: "",
      roomStatus: "",
      sort: "",
    });
    const params = new URLSearchParams(searchParams);
    params.delete("roomType");
    params.delete("bloodGroup");
    params.delete("sort");
    setSearchParams(params);
    setOpenOptions(false);
  };

  return (
    <>
      <div
        className={`dropdown dropdown-end ${
          openOptions ? "dropdown-open" : ""
        }`}
      >
        <div
          tabIndex={0}
          role="button"
          className="btn m-1 border-[0.1px] border-gray-400"
        >
          <RiFilterLine className="text-gray-500" />
        </div>
        <div
          tabIndex={0}
          className="dropdown-content menu bg-base-100 border-[0.2px] border-gray-400 rounded-box z-1 w-[250px] md:w-[300px] p-4 shadow-sm"
        >
          <div className="flex flex-col">
            <h1 className="text-lg font-bold mb-4">Apply filters</h1>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-2 space-y-4">
                <select
                  value={filters.roomType}
                  onChange={(e) => handleFilterChange("roomType", e.target.value)}
                  className="select capitalize"
                >
                  <option value="" disabled={true}>
                    Select Room Type
                  </option>
                  {roomType?.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <select
                  value={filters.roomStatus}
                  onChange={(e) =>
                    handleFilterChange("roomStatus", e.target.value)
                  }
                  className="select capitalize"
                >
                  <option value="" disabled={true}>
                    Select Room Status
                  </option>
                  {roomStatus?.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange("sort", e.target.value)}
                  className="select capitalize"
                >
                  <option value="" disabled={true}>
                    Sort Rooms
                  </option>
                  {Object.keys(sortRoomMethods)?.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={handleClearFilters}
                    className="btn btn-outline border-[0.1px] border-gray-400"
                  >
                    Clear Filters
                  </button>
                  <button
                    type="submit"
                    className="btn bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
