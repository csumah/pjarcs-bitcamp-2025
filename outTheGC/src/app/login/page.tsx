'use client';

import { initializeApp, getApps } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthContext } from '@/context/AuthContext';

const firebaseConfig = {
  apiKey: "AIzaSyDNHMcO-H4DhtwPsEJj6xBjizMIc0CJLdE",
  authDomain: "outthegc-b7d57.firebaseapp.com",
  projectId: "outthegc-b7d57",
  storageBucket: "outthegc-b7d57.firebasestorage.app",
  messagingSenderId: "946285754424",
  appId: "1:946285754424:web:c42ee6d3eb8dd8a3a54ecd",
  measurementId: "G-FTT720QDHP"
};

// Initialize Firebase only if it hasn't been initialized
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthContext();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      if (user) {
        // Store user in context and localStorage
        login(user);
        
        // Store any additional user data you want to persist
        localStorage.setItem('userPreferences', JSON.stringify({
          lastLogin: new Date().toISOString(),
          // Add any other user preferences you want to store
        }));

        router.push('/homepage');
      }
    } catch (error: any) {
      console.error('Error signing in with Google:', error.message);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="absolute top-0 left-0">
        <Image
          src="/component/logo.png"
          alt="OutTheGC Logo"
          width={100}
          height={100}
          className="w-40 h-40"
        />
      </div>
      <div className="bg-gradient-to-b from-[#F4C998] to-[#F7AE5A] rounded-2xl p-12 shadow-2xl w-[500px] text-center transform hover:shadow-3xl transition-all duration-300">
        
        <h1 className="text-6xl font-bold text-white mb-4">OutTheGC</h1>
        <p className="text-2xl text-white mb-12">making moves, for real.</p>
        
        <button
          onClick={handleGoogleSignIn}
          className="flex items-center justify-center w-full bg-white text-[#F4A460] px-6 py-3 rounded-xl hover:bg-[#FFF8F0] transition-colors mb-8 text-lg font-bold border-2 border-white"
        >
          <svg 
            className="w-7 h-7 mr-3" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" 
              fill="currentColor"
            />
            <path 
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" 
              fill="currentColor"
            />
            <path 
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" 
              fill="currentColor"
            />
            <path 
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" 
              fill="currentColor"
            />
          </svg>
          Log In with Google
        </button>
        
        <p className="text-white text-lg">
          Don't have an account?{' '}
          <Link href="/signup" className="text-white hover:text-white/80 font-medium">
            SIGN UP
          </Link>
        </p>
      </div>
    </div>
  );
}
