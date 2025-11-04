"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DesignerFormData } from "@/types/database";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  yearsOfExperience: string;
  designAreas: string;
}

const questions = [
  {
    id: "fullName",
    question: "What is your full name?",
    placeholder: "Type your answer here...",
    type: "text",
  },
  {
    id: "email",
    question: "What is your email address?",
    placeholder: "name@example.com",
    type: "email",
  },
  {
    id: "phone",
    question: "Could you share your phone number?",
    placeholder: "+1 234 567 8900",
    type: "tel",
  },
  {
    id: "country",
    question: "Which country do you currently reside in?",
    placeholder: "Type your answer here...",
    type: "text",
  },
  {
    id: "yearsOfExperience",
    question: "How many years have you worked as a designer?",
    placeholder: "e.g., 5",
    type: "number",
  },
  {
    id: "designAreas",
    question: "Which areas of design do you specialize in?",
    placeholder: "e.g., UI/UX, Graphic Design, Brand Identity...",
    type: "text",
  },
];

export default function DesignerForm() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    yearsOfExperience: "",
    designAreas: "",
  });

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Form submission - save to backend then redirect
      try {
        const response = await fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error("Failed to save user data");
        }

        const { user } = await response.json();

        // Store user ID in localStorage for portfolio page
        localStorage.setItem("userId", user.id);

        router.push(`/portfolio?name=${encodeURIComponent(formData.fullName)}`);
      } catch (error) {
        console.error("Error saving user data:", error);
        alert("Failed to save your information. Please try again.");
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && formData[currentQ.id as keyof FormData]) {
      handleNext();
    }
  };

  const handleInputChange = (value: string) => {
    setFormData({
      ...formData,
      [currentQ.id]: value,
    });
  };

  return (
    <div className="min-h-screen w-full bg-white relative">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
        <div
          className="h-full bg-[#00b67f] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Main content */}
      <div className="min-h-screen flex flex-col justify-between p-6 md:p-12 pt-16">
        {/* Question section */}
        <div className="max-w-3xl w-full mx-auto">
          {/* Question number and text */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[#00b67f] font-poppins text-xl font-medium">
                {currentQuestion + 1}
              </span>
              <span className="text-[#00b67f] text-xl">→</span>
              <h1 className="text-3xl md:text-4xl font-poppins font-medium text-gray-800">
                {currentQ.question}
              </h1>
            </div>

            {/* Input field */}
            <div className="mb-6">
              <input
                type={currentQ.type}
                value={formData[currentQ.id as keyof FormData]}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={currentQ.placeholder}
                className="w-full text-2xl md:text-3xl font-poppins font-light text-gray-600 placeholder-gray-300 border-b-2 border-[#00b67f] focus:outline-none focus:border-[#00b67f] py-4 bg-transparent transition-all"
                autoFocus
              />
            </div>

            {/* OK button */}
            <div className="flex items-center gap-4 mt-8">
              <button
                onClick={handleNext}
                disabled={!formData[currentQ.id as keyof FormData]}
                className="bg-[#00b67f] text-white font-poppins font-medium px-8 py-3 rounded hover:bg-[#00a06f] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                OK
              </button>
              <span className="text-gray-500 text-sm font-poppins">
                press <span className="font-semibold">Enter ↵</span>
              </span>
            </div>
          </div>
        </div>

        {/* Navigation arrows */}
        <div className="max-w-3xl w-full mx-auto flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="w-12 h-12 bg-[#00b67f] text-white rounded flex items-center justify-center hover:bg-[#00a06f] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              </svg>
            </button>
            <button
              onClick={handleNext}
              disabled={!formData[currentQ.id as keyof FormData]}
              className="w-12 h-12 bg-[#00b67f] text-white rounded flex items-center justify-center hover:bg-[#00a06f] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>

          {/* Back to home */}
          <button
            onClick={() => router.push("/")}
            className="text-gray-500 hover:text-[#00b67f] font-poppins text-sm transition-colors"
          >
            ← Back to home
          </button>
        </div>
      </div>
    </div>
  );
}
