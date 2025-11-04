import ScrambleText from "@/components/ScrambleText";
import Link from "next/link";

export default function Home() {
  return (
    <div
      className="min-h-screen w-full bg-primary"
      style={{
        backgroundImage: 'url(/landing_background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Logo in top left */}
      <div className="absolute top-6 left-6 md:top-8 md:left-8 z-50">
        <div
          className="flex items-baseline cursor-pointer transition-transform duration-300 hover:scale-105"
          style={{
            fontSize: '2.5rem',
            letterSpacing: '-0.02em',
            textShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 2px',
            color: 'rgb(0, 182, 127)',
          }}
        >
          <span className="font-pacifico" style={{ fontWeight: 100 }}>
            se
          </span>
          <span
            className="font-poppins font-semibold"
            style={{ fontSize: '1.7rem', letterSpacing: '-0.2em' }}
          >
            W
            <i
              className="font-poppins italic"
              style={{ fontSize: '1.7rem', letterSpacing: '0em' }}
            >
              N
            </i>
          </span>
          <span
            className="font-poppins"
            style={{ fontWeight: 410, letterSpacing: '-0.02em', fontSize: '2.2rem' }}
          >
            a.
          </span>
        </div>
      </div>

      {/* Text elements in top right */}
      <div className="absolute top-6 right-6 md:top-8 md:right-8 z-50">
        <div className="flex items-center gap-8 px-6 py-3 rounded-full">
          <Link href="/designer-form">
            <span className="font-poppins text-sm md:text-base font-medium cursor-pointer text-[#00b67f] hover:opacity-80 transition-opacity duration-300">
              I AM A DESIGNER
            </span>
          </Link>
          <Link href="/client-form">
            <span className="font-poppins text-sm md:text-base font-medium cursor-pointer text-gray-800 hover:text-[#00b67f] transition-colors duration-300">
              I NEED A DESIGNER
            </span>
          </Link>
        </div>
      </div>

      {/* Scramble Text in bottom left */}
      <ScrambleText />

      <main className="min-h-screen w-full relative">
        {/* Content goes here */}
      </main>
    </div>
  );
}
