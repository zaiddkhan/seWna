import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { DesignerFormData } from "@/types/database";

export async function POST(request: NextRequest) {
  try {
    const body: DesignerFormData = await request.json();

    const { data, error } = await supabaseAdmin
      .from("users")
      .insert({
        full_name: body.fullName,
        email: body.email,
        phone: body.phone,
        country: body.country,
        years_of_experience: body.yearsOfExperience
          ? parseInt(body.yearsOfExperience)
          : null,
        design_areas: body.designAreas,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating user:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Also create empty portfolio and social_links records
    const [portfolioResult, socialLinksResult] = await Promise.all([
      supabaseAdmin.from("portfolios").insert({
        user_id: data.id,
        bio: "",
      }).select().single(),
      supabaseAdmin.from("social_links").insert({
        user_id: data.id,
      }).select().single(),
    ]);

    if (portfolioResult.error) {
      console.error("Error creating portfolio:", portfolioResult.error);
    }

    if (socialLinksResult.error) {
      console.error("Error creating social links:", socialLinksResult.error);
    }

    return NextResponse.json({ user: data, success: true }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email parameter is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ user: null }, { status: 404 });
      }
      console.error("Error fetching user:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ user: data }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
