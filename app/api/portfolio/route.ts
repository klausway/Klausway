import { NextResponse } from "next/server";
import { getPublishedPortfolioProjects } from "@/lib/portfolio-data";

export async function GET() {
  try {
    const projects = await getPublishedPortfolioProjects();
    return NextResponse.json(projects);
  } catch (error) {
    console.error("[portfolio GET]", error);
    return NextResponse.json(
      { error: "Failed to load portfolio projects." },
      { status: 500 },
    );
  }
}
