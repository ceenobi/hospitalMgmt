import { PageWrapper } from "@/components/pageWrapper";
import AddUser from "@/features/user/components/addUser";
import useMetaArgs from "@/hooks/useMeta";
import { Await, useLoaderData } from "react-router";
import Search from "@/components/search";
import { lazy, Suspense, useState } from "react";
import { SkeletonTable } from "@/components/skeleton";
import Filter from "@/features/user/components/filter";
import { RiLayoutColumnLine, RiLayoutRowLine } from "@remixicon/react";
const Table = lazy(() => import("@/features/user/components/table"));
const Card = lazy(() => import("@/features/user/components/card"));

export function Component() {
  useMetaArgs({
    title: "User",
    description: "User",
    keywords: "Clinicare, user, account",
  });
  const [tableView, setTableView] = useState(false);
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
      <div className="mt-8 space-y-4 ">
        <div
          className={`flex justify-between items-center ${
            tableView ? "" : "p-4"
          }`}
        >
          <button
            onClick={() => setTableView(!tableView)}
            className="flex gap-1 items-center text-gray-500 cursor-pointer"
            type="button"
          >
            {tableView ? <RiLayoutColumnLine /> : <RiLayoutRowLine />}
            {tableView ? "Table View" : "Card View"}
          </button>
          <Search id="search-users">
            <Filter />
          </Search>
        </div>
        <Suspense fallback={<SkeletonTable />}>
          {tableView ? (
            <Await
              resolve={users}
              children={(users) => <Table users={users} meta={meta} />}
            />
          ) : (
            <>
              {users?.length > 0 ? (
                <Await
                  resolve={users}
                  children={(users) => <Card users={users} meta={meta} />}
                />
              ) : (
                <p className="my-10 text-center text-gray-500">
                  No users found
                </p>
              )}
            </>
          )}
        </Suspense>
      </div>
    </PageWrapper>
  );
}

Component.displayName = "User";
