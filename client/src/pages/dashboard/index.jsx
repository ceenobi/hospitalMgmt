import { PageWrapper } from "@/components/pageWrapper";
import useMetaArgs from "@/hooks/useMeta";

export function Component() {
  useMetaArgs({
    title: "Dashboard - Clinicare",
    description: "Manage your patients.",
    keywords: "Clinicare, dashboard, account",
  });
  return (
    <PageWrapper>
      <div>
        <h1 className="font-bold text-2xl">Dashboard</h1>
        <p className="text-gray-500">Manage your patients</p>
      </div>
    </PageWrapper>
  );
}

Component.displayName = "Dashboard";
