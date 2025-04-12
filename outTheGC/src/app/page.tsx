import Link from 'next/link';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['600'],
});

export default function Home() {
  const textShadowStyle = {
    textShadow: `
      0 4px 4px rgba(0,0,0,0.45),
      2px 2px 2px rgba(247, 174, 90, 0.8),
      -1px -1px 1px rgba(247, 174, 90, 0.4),
      0 8px 12px rgba(0,0,0,0.25)
    `,
    color: '#F7AE5A'
  };

  const buttonGradient = {
    background: 'linear-gradient(180deg, #F4C998 0%, #F7AE5A 100%)'
  };

  const signUpStyle = {
    color: '#F4C998',
    textShadow: '0px -1px 1px rgba(255, 255, 255, 0.8)'
  };

  const loginTextStyle = {
    color: 'white !important'
  };

  return (
    <main className="min-h-screen relative bg-white">
      <div className="absolute top-[45px] flex items-center gap-6">
        <Link 
          href="/signup" 
          className={`absolute left-[1300px] ${poppins.className} text-[24px] leading-[1] whitespace-nowrap font-semibold`}
          style={signUpStyle}
        >
          Sign Up
        </Link>
        <Link
          href="/login"
          className="absolute left-[1450px] w-[135px] h-[60px] flex items-center justify-center rounded-[20px] hover:opacity-90 transition-opacity"
          style={buttonGradient}
        >
          <span 
            className={`${poppins.className} text-[24px] leading-none tracking-[0%] font-semibold w-[71px] h-[29px] flex items-center justify-center`}
            style={loginTextStyle}
          >
            Log In
          </span>
        </Link>
      </div>
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%]">
        <h1 
          className="font-inter text-[96px] leading-none tracking-[0%] font-bold text-center"
          style={textShadowStyle}
        >
          OutTheGC
        </h1>
      </div>
      
      <div className="absolute top-[52%] left-1/2 -translate-x-1/2">
        <p 
          className="font-inter text-[40px] leading-none tracking-[0%] font-bold text-center"
          style={textShadowStyle}
        >
          making moves, for real.
        </p>
      </div>
    </main>
  );
}
