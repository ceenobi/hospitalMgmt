import { PageWrapper } from "@/components/pageWrapper";
import AddInPatient from "@/features/inpatients/components/AddInPatient";
import useMetaArgs from "@/hooks/useMeta";

export function Component() {
  useMetaArgs({
    title: "Inpatients - Clinicare",
    description: "Manage your inpatients.",
    keywords: "Clinicare, inpatients, account",
  });
  return (
    <PageWrapper>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-bold text-2xl">Inpatients</h1>
          <p className="text-gray-500">Manage your inpatients</p>
        </div>
        <AddInPatient />
      </div>
    </PageWrapper>
  );
}

Component.displayName = "Inpatients";
