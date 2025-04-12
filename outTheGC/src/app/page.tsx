import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <nav className="p-4 flex justify-end">
        <button className="mr-4 text-[#F4A460] hover:text-[#E38B4F] font-medium">
          Sign Up
        </button>
        <button className="px-6 py-2 rounded-lg bg-[#F4A460] text-white hover:bg-[#E38B4F] transition-colors">
          Log In
        </button>
      </nav>
      
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
        <h1 className="text-6xl font-bold mb-4 text-[#F4A460]">
          OutTheGC
        </h1>
        <p className="text-xl text-[#F4A460]">
          making moves, for real.
        </p>
      </div>
    </main>
  );
}
