import Filter from "@/features/appointment/components/filter";
import Container from "@/shared/components/container";
import Search from "@/shared/components/search";
import { SkeletonTable } from "@/shared/components/skeleton";
import { lazy, Suspense } from "react";
import { Await, useLoaderData } from "react-router";
import useMetaArgs from "@/shared/hooks/useMeta";
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
    <Container>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-bold text-2xl">Appointments</h1>
          <p className="text-gray-500">Manage your appointments</p>
        </div>
        <BookAppointment appointmentMeta={meta} />
      </div>
      <div className="mt-8 space-y-4 rounded-lg border-[0.2px] border-gray-500">
        <div className="flex justify-between items-center p-4">
          <h2 className="hidden md:block font-semibold">Appointments</h2>
          <Search id="search-appointments">
            <Filter />
          </Search>
        </div>
        <Suspense fallback={<SkeletonTable />}>
          <Await resolve={data}>
            <Table appointments={appointments} meta={meta} />
          </Await>
        </Suspense>
      </div>
    </Container>
  );
}

Component.displayName = "PatientAppointments";
