import { RiSearchLine } from "@remixicon/react";

export default function DashboardNav({ user }) {
  return (
    <div className="mx-4 hidden bg-white lg:block lg:fixed top-0 right-0 z-30 left-[200px] xl:left-[240px]">
      <div className="container mx-auto py-[12px] border-b-[0.2px] border-gray-300">
        <div className="flex justify-between items-center">
          <label className="input">
            <RiSearchLine />
            <input type="search" className="grow" placeholder="Search" />
            <kbd className="kbd kbd-sm">⌘</kbd>
            <kbd className="kbd kbd-sm">K</kbd>
          </label>
          <div className="flex gap-2 items-center">
            <div className="avatar avatar-placeholder">
              <div className="w-10 rounded-full bg-gray-300 text-gray-600">
                {user?.avatar ? (
                  <img
                    src={user?.avatar}
                    alt={user?.fullname.split(" ")[0].charAt(0)}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="text-m">
                    {user?.fullname
                      ?.split(" ")
                      .map((name) => name[0])
                      .join("")
                      .toUpperCase()}
                  </span>
                )}
              </div>
            </div>
            <div>
              <h1 className="font-bold text-base">{user?.fullname}</h1>
              <p className="capitalize text-gray-500 text-sm">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
