import Container from "@/shared/components/container";
import { Await, useRouteLoaderData } from "react-router";
import AddDoctor from "@/features/doctor/components/addDoctor";
import useMetaArgs from "@/shared/hooks/useMeta";
import { lazy, Suspense } from "react";
import { SkeletonTable } from "@/shared/components/skeleton";
import Search from "@/shared/components/search";
import Filter from "@/features/doctor/components/filter";
const Table = lazy(() => import("@/features/doctor/components/table"));

export function Component() {
  useMetaArgs({
    title: "Doctors - Clinicare",
    description: "Manage your doctors.",
    keywords: "Clinicare, doctors, account",
  });
  const { meta, doctors } = useRouteLoaderData("doctor_users");

  return (
    <Container>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-bold text-2xl">Doctors</h1>
          <p className="text-gray-500">Manage your doctors</p>
        </div>
        <AddDoctor meta={meta?.data?.meta} users={meta?.data?.users} />
      </div>
      <div className="mt-8 space-y-4 rounded-lg border-[0.2px] border-gray-300 shadow">
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
    </Container>
  );
}

Component.displayName = "Doctor";
