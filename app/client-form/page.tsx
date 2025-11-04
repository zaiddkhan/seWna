"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, X } from "lucide-react";
import { MultiStepLoader } from "@/components/ui/multi-step-loader";

interface FormData {
  fullName: string;
  email: string;
  clientType: "business" | "individual" | "";
  businessName: string;
  lookingFor: string;
  projectDescription: string;
  budgetRange: string;
  timeline: string;
  inspirationImages: string[];
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
    id: "clientType",
    question: "Are you a business or an individual?",
    placeholder: "",
    type: "choice",
    choices: ["business", "individual"],
  },
  {
    id: "businessName",
    question: "What is your business name?",
    placeholder: "Type your answer here...",
    type: "text",
    conditional: true, // Only show if clientType is business
  },
  {
    id: "lookingFor",
    question: "What are you looking for?",
    placeholder: "e.g., Logo design, Website redesign, Brand identity...",
    type: "textarea",
  },
  {
    id: "projectDescription",
    question: "Tell us more about your project",
    placeholder: "Describe your vision, goals, and any specific requirements...",
    type: "textarea",
  },
  {
    id: "budgetRange",
    question: "What is your budget range?",
    placeholder: "",
    type: "choice",
    choices: [
      "Less than $1,000",
      "$1,000 - $5,000",
      "$5,000 - $10,000",
      "$10,000 - $25,000",
      "More than $25,000",
    ],
  },
  {
    id: "timeline",
    question: "What is your timeline?",
    placeholder: "",
    type: "choice",
    choices: [
      "ASAP (within 2 weeks)",
      "1 month",
      "2-3 months",
      "3-6 months",
      "Flexible",
    ],
  },
  {
    id: "inspirationImages",
    question: "Do you have any design inspiration to share?",
    placeholder: "Upload images or examples that inspire you (optional)",
    type: "file",
  },
];

const aiMatchingStates = [
  { text: "Analyzing your project requirements..." },
  { text: "Searching our designer database..." },
  { text: "Matching skills and expertise..." },
  { text: "Evaluating portfolio quality..." },
  { text: "Checking availability and timeline..." },
  { text: "Filtering by budget range..." },
  { text: "Reviewing designer ratings..." },
  { text: "Found your perfect matches!" },
];

