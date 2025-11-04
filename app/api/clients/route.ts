import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { ClientFormData } from "@/types/database";

export async function POST(request: NextRequest) {
  try {
    const body: ClientFormData = await request.json();

    const { data, error } = await supabaseAdmin
      .from("clients")
      .insert({
        full_name: body.fullName,
        email: body.email,
        client_type: body.clientType,
        business_name: body.businessName || null,
        looking_for: body.lookingFor,
        project_description: body.projectDescription || null,
        budget_range: body.budgetRange || null,
        timeline: body.timeline || null,
        inspiration_images: body.inspirationImages || [],
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating client:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ client: data, success: true }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/clients:", error);
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
    const clientId = searchParams.get("clientId");

    let query = supabaseAdmin.from("clients").select("*");

    if (email) {
      query = query.eq("email", email);
    } else if (clientId) {
      query = query.eq("id", clientId);
    } else {
      return NextResponse.json(
        { error: "Email or clientId parameter is required" },
        { status: 400 }
      );
    }

    const { data, error } = await query.single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ client: null }, { status: 404 });
      }
      console.error("Error fetching client:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ client: data }, { status: 200 });
  } catch (error) {
    console.error("Error in GET /api/clients:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
