import useMetaArgs from "@/shared/hooks/useMeta";
import Container from "@/shared/components/container";
import { Suspense, lazy } from "react";
import { SkeletonTable } from "@/shared/components/skeleton";
import { Await, useLoaderData } from "react-router";
import Search from "@/shared/components/search";
import Filter from "@/features/patient/components/filter";
import AddPatient from "@/features/patient/components/addPatient";
const Table = lazy(() => import("@/features/patient/components/table"));

export function Component() {
  useMetaArgs({
    title: "Patients - Clinicare",
    description: "Manage your patients.",
    keywords: "Clinicare, patients, account",
  });
  const data = useLoaderData();
  const { meta, patients } = data?.data || {};
  return (
    <Container>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-bold text-2xl">Patients</h1>
          <p className="text-gray-500">Manage your patients</p>
        </div>
        <AddPatient />
      </div>
      <div className="mt-8 space-y-4 rounded-lg border-[0.2px] border-gray-500">
        <div className="flex justify-between items-center p-4">
          <h2 className="hidden md:block font-semibold">Patients</h2>
          <Search id="search-patients">
            <Filter />
          </Search>
        </div>
        <Suspense fallback={<SkeletonTable />}>
          <Await resolve={data}>
            <Table patients={patients} meta={meta} />
          </Await>
        </Suspense>
      </div>
    </Container>
  );
}

Component.displayName = "Patient";
