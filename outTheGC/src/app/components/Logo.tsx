import Image from 'next/image';
import { Poppins } from 'next/font/google';

// Export the font instance so it can be imported by other components
export const poppins = Poppins({
  subsets: ['latin'],
  weight: ['600'],
});

export default function Logo() {
    return (
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
    );
}

