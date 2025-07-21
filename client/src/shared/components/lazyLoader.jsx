import { RiBuilding2Fill } from "@remixicon/react";

export default function LazyLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen gap-2">
      <div className="flex items-center gap-1">
        <RiBuilding2Fill size={28} className="text-blue-500" />
        <h1 className={`font-bold text-zinc-800 text-xl`}>Clinicare</h1>
      </div>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  );
}
