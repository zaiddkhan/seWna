"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function BrowseDesignersPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-poppins font-bold text-gray-900">
            seWNa.
          </h1>
          <Button onClick={() => router.push("/")} variant="outline">
            Home
          </Button>
        </div>
      </div>

      {/* Coming Soon */}
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="bg-white rounded-3xl shadow-lg p-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#00b67f]/10 rounded-full mb-6">
            <Search className="w-10 h-10 text-[#00b67f]" />
          </div>

          <h1 className="text-4xl md:text-5xl font-poppins font-bold text-gray-900 mb-4">
            Designer Marketplace
          </h1>
          <p className="text-xl text-gray-600 font-poppins mb-8">
            Coming Soon
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <p className="text-gray-700 font-poppins mb-4">
              We're building an amazing marketplace where you can:
            </p>
            <ul className="text-left space-y-2 max-w-md mx-auto">
              <li className="flex items-start gap-2">
                <span className="text-[#00b67f] font-bold">✓</span>
                <span className="text-gray-700">Browse portfolios from talented designers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00b67f] font-bold">✓</span>
                <span className="text-gray-700">Filter by skills, experience, and budget</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00b67f] font-bold">✓</span>
                <span className="text-gray-700">Connect directly with designers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00b67f] font-bold">✓</span>
                <span className="text-gray-700">Manage projects and collaborations</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => router.push("/client-form")}
              className="bg-[#00b67f] hover:bg-[#00a06f]"
            >
              Submit a Project Request
            </Button>
            <Button onClick={() => router.push("/")} variant="outline">
              Back to Home
            </Button>
          </div>

          <p className="text-sm text-gray-500 font-poppins mt-8">
            Want early access?{" "}
            <a href="mailto:hello@sewna.com" className="text-[#00b67f] hover:underline">
              Contact us
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
