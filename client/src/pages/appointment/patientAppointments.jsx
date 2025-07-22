import Filter from "@/features/appointment/components/filter";
import { PageWrapper } from "@/components/pageWrapper";
import Search from "@/components/search";
import { SkeletonTable } from "@/components/skeleton";
import { lazy, Suspense } from "react";
import { Await, useLoaderData } from "react-router";
import useMetaArgs from "@/hooks/useMeta";
import BookAppointment from "@/features/appointment/components/bookAppointment";
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

  return (
    <PageWrapper>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-bold text-2xl">Appointments</h1>
          <p className="text-gray-500">Manage your appointments</p>
        </div>
        <BookAppointment appointmentMeta={meta} />
      </div>
      <div className="mt-8 space-y-4 rounded-lg border-[0.2px] border-gray-300 shadow">
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
    </PageWrapper>
  );
}

Component.displayName = "PatientAppointments";
