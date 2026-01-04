import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/mongodb";
import Workflow from "@/models/Workflow";

// GET /api/workflows - Get all workflows for the current user
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Only fetch fields needed for the list view - exclude large nodes/edges data
    const workflows = await Workflow.find({ userId })
      .sort({ updatedAt: -1 })
      .select("name userId createdAt updatedAt")
      .limit(100); // Limit to prevent fetching too many workflows

    return NextResponse.json({ workflows }, { status: 200 });
  } catch (error) {
    console.error("Error fetching workflows:", error);
    return NextResponse.json(
      { error: "Failed to fetch workflows" },
      { status: 500 }
    );
  }
}

// POST /api/workflows - Create a new workflow
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name } = body;

    await connectDB();

    const workflow = new Workflow({
      name: name || "untitled",
      userId,
      nodes: [],
      edges: [],
      viewport: { x: 0, y: 0, zoom: 1 },
      isPublic: false,
    });

    await workflow.save();

    return NextResponse.json(
      { workflow: { id: workflow._id.toString(), name: workflow.name, createdAt: workflow.createdAt } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating workflow:", error);
    return NextResponse.json(
      { error: "Failed to create workflow" },
      { status: 500 }
    );
  }
}

