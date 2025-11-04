"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import gsap from "gsap";
import { User, FileText, Link2, Settings, X, CheckCircle2, LogOut, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { signIn, signOut, useSession } from "next-auth/react";

const tabs = [
  { id: "account", label: "Account", icon: User },
  { id: "portfolio", label: "Portfolio Info", icon: FileText },
  { id: "social", label: "Social Links", icon: Link2 },
  { id: "preferences", label: "Preferences", icon: Settings },
];

function PortfolioPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const name = searchParams.get("name") || "there";
  const { data: session, status } = useSession();

  const greetingRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const oauthProcessedRef = useRef(false);

  const [activeTab, setActiveTab] = useState("account");
  const [connectedAccounts, setConnectedAccounts] = useState({
    dribbble: false,
  });
  const [userId, setUserId] = useState<string | null>(null);
  const [portfolioData, setPortfolioData] = useState({
    fullName: name,
    username: "",
    email: "",
    bio: "",
    phone: "",
    profilePictureUrl: "",
    portfolioTitle: "",
    professionalBio: "",
    yearsOfExperience: "",
    skills: "",
    designAreas: "",
    portfolioUrl: "",
    themeColor: "#00b67f",
    location: "",
    timezone: "",
    visibility: "public" as "public" | "private" | "unlisted",
    dribbbleUrl: "",
    linkedinUrl: "",
    instagramUrl: "",
    twitterUrl: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleOAuthConnect = async (provider: string) => {
    try {
      // Preserve the name parameter in callback URL
      const callbackUrl = `/portfolio${name ? `?name=${encodeURIComponent(name)}` : ""}`;
      await signIn(provider, { callbackUrl });
    } catch (error) {
      console.error(`Error connecting to ${provider}:`, error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setPortfolioData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    setUploadingImage(true);

    try {
      // Convert to base64 for simple storage
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPortfolioData((prev) => ({
          ...prev,
          profilePictureUrl: base64String,
        }));
        setUploadingImage(false);
      };
      reader.onerror = () => {
        alert("Failed to read image file");
        setUploadingImage(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
      setUploadingImage(false);
    }
  };

  const handleSignOut = async () => {
    if (confirm("Are you sure you want to sign out?")) {
      localStorage.removeItem("userId");
      sessionStorage.removeItem("portfolioAnimationsPlayed");
      await signOut({ callbackUrl: "/" });
    }
  };

  const handleSavePortfolio = async () => {
    if (!userId) {
      alert("User ID not found. Please complete the designer form first.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          username: portfolioData.username,
          portfolioTitle: portfolioData.portfolioTitle,
          bio: portfolioData.bio,
          professionalBio: portfolioData.professionalBio,
          skills: portfolioData.skills,
          portfolioUrl: portfolioData.portfolioUrl,
          profilePictureUrl: portfolioData.profilePictureUrl,
          themeColor: portfolioData.themeColor,
          location: portfolioData.location,
          timezone: portfolioData.timezone,
          visibility: portfolioData.visibility,
          dribbbleUrl: portfolioData.dribbbleUrl,
          linkedinUrl: portfolioData.linkedinUrl,
          instagramUrl: portfolioData.instagramUrl,
          twitterUrl: portfolioData.twitterUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save portfolio");
      }

      alert("Portfolio saved successfully!");
    } catch (error) {
      console.error("Error saving portfolio:", error);
      alert("Failed to save portfolio. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Load user ID and existing portfolio data
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);

      // Load existing portfolio data
      fetch(`/api/portfolio?userId=${storedUserId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.portfolio) {
            setPortfolioData((prev) => ({
              ...prev,
              username: data.portfolio.username || "",
              portfolioTitle: data.portfolio.portfolio_title || "",
              bio: data.portfolio.bio || "",
              professionalBio: data.portfolio.professional_bio || "",
              skills: data.portfolio.skills?.join(", ") || "",
              portfolioUrl: data.portfolio.portfolio_url || "",
              profilePictureUrl: data.portfolio.profile_picture_url || "",
              themeColor: data.portfolio.theme_color || "#00b67f",
              location: data.portfolio.location || "",
              timezone: data.portfolio.timezone || "",
              visibility: data.portfolio.visibility || "public",
            }));
          }
          if (data.socialLinks) {
            setPortfolioData((prev) => ({
              ...prev,
              dribbbleUrl: data.socialLinks.dribbble_url || "",
              linkedinUrl: data.socialLinks.linkedin_url || "",
              instagramUrl: data.socialLinks.instagram_url || "",
              twitterUrl: data.socialLinks.twitter_url || "",
            }));
            setConnectedAccounts({
              dribbble: data.socialLinks.dribbble_connected || false,
            });
          }
        })
        .catch((error) => console.error("Error loading portfolio:", error));
    }
  }, []);

  // Handle OAuth callback
  useEffect(() => {
    const handleOAuthCallback = async () => {
      if (
        status === "authenticated" &&
        session?.user &&
        userId &&
        !oauthProcessedRef.current
      ) {
        const provider = (session.user as any).provider;
        const profile = (session.user as any).profile;

        if (provider === "dribbble") {
          oauthProcessedRef.current = true;

          try {
            // Update database with connection status
            const response = await fetch("/api/oauth/connect", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userId,
                provider,
                profileData: profile,
              }),
            });

            if (response.ok) {
              const data = await response.json();
              // Update UI to show connected status
              setConnectedAccounts({
                dribbble: true,
              });
              if (data.socialLinks?.dribbble_url) {
                setPortfolioData((prev) => ({
                  ...prev,
                  dribbbleUrl: data.socialLinks.dribbble_url,
                }));
              }

              // Show success message
              alert("Dribbble account connected successfully!");
            }
          } catch (error) {
            console.error("Error updating OAuth connection:", error);
            alert("Failed to connect Dribbble account. Please try again.");
          }
        }
      }
    };

    handleOAuthCallback();
  }, [status, session, userId]);

  useEffect(() => {
    // Check if animations have already been played in this session
    const hasPlayedAnimations = sessionStorage.getItem("portfolioAnimationsPlayed");

    if (hasPlayedAnimations) {
      // Skip animations and show form directly
      if (greetingRef.current) greetingRef.current.style.display = "none";
      if (taglineRef.current) taglineRef.current.style.display = "none";
      if (formRef.current) {
        gsap.set(formRef.current, { opacity: 1, scale: 1, y: 0 });
      }
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        // Mark animations as played
        sessionStorage.setItem("portfolioAnimationsPlayed", "true");
      },
    });

    // Animation 1: "Hey, ${name}" fade in
    tl.fromTo(
      greetingRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
    )
    // Hold for 2 seconds
    .to(greetingRef.current, { opacity: 1, duration: 2 })
    // Fade out
    .to(greetingRef.current, { opacity: 0, y: -20, duration: 0.8, ease: "power2.in" })

    // Animation 2: "Create your portfolio with us" fade in
    .fromTo(
      taglineRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
    )
    // Hold for 2 seconds
    .to(taglineRef.current, { opacity: 1, duration: 2 })
    // Fade out
    .to(taglineRef.current, { opacity: 0, y: -20, duration: 0.8, ease: "power2.in" })

    // Animation 3: Form pop up
    .fromTo(
      formRef.current,
      { opacity: 0, scale: 0.9, y: 30 },
      { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "back.out(1.2)" }
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center p-6">
      {/* Greeting Text */}
      <div ref={greetingRef} className="absolute opacity-0 text-center">
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-poppins font-bold text-gray-900">
          Hey, <span className="text-[#00b67f]">{name}</span>
        </h1>
      </div>

      {/* Tagline Text */}
      <div ref={taglineRef} className="absolute opacity-0 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-poppins font-medium text-gray-700">
          Create your portfolio with us
        </h2>
      </div>

      {/* Portfolio Form - Tabbed Layout */}
      <div
        ref={formRef}
        className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl opacity-0 overflow-hidden"
      >
        <div className="flex flex-col md:flex-row min-h-[600px]">
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-gray-50 p-6 border-r border-gray-200">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-poppins font-bold text-gray-900">Profile</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSignOut}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors group"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5 text-gray-500 group-hover:text-red-500" />
                </button>
                <button
                  onClick={() => router.push("/")}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Close"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-poppins font-medium transition-all ${
                      isActive
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-8 md:p-12 overflow-y-auto max-h-[600px]">
            {activeTab === "account" && (
              <div className="space-y-6">
                {/* Profile Picture Upload */}
                <div className="flex flex-col items-center pb-6 border-b border-gray-200">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center border-4 border-white shadow-lg">
                      {portfolioData.profilePictureUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={portfolioData.profilePictureUrl}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-16 h-16 text-gray-400" />
                      )}
                    </div>
                    <label
                      htmlFor="profile-picture-upload"
                      className="absolute bottom-0 right-0 bg-[#00b67f] text-white p-2 rounded-full cursor-pointer hover:bg-[#00a06f] transition-colors shadow-lg"
                      title="Upload profile picture"
                    >
                      <Upload className="w-4 h-4" />
                      <input
                        id="profile-picture-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploadingImage}
                      />
                    </label>
                  </div>
                  {uploadingImage && (
                    <p className="text-sm text-gray-500 mt-2">Uploading...</p>
                  )}
                  <p className="text-xs text-gray-500 mt-3 text-center">
                    Upload a profile picture (max 5MB)
                  </p>
                </div>

                <div>
                  <Label>Full Name</Label>
                  <Input
                    value={portfolioData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    placeholder="John Doe"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Username</Label>
                  <Input
                    value={portfolioData.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    placeholder="@johndoe"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={portfolioData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="john@example.com"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Bio</Label>
                  <Textarea
                    value={portfolioData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    placeholder="A passionate designer with a knack for creating innovative solutions..."
                    rows={4}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Phone Number</Label>
                  <Input
                    type="tel"
                    value={portfolioData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+1 555-238-0912"
                    className="mt-2"
                  />
                </div>
              </div>
            )}

            {activeTab === "portfolio" && (
              <div className="space-y-6">
                <div>
                  <Label>Portfolio Title</Label>
                  <Input
                    value={portfolioData.portfolioTitle}
                    onChange={(e) => handleInputChange("portfolioTitle", e.target.value)}
                    placeholder="Creative Designer & Brand Strategist"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Professional Bio</Label>
                  <Textarea
                    value={portfolioData.professionalBio}
                    onChange={(e) => handleInputChange("professionalBio", e.target.value)}
                    placeholder="Tell us about your design journey and expertise..."
                    rows={5}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Years of Experience</Label>
                  <Input
                    type="number"
                    value={portfolioData.yearsOfExperience}
                    onChange={(e) => handleInputChange("yearsOfExperience", e.target.value)}
                    placeholder="5"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Key Skills (comma separated)</Label>
                  <Input
                    value={portfolioData.skills}
                    onChange={(e) => handleInputChange("skills", e.target.value)}
                    placeholder="UI/UX Design, Branding, Illustration"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Design Areas</Label>
                  <Textarea
                    value={portfolioData.designAreas}
                    onChange={(e) => handleInputChange("designAreas", e.target.value)}
                    placeholder="Graphic Design, Brand Identity, Web Design..."
                    rows={3}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Portfolio Link</Label>
                  <Input
                    type="url"
                    value={portfolioData.portfolioUrl}
                    onChange={(e) => handleInputChange("portfolioUrl", e.target.value)}
                    placeholder="https://yourportfolio.com"
                    className="mt-2"
                  />
                </div>
              </div>
            )}

            {activeTab === "social" && (
              <div className="space-y-6">
                {/* Dribbble OAuth */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Label className="text-base">Dribbble</Label>
                      {connectedAccounts.dribbble && (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                    <Button
                      type="button"
                      onClick={() => handleOAuthConnect("dribbble")}
                      variant={connectedAccounts.dribbble ? "outline" : "default"}
                      className={`${
                        !connectedAccounts.dribbble && "bg-[#ea4c89] hover:bg-[#d43f7a]"
                      }`}
                    >
                      {connectedAccounts.dribbble ? "Reconnect" : "Connect Account"}
                    </Button>
                  </div>
                  {connectedAccounts.dribbble ? (
                    <div className="space-y-2">
                      <p className="text-sm text-green-600 font-medium">
                        ✓ Account connected successfully
                      </p>
                      {portfolioData.dribbbleUrl && (
                        <a
                          href={portfolioData.dribbbleUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-[#ea4c89] hover:underline inline-flex items-center gap-1"
                        >
                          View Profile →
                        </a>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Connect your Dribbble account to import your shots automatically
                    </p>
                  )}
                </div>

                <div>
                  <Label>LinkedIn</Label>
                  <Input
                    type="url"
                    value={portfolioData.linkedinUrl}
                    onChange={(e) => handleInputChange("linkedinUrl", e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Instagram</Label>
                  <Input
                    type="url"
                    value={portfolioData.instagramUrl}
                    onChange={(e) => handleInputChange("instagramUrl", e.target.value)}
                    placeholder="https://instagram.com/username"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Twitter / X</Label>
                  <Input
                    type="url"
                    value={portfolioData.twitterUrl}
                    onChange={(e) => handleInputChange("twitterUrl", e.target.value)}
                    placeholder="https://twitter.com/username"
                    className="mt-2"
                  />
                </div>
              </div>
            )}

            {activeTab === "preferences" && (
              <div className="space-y-6">
                <div>
                  <Label>Portfolio Theme Color</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <input
                      type="color"
                      value={portfolioData.themeColor}
                      onChange={(e) => handleInputChange("themeColor", e.target.value)}
                      className="w-16 h-12 border-2 border-gray-200 rounded-lg cursor-pointer"
                    />
                    <span className="text-sm text-gray-600 font-poppins">
                      Choose your primary color
                    </span>
                  </div>
                </div>

                <div>
                  <Label>Location</Label>
                  <Input
                    value={portfolioData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="San Francisco, CA"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Time Zone</Label>
                  <Input
                    value={portfolioData.timezone}
                    onChange={(e) => handleInputChange("timezone", e.target.value)}
                    placeholder="GMT-5 (Eastern Time)"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Portfolio Visibility</Label>
                  <select
                    value={portfolioData.visibility}
                    onChange={(e) => handleInputChange("visibility", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg mt-2 font-poppins"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                    <option value="unlisted">Unlisted</option>
                  </select>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => router.push("/")}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-[#00b67f] hover:bg-[#00a06f]"
                onClick={handleSavePortfolio}
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Portfolio"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PortfolioPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <PortfolioPageContent />
    </Suspense>
  );
}
