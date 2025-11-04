export interface User {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  country?: string;
  city?: string;
  years_of_experience?: number;
  design_areas?: string;
  portfolio_link?: string;
  profile_picture_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Portfolio {
  id: string;
  user_id: string;
  username?: string;
  portfolio_title?: string;
  bio?: string;
  professional_bio?: string;
  skills?: string[];
  portfolio_url?: string;
  profile_picture_url?: string;
  theme_color: string;
  location?: string;
  timezone?: string;
  visibility: "public" | "private" | "unlisted";
  created_at: string;
  updated_at: string;
}

export interface SocialLinks {
  id: string;
  user_id: string;
  dribbble_url?: string;
  dribbble_connected: boolean;
  linkedin_url?: string;
  instagram_url?: string;
  twitter_url?: string;
  created_at: string;
  updated_at: string;
}

export interface DesignerFormData {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  yearsOfExperience: string;
  designAreas: string;
}

export interface PortfolioFormData {
  username?: string;
  portfolioTitle?: string;
  bio?: string;
  professionalBio?: string;
  skills?: string;
  portfolioUrl?: string;
  profilePictureUrl?: string;
  themeColor?: string;
  location?: string;
  timezone?: string;
  visibility?: "public" | "private" | "unlisted";
  dribbbleUrl?: string;
  linkedinUrl?: string;
  instagramUrl?: string;
  twitterUrl?: string;
}

export interface Client {
  id: string;
  full_name: string;
  email: string;
  client_type: "business" | "individual";
  business_name?: string;
  looking_for: string;
  project_description?: string;
  budget_range?: string;
  timeline?: string;
  inspiration_images?: string[];
  created_at: string;
  updated_at: string;
}

export interface ClientFormData {
  fullName: string;
  email: string;
  clientType: "business" | "individual";
  businessName?: string;
  lookingFor: string;
  projectDescription?: string;
  budgetRange?: string;
  timeline?: string;
  inspirationImages?: string[];
}
