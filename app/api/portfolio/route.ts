import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { PortfolioFormData } from "@/types/database";

export async function POST(request: NextRequest) {
  try {
    const body: PortfolioFormData & { userId: string } = await request.json();

    if (!body.userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Update portfolio
    const { data: portfolioData, error: portfolioError } = await supabaseAdmin
      .from("portfolios")
      .update({
        username: body.username,
        portfolio_title: body.portfolioTitle,
        bio: body.bio,
        professional_bio: body.professionalBio,
        skills: body.skills ? body.skills.split(",").map((s) => s.trim()) : [],
        portfolio_url: body.portfolioUrl,
        profile_picture_url: body.profilePictureUrl,
        theme_color: body.themeColor || "#00b67f",
        location: body.location,
        timezone: body.timezone,
        visibility: body.visibility || "public",
      })
      .eq("user_id", body.userId)
      .select()
      .single();

    if (portfolioError) {
      console.error("Error updating portfolio:", portfolioError);
      return NextResponse.json(
        { error: portfolioError.message },
        { status: 500 }
      );
    }

    // Update social links
    const { data: socialData, error: socialError } = await supabaseAdmin
      .from("social_links")
      .update({
        dribbble_url: body.dribbbleUrl,
        linkedin_url: body.linkedinUrl,
        instagram_url: body.instagramUrl,
        twitter_url: body.twitterUrl,
      })
      .eq("user_id", body.userId)
      .select()
      .single();

    if (socialError) {
      console.error("Error updating social links:", socialError);
      return NextResponse.json(
        { error: socialError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        portfolio: portfolioData,
        socialLinks: socialData,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in POST /api/portfolio:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID parameter is required" },
        { status: 400 }
      );
    }

    // Fetch portfolio and social links
    const [portfolioResult, socialLinksResult] = await Promise.all([
      supabaseAdmin
        .from("portfolios")
        .select("*")
        .eq("user_id", userId)
        .single(),
      supabaseAdmin
        .from("social_links")
        .select("*")
        .eq("user_id", userId)
        .single(),
    ]);

    if (portfolioResult.error || socialLinksResult.error) {
      console.error("Error fetching portfolio data:", {
        portfolio: portfolioResult.error,
        social: socialLinksResult.error,
      });
      return NextResponse.json(
        { error: "Failed to fetch portfolio data" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        portfolio: portfolioResult.data,
        socialLinks: socialLinksResult.data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in GET /api/portfolio:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
