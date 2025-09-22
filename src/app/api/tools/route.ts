// src/app/api/tools/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
export const runtime = "nodejs"; // Prisma needs Node runtime (not Edge)

export async function POST(req: Request) {
  // Parse body safely
  let body: unknown = null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { vehicleId, jobId } = body as { vehicleId?: string; jobId?: string };
  if (!vehicleId || !jobId) {
    return NextResponse.json(
      { error: "vehicleId and jobId are required" },
      { status: 400 }
    );
  }

  // Validate vehicle & job
  const [vehicle, job] = await Promise.all([
    prisma.vehicle.findUnique({ where: { id: vehicleId } }),
    prisma.job.findUnique({ where: { id: jobId } }),
  ]);
  if (!vehicle) return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });
  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

  // Fetch requirements + joined tools
  const requirements = await prisma.requirement.findMany({
    where: { vehicleId, jobId },
    include: { tool: true },
  });

  const tools = requirements.map((r) => {
    // Safely stringify optional fields like Decimal / unknowns
    const price =
      r.tool && (r.tool as Record<string, unknown>).price != null
        ? String((r.tool as Record<string, unknown>).price)
        : null;
    const buyUrl =
      r.tool && (r.tool as Record<string, unknown>).buyUrl != null
        ? String((r.tool as Record<string, unknown>).buyUrl)
        : null;

    return {
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
        price,
        buyUrl,
      },
    };
  });

  return NextResponse.json({
    vehicle: {
      id: vehicle.id,
      year: vehicle.year,
      make: vehicle.make,
      model: vehicle.model,
      engine: vehicle.engine,
      trim: (vehicle as Record<string, unknown>).trim ?? null,
    },
    job: {
      id: job.id,
      slug: job.slug,
      title: job.title,
      category: job.category,
    },
    tools,
    message: tools.length ? undefined : "No tools found for this vehicle/job.",
  });
}