export default function ClientForm() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isMatching, setIsMatching] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    clientType: "",
    businessName: "",
    lookingFor: "",
    projectDescription: "",
    budgetRange: "",
    timeline: "",
    inspirationImages: [],
  });

  const getCurrentQuestion = () => {
    const question = questions[currentQuestion];
    // Skip business name if client type is not business
    if (question.id === "businessName" && formData.clientType !== "business") {
      return null;
    }
    return question;
  };

  const currentQ = getCurrentQuestion();
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleNext = async () => {
    // Skip business name question if not applicable
    if (currentQ?.id === "clientType" && formData.clientType !== "business") {
      const nextIndex = currentQuestion + 1;
      if (nextIndex < questions.length && questions[nextIndex].id === "businessName") {
        setCurrentQuestion(nextIndex + 1);
        return;
      }
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      // Skip business name if needed
      if (
        questions[currentQuestion + 1]?.id === "businessName" &&
        formData.clientType !== "business"
      ) {
        setCurrentQuestion(currentQuestion + 2);
      }
    } else {
      // Form submission - show loader and save to backend
      setIsMatching(true);

      try {
        const response = await fetch("/api/clients", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error("Failed to save client data");
        }

        const { client } = await response.json();

        // Keep loader showing for full animation cycle (8 states * 2000ms)
        setTimeout(() => {
          router.push(`/find-designers?clientId=${client.id}`);
        }, 16000);
      } catch (error) {
        console.error("Error saving client data:", error);
        setIsMatching(false);
        alert("Failed to save your information. Please try again.");
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      const prevIndex = currentQuestion - 1;
      // Skip business name if going back and not a business
      if (
        questions[prevIndex]?.id === "businessName" &&
        formData.clientType !== "business"
      ) {
        setCurrentQuestion(prevIndex - 1);
      } else {
        setCurrentQuestion(prevIndex);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && canProceed()) {
      handleNext();
    }
  };

  const handleInputChange = (value: string) => {
    if (currentQ) {
      setFormData({
        ...formData,
        [currentQ.id]: value,
      });
    }
  };

  const handleChoiceSelect = (choice: string) => {
    if (currentQ) {
      setFormData({
        ...formData,
        [currentQ.id]: choice,
      });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: string[] = [];

    for (let i = 0; i < Math.min(files.length, 5); i++) {
      const file = files[i];

      // Check file size (max 5MB per image)
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large. Max 5MB per image.`);
        continue;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        alert(`${file.name} is not an image file.`);
        continue;
      }

      // Convert to base64
      const reader = new FileReader();
      await new Promise((resolve) => {
        reader.onloadend = () => {
          newImages.push(reader.result as string);
          resolve(null);
        };
        reader.readAsDataURL(file);
      });
    }

    setFormData({
      ...formData,
      inspirationImages: [...formData.inspirationImages, ...newImages],
    });
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      inspirationImages: formData.inspirationImages.filter((_, i) => i !== index),
    });
  };

  const canProceed = () => {
    if (!currentQ) return false;

    const value = formData[currentQ.id as keyof FormData];

    if (currentQ.type === "file") {
      // File upload is optional
      return true;
    }

    if (currentQ.type === "choice") {
      return value !== "";
    }

    return value !== "";
  };

  if (!currentQ) {
    // Skip this question
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 0);
    }
    return null;
  }

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
              {currentQ.type === "text" && (
                <input
                  type="text"
                  value={formData[currentQ.id as keyof FormData] as string}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={currentQ.placeholder}
                  className="w-full text-2xl md:text-3xl font-poppins font-light text-gray-600 placeholder-gray-300 border-b-2 border-[#00b67f] focus:outline-none focus:border-[#00b67f] py-4 bg-transparent transition-all"
                  autoFocus
                />
              )}

              {currentQ.type === "email" && (
                <input
                  type="email"
                  value={formData[currentQ.id as keyof FormData] as string}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={currentQ.placeholder}
                  className="w-full text-2xl md:text-3xl font-poppins font-light text-gray-600 placeholder-gray-300 border-b-2 border-[#00b67f] focus:outline-none focus:border-[#00b67f] py-4 bg-transparent transition-all"
                  autoFocus
                />
              )}

              {currentQ.type === "textarea" && (
                <textarea
                  value={formData[currentQ.id as keyof FormData] as string}
                  onChange={(e) => handleInputChange(e.target.value)}
                  placeholder={currentQ.placeholder}
                  rows={4}
                  className="w-full text-xl md:text-2xl font-poppins font-light text-gray-600 placeholder-gray-300 border-2 border-[#00b67f] focus:outline-none focus:border-[#00b67f] p-4 rounded-lg bg-transparent transition-all resize-none"
                  autoFocus
                />
              )}

              {currentQ.type === "choice" && currentQ.choices && (
                <div className="grid grid-cols-1 gap-3 mt-4">
                  {currentQ.choices.map((choice) => (
                    <button
                      key={choice}
                      onClick={() => handleChoiceSelect(choice)}
                      className={`text-left px-6 py-4 rounded-lg border-2 transition-all font-poppins text-lg ${
                        formData[currentQ.id as keyof FormData] === choice
                          ? "border-[#00b67f] bg-[#00b67f]/10 text-[#00b67f] font-medium"
                          : "border-gray-200 hover:border-[#00b67f]/50 text-gray-700"
                      }`}
                    >
                      {choice}
                    </button>
                  ))}
                </div>
              )}

              {currentQ.type === "file" && (
                <div className="space-y-4">
                  <label
                    htmlFor="inspiration-upload"
                    className="flex items-center justify-center gap-3 px-6 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#00b67f] transition-all bg-gray-50 hover:bg-[#00b67f]/5"
                  >
                    <Upload className="w-6 h-6 text-gray-400" />
                    <span className="font-poppins text-gray-600">
                      Click to upload images (up to 5, max 5MB each)
                    </span>
                    <input
                      id="inspiration-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  {/* Preview uploaded images */}
                  {formData.inspirationImages.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {formData.inspirationImages.map((image, index) => (
                        <div key={index} className="relative group">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={image}
                            alt={`Inspiration ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                          />
                          <button
                            onClick={() => removeImage(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="text-sm text-gray-500 font-poppins">
                    {formData.inspirationImages.length} / 5 images uploaded (optional)
                  </p>
                </div>
              )}
            </div>

            {/* OK button */}
            {currentQ.type !== "choice" && (
              <div className="flex items-center gap-4 mt-8">
                <button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="bg-[#00b67f] text-white font-poppins font-medium px-8 py-3 rounded hover:bg-[#00a06f] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  OK
                </button>
                <span className="text-gray-500 text-sm font-poppins">
                  press <span className="font-semibold">Enter ↵</span>
                </span>
              </div>
            )}

            {/* Auto-advance for choice questions */}
            {currentQ.type === "choice" && canProceed() && (
              <div className="flex items-center gap-4 mt-8">
                <button
                  onClick={handleNext}
                  className="bg-[#00b67f] text-white font-poppins font-medium px-8 py-3 rounded hover:bg-[#00a06f] transition-all"
                >
                  Continue
                </button>
              </div>
            )}
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
              disabled={!canProceed()}
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

      {/* Multi-step loader for AI matching */}
      <MultiStepLoader
        loadingStates={aiMatchingStates}
        loading={isMatching}
        duration={2000}
      />
    </div>
  );
}
