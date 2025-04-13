// import Navigation from '@/components/Navigation';
import { HiPlus } from "react-icons/hi";
import Link from 'next/link';
import { Poppins } from 'next/font/google';
import Navbar from '../components/Navbar';
import Image from 'next/image';
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['600'],
});

export default function GroupsPage() {
  // Sample group data
  const groups = [
    {
      id: 1,
      name: "Bitcamp 2025",
      description: "Planning group for Bitcamp hackathon",
      memberCount: 4
    },
    {
      id: 2,
      name: "Best Friends!",
      description: "Spring break trip to New York for the girls ❤️",
      memberCount: 6
    },
    {
      id: 3,
      name: "Family Reunion",
      description: "Yearly Smith family reunion -- please keep grandparents up to date",
      memberCount: 20
    }
  ];

  return (
    <div className="min-h-screen relative bg-white">

      {/** Navigation Bar - Placeholder **/}
      <Navbar />
      
      {/** Main Body **/}
      <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold ${poppins.className} text-[#F4A460] [text-shadow:_1px_1px_2px_rgb(0_0_0_/_20%)] ml-[125px]`}>
              Groups
          </h1>
          
          <div className="top-[45px] flex items-center">
            <Image
              src="/component/logo.png"
              alt="OutTheGC Logo"
              width={140}
              height={140}
              className="w-50 h-50"
            />
            <div className="flex flex-col mr-4">
              <h1 className={`text-5xl font-bold ${poppins.className} text-[#F4A460] [text-shadow:_1px_1px_2px_rgb(0_0_0_/_20%)]`}>
                OutTheGC 
              </h1>
              <p className={`${poppins.className} text-[#F4A460] mt-2 [text-shadow:_1px_1px_2px_rgb(0_0_0_/_20%)]`}>
                making moves, for real.
              </p>
            </div>
          </div>
        </div>

        {/** Group Cards **/}
        <div className="ml-[125px] mx-4 sm:mx-[45px] p-4 sm:p-6 md:p-8">
          <div className="bg-gradient-to-b from-[#F4C998] to-[#F7AE5A] rounded-[32px] p-4 sm:p-6 md:p-8 min-h-[600px]">
            {/** Individual Cards **/}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {groups.map((group) => (
                <Link href={`/groups/${group.id}`} key={group.id} 
                  className="block bg-[#FFF5EE]/75 backdrop-blur-sm rounded-[24px] shadow-sm p-4 sm:p-6 md:p-8 mt-[65px] mx-[5px] hover:shadow-md transition-shadow no-underline text-inherit">
                  <div className="h-[150px] flex flex-col justify-between items-center text-center mx-[10px]">
                    <div>
                      <h3 className={`text-xl sm:text-2xl md:text-[25px] font-semibold mb-2 ${poppins.className} text-[#F4A460]`}>
                        {group.name}
                      </h3>
                      <p className={`text-xs sm:text-sm text-[#333333]/50  ${poppins.className} line-clamp-2`}>
                        {group.description}
                      </p>
                    </div>
                    <span className={`text-xs sm:text-sm text-[#333333]/50 mt-[20px] mb-[20px] ${poppins.className}`}>
                      {group.memberCount} members
                    </span>
                  </div>
                </Link>
              ))}
              
              {/* Create New Group Card */}
              <Link href="/groups/create" 
                className="block rounded-[24px] border-2 border-[#FFF5EE]/75 bg-transparent p-4 sm:p-6 md:p-8 mt-[65px] mx-[5px] flex items-center justify-center hover:bg-[#FFF5EE]/10 transition-colors no-underline text-inherit">
                <div className="flex items-center justify-center h-[150px] w-auto">
                  <HiPlus className="h-[80px] sm:h-[100px] w-6 sm:w-8 text-[#FFF5EE]/75 mx-auto" />
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Empty space below cards - flex-col on parent handles this */}
        <div className="flex-grow"></div>
      </main>
    </div>
  );
}