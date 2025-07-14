import { RiBuilding2Fill } from "@remixicon/react";

export default function LazyLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen gap-1">
      <RiBuilding2Fill size={36} className="text-blue-500" />
      <h1 className={`font-bold text-black text-2xl`}>Clinicare</h1>
    </div>
  );
}
