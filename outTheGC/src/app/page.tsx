import Link from 'next/link';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['600'],
});

export default function Home() {
  const textShadowStyle = {
    textShadow: `
<<<<<<< Updated upstream
      0 4px 4px rgba(0,0,0,0.45),
      2px 2px 2px rgba(247, 174, 90, 0.8),
      -1px -1px 1px rgba(247, 174, 90, 0.4),
      0 8px 12px rgba(0,0,0,0.25)
=======
      2px -1px 3px rgba(247, 174, 90, 0.4)
>>>>>>> Stashed changes
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

  return (
    <main className="min-h-screen bg-white relative">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 p-8 flex justify-end items-center gap-8 z-10">
        <Link 
          href="/signup" 
          className={`${poppins.className} text-2xl font-semibold hover:opacity-80 transition-opacity`}
          style={signUpStyle}
        >
          Sign Up
        </Link>
        <Link
          href="/login"
          className="w-[135px] h-[60px] flex items-center justify-center rounded-[20px] hover:opacity-90 transition-opacity"
          style={buttonGradient}
        >
          <span 
            className={`${poppins.className} text-2xl font-semibold text-white`}
          >
            Log In
          </span>
        </Link>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center space-y-6">
          <h1 
            className={`${poppins.className} text-[96px] leading-none font-bold`}
            style={textShadowStyle}
          >
            OutTheGC
          </h1>
          <p 
            className={`${poppins.className} text-[40px] leading-tight font-bold`}
            style={textShadowStyle}
          >
            making moves, for real.
          </p>
        </div>
      </div>
    </main>
  );
}
