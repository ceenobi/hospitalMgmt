import { PageWrapper } from "@/components/pageWrapper";
import AddUser from "@/features/user/components/addUser";
import useMetaArgs from "@/hooks/useMeta";
import { Await, useLoaderData } from "react-router";
import Search from "@/components/search";
import { lazy, Suspense } from "react";
import { SkeletonTable } from "@/components/skeleton";
import Filter from "@/features/user/components/filter";
const Table = lazy(() => import("@/features/user/components/table"));

export function Component() {
  useMetaArgs({
    title: "User",
    description: "User",
    keywords: "Clinicare, user, account",
  });
  const data = useLoaderData();
  const { meta, users } = data?.data || {};
  return (
    <PageWrapper>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-bold text-2xl">User Data</h1>
          <p className="text-gray-500">Manage your list of users</p>
        </div>
        <AddUser />
      </div>
      <div className="mt-8 space-y-4 rounded-lg border-[0.2px] border-gray-300">
        <div className="flex justify-end items-center p-4">
          {/* <h2 className="hidden md:block font-semibold">Users</h2> */}
          <Search id="search-users">
            <Filter />
          </Search>
        </div>
        <Suspense fallback={<SkeletonTable />}>
          <Await
            resolve={users}
            children={(users) => <Table users={users} meta={meta} />}
          />
        </Suspense>
      </div>
    </PageWrapper>
  );
}

Component.displayName = "User";
