import { PageWrapper } from "@/components/pageWrapper";
import { Await, useRouteLoaderData } from "react-router";
import AddDoctor from "@/features/doctor/components/addDoctor";
import useMetaArgs from "@/hooks/useMeta";
import { lazy, Suspense } from "react";
import { SkeletonTable } from "@/components/skeleton";
import Search from "@/components/search";
import Filter from "@/features/doctor/components/filter";
import Paginate from "@/components/paginate";
import usePaginate from "@/hooks/usePaginate";
const Table = lazy(() => import("@/features/doctor/components/table"));

export function Component() {
  useMetaArgs({
    title: "Doctors - Clinicare",
    description: "Manage your doctors.",
    keywords: "Clinicare, doctors, account",
  });
  const { meta, doctors } = useRouteLoaderData("doctor_users");
  const { handlePageChange, totalPages, hasMore, currentPage, limit } =
    usePaginate({
      totalPages: doctors?.data?.meta?.totalPages || 1,
      hasMore: doctors?.data?.meta?.hasMore || false,
      currentPage: doctors?.data?.meta?.currentPage || 1,
    });

  return (
    <PageWrapper>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-bold text-2xl">Doctors</h1>
          <p className="text-gray-500">Manage your doctors</p>
        </div>
        <AddDoctor meta={meta?.data?.meta} users={meta?.data?.users} />
      </div>
      <div className="mt-8 space-y-4 rounded-xl bg-white border border-slate-200 shadow">
        <div className="flex justify-end items-center p-4">
          {/* <h2 className="hidden md:block font-semibold">Doctors</h2> */}
          <Search id="search-doctors">
            <Filter />
          </Search>
        </div>
        <Suspense fallback={<SkeletonTable />}>
          <Await
            resolve={doctors}
            children={(doctors) => (
              <Table doc={doctors?.data?.doctors} meta={doctors?.data?.meta} />
            )}
          />
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

Component.displayName = "Doctor";
