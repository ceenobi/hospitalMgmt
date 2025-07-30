import useMetaArgs from "@/hooks/useMeta";
import { PageWrapper } from "@/components/pageWrapper";
import { Suspense, lazy } from "react";
import { SkeletonTable } from "@/components/skeleton";
import { Await, useLoaderData } from "react-router";
import Search from "@/components/search";
import Filter from "@/features/patient/components/filter";
import AddPatient from "@/features/patient/components/addPatient";
import Paginate from "@/components/paginate";
import usePaginate from "@/hooks/usePaginate";
const Table = lazy(() => import("@/features/patient/components/table"));

export function Component() {
  useMetaArgs({
    title: "Patients - Clinicare",
    description: "Manage your patients.",
    keywords: "Clinicare, patients, account",
  });
  const data = useLoaderData();
  const { meta, patients } = data?.data || {};
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
          <h1 className="font-bold text-2xl">Patients</h1>
          <p className="text-gray-500">Manage your patients</p>
        </div>
        <AddPatient />
      </div>
      <div className="mt-8 space-y-4 rounded-xl bg-white border border-slate-200 shadow">
        <div className="flex justify-end items-center p-4">
          {/* <h2 className="hidden md:block font-semibold">Patients</h2> */}
          <Search id="search-patients">
            <Filter />
          </Search>
        </div>
        <Suspense fallback={<SkeletonTable />}>
          <Await
            resolve={patients}
            children={(patients) => <Table patients={patients} />}
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

Component.displayName = "Patient";
