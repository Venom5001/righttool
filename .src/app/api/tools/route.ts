import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // adjust import if your prisma helper differs

export async function POST(req: Request) {
  try {
    const { vehicleId, jobId } = await req.json();

    if (!vehicleId || !jobId) {
      return NextResponse.json(
        { error: "vehicleId and jobId are required" },
        { status: 400 }
      );
    }

    // Validate both exist
    const [vehicle, job] = await Promise.all([
      prisma.vehicle.findUnique({ where: { id: vehicleId } }),
      prisma.job.findUnique({ where: { id: jobId } }),
    ]);

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
    }
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Pull requirements + joined tools
    const requirements = await prisma.requirement.findMany({
      where: { vehicleId, jobId },
      include: {
        tool: true, // assumes Requirement has toolId -> Tool relation named "tool"
      },
      orderBy: [{ order: "asc" }], // optional if you keep an "order" column
    });

    if (requirements.length === 0) {
      return NextResponse.json({
        vehicle,
        job,
        tools: [],
        message: "No tools found for this vehicle/job.",
      });
    }

    // Shape a clean payload for UI
    const tools = requirements.map((r) => ({
      requirementId: r.id,
      qty: r.qty ?? 1,
      notes: r.notes ?? null,
      tool: {
        id: r.tool.id,
        name: r.tool.name,
        brand: r.tool.brand ?? null,
        size: r.tool.size ?? null,
        drive: r.tool.drive ?? null,
        spec: r.tool.spec ?? null,
        buyUrl: r.tool.buyUrl ?? null, // new field we’ll add below
        price: r.tool.price ?? null,   // optional if you track price
      },
    }));

    return NextResponse.json({ vehicle, job, tools });
  } catch (err: any) {
    console.error("POST /api/tools error:", err);
    return NextResponse.json(
      { error: "Unexpected error", detail: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}