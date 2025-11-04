"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

// Demo designer portfolio data
const demoDesigners = [
  {
    id: 1,
    name: "Alex Thompson",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop&q=80",
  },
  {
    id: 2,
    name: "Sarah Chen",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=400&fit=crop&q=80",
  },
  {
    id: 3,
    name: "Marcus Rodriguez",
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=700&h=500&fit=crop&q=80",
  },
  {
    id: 4,
    name: "Emma Watson",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=600&fit=crop&q=80",
  },
  {
    id: 5,
    name: "David Kim",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=500&fit=crop&q=80",
  },
];

const demoDesignersRow2 = [
  {
    id: 6,
    name: "Jessica Lee",
    image: "https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=600&h=700&fit=crop&q=80",
  },
  {
    id: 7,
    name: "Ryan Patel",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=700&h=400&fit=crop&q=80",
  },
  {
    id: 8,
    name: "Olivia Brown",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&h=600&fit=crop&q=80",
  },
  {
    id: 9,
    name: "James Wilson",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&h=500&fit=crop&q=80",
  },
  {
    id: 10,
    name: "Sophia Martinez",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop&q=80",
  },
];

function FindDesignersPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const clientId = searchParams.get("clientId");
  const [clientData, setClientData] = useState<any>(null);

  useEffect(() => {
    if (clientId) {
      fetch(`/api/clients?clientId=${clientId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.client) {
            setClientData(data.client);
          }
        })
        .catch((error) => console.error("Error loading client:", error));
    }
  }, [clientId]);

  return (
    <div className="min-h-screen w-full bg-white overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div
            className="flex items-baseline cursor-pointer transition-transform duration-300 hover:scale-105"
            onClick={() => router.push("/")}
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
          <Button
            onClick={() => router.push("/")}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="text-center py-16 px-6">
        <h2 className="text-5xl md:text-6xl font-poppins font-bold text-gray-900 mb-4">
          Your Perfect Matches
        </h2>
        <p className="text-xl text-gray-600 font-poppins max-w-2xl mx-auto">
          We&apos;ve shortlisted these designer profiles based on your project requirements and preferences
        </p>
      </div>

      {/* Infinite Scrolling Gallery - Row 1 */}
      <div className="relative mb-8 overflow-hidden">
        <style jsx>{`
          @keyframes scroll-left {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .animate-scroll-left {
            animation: scroll-left 30s linear infinite;
          }
          .animate-scroll-left:hover {
            animation-play-state: paused;
          }
        `}</style>
        <div className="flex gap-6 animate-scroll-left">
          {[...demoDesigners, ...demoDesigners, ...demoDesigners].map((designer, index) => (
            <div
              key={`${designer.id}-${index}`}
              className="w-[350px] h-[250px] flex-shrink-0 relative group cursor-pointer rounded-2xl overflow-hidden"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={designer.image}
                alt={designer.name}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-6 left-6">
                  <h3 className="text-white font-poppins font-semibold text-xl">
                    {designer.name}
                  </h3>
                  <p className="text-gray-300 text-sm">View Portfolio →</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Infinite Scrolling Gallery - Row 2 (scrolls in opposite direction) */}
      <div className="relative mb-16 overflow-hidden">
        <style jsx>{`
          @keyframes scroll-right {
            0% {
              transform: translateX(-50%);
            }
            100% {
              transform: translateX(0);
            }
          }
          .animate-scroll-right {
            animation: scroll-right 35s linear infinite;
          }
          .animate-scroll-right:hover {
            animation-play-state: paused;
          }
        `}</style>
        <div className="flex gap-6 animate-scroll-right">
          {[...demoDesignersRow2, ...demoDesignersRow2, ...demoDesignersRow2].map((designer, index) => (
            <div
              key={`${designer.id}-${index}`}
              className="w-[350px] h-[250px] flex-shrink-0 relative group cursor-pointer rounded-2xl overflow-hidden"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={designer.image}
                alt={designer.name}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-6 left-6">
                  <h3 className="text-white font-poppins font-semibold text-xl">
                    {designer.name}
                  </h3>
                  <p className="text-gray-300 text-sm">View Portfolio →</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function FindDesignersPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <FindDesignersPageContent />
    </Suspense>
  );
}
