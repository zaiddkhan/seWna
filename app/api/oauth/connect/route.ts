import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, provider, profileData } = body;

    if (!userId || !provider) {
      return NextResponse.json(
        { error: "User ID and provider are required" },
        { status: 400 }
      );
    }

    // Update social_links table with connection status
    const updateData: any = {};

    if (provider === "dribbble") {
      updateData.dribbble_connected = true;
      if (profileData?.html_url) {
        updateData.dribbble_url = profileData.html_url;
      }
    }

    const { data, error } = await supabaseAdmin
      .from("social_links")
      .update(updateData)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      console.error("Error updating social links:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        socialLinks: data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in POST /api/oauth/connect:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
