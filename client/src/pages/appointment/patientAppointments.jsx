import Filter from "@/features/appointment/components/filter";
import { PageWrapper } from "@/components/pageWrapper";
import Search from "@/components/search";
import { SkeletonTable } from "@/components/skeleton";
import { lazy, Suspense } from "react";
import { Await, useLoaderData } from "react-router";
import useMetaArgs from "@/hooks/useMeta";
import BookAppointment from "@/features/appointment/components/bookAppointment";
import Paginate from "@/components/paginate";
import usePaginate from "@/hooks/usePaginate";
const Table = lazy(() =>
  import("@/features/appointment/components/patientTable")
);

export function Component() {
  useMetaArgs({
    title: "Appointments - Clinicare",
    description: "Manage your appointments.",
    keywords: "Clinicare, appointments, account",
  });
  const data = useLoaderData();
  const { appointments, meta } = data?.data || {};
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
          <h1 className="font-bold text-2xl">Appointments</h1>
          <p className="text-gray-500">Manage your appointments</p>
        </div>
        <BookAppointment appointmentMeta={meta} />
      </div>
      <div className="mt-8 space-y-4 rounded-xl bg-white border border-slate-200 shadow">
        <div className="flex justify-end items-center p-4">
          {/* <h2 className="hidden md:block font-semibold">Appointments</h2> */}
          <Search id="search-appointments">
            <Filter />
          </Search>
        </div>
        <Suspense fallback={<SkeletonTable />}>
          <Await
            resolve={appointments}
            children={(appointments) => (
              <Table appointments={appointments} meta={meta} />
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

Component.displayName = "PatientAppointments";
