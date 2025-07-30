import { PageWrapper } from "@/components/pageWrapper";
import useMetaArgs from "@/hooks/useMeta";
import AddRoom from "@/features/room/components/addRoom";
import { Await, useRouteLoaderData } from "react-router";
import Search from "@/components/search";
import { Suspense, lazy } from "react";
import Filter from "@/features/room/components/filter";
import { SkeletonTable } from "@/components/skeleton";
import usePaginate from "@/hooks/usePaginate";
import Paginate from "@/components/paginate";
const Table = lazy(() => import("@/features/room/components/table"));

export function Component() {
  useMetaArgs({
    title: "Rooms - Clinicare",
    description: "Manage your rooms.",
    keywords: "Clinicare, rooms, account",
  });
  const data = useRouteLoaderData("room_data");
  const { roomMeta, roomsData } = data || {};
  const { rooms, meta } = roomsData?.data || {};
  const { handlePageChange, totalPages, hasMore, currentPage, limit } =
    usePaginate({
      totalPages: meta?.totalPages || 1,
      hasMore: meta?.hasMore || false,
      currentPage: meta?.currentPage || 1,
    });

  return (
    <PageWrapper>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-bold text-2xl">Rooms</h1>
          <p className="text-gray-500">Manage your rooms</p>
        </div>
        <AddRoom roomMeta={roomMeta} />
      </div>
      <div className="mt-8 space-y-4 rounded-xl bg-white border border-slate-200 shadow">
        <div className="flex justify-end items-center p-4">
          {/* <h2 className="hidden md:block font-semibold">Rooms</h2> */}
          <Search id="search-rooms">
            <Filter />
          </Search>
        </div>
        <Suspense fallback={<SkeletonTable />}>
          <Await
            resolve={rooms}
            children={(rooms) => <Table rooms={rooms} meta={meta} />}
          />
          {/* <Await resolve={roomsData}>
            <Table rooms={rooms} meta={meta} />
          </Await> */}
        </Suspense>
      </div>
      <Paginate
        totalPages={totalPages}
        hasMore={hasMore}
        handlePageChange={handlePageChange}
        currentPage={currentPage}
        limit={limit}
      />
    </PageWrapper>
  );
}

Component.displayName = "Room";
