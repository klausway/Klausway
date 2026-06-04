import { NextResponse } from "next/server";
import { getPortfolioProject } from "@/lib/portfolio-data";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const project = await getPortfolioProject(slug);

    if (!project) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("[portfolio GET slug]", error);
    return NextResponse.json(
      { error: "Failed to load portfolio project." },
      { status: 500 },
    );
  }
}
