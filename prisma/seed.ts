import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function seed() {
  const vehicles = await prisma.$transaction([
    prisma.vehicle.create({ data: { year: 2015, make: "Honda",    model: "Accord",   engine: "2.4L I4" } }),
    prisma.vehicle.create({ data: { year: 2016, make: "Honda",    model: "Civic",    engine: "2.0L I4" } }),
    prisma.vehicle.create({ data: { year: 2017, make: "Toyota",   model: "Camry",    engine: "2.5L I4" } }),
    prisma.vehicle.create({ data: { year: 2018, make: "Toyota",   model: "Corolla",  engine: "1.8L I4" } }),
    prisma.vehicle.create({ data: { year: 2019, make: "Toyota",   model: "RAV4",     engine: "2.5L I4" } }),
    prisma.vehicle.create({ data: { year: 2018, make: "Ford",     model: "F-150",    engine: "5.0L V8" } }),
    prisma.vehicle.create({ data: { year: 2019, make: "Chevrolet",model: "Silverado 1500", engine: "5.3L V8" } }),
    prisma.vehicle.create({ data: { year: 2017, make: "RAM",      model: "1500",     engine: "5.7L V8" } }),
    prisma.vehicle.create({ data: { year: 2017, make: "Jeep",     model: "Wrangler", engine: "3.6L V6" } }),
    prisma.vehicle.create({ data: { year: 2014, make: "BMW",      model: "328i",     engine: "2.0L I4 N20" } }),
  ]);

  const [frontBrakes, rearBrakes, oil, battery, plugs, belt, air, cabin] = await prisma.$transaction([
    prisma.job.create({ data: { slug: "front-brake-pads", title: "Front Brake Pads", category: "Brakes" } }),
    prisma.job.create({ data: { slug: "rear-brake-pads",  title: "Rear Brake Pads",  category: "Brakes" } }),
    prisma.job.create({ data: { slug: "engine-oil-filter",title: "Engine Oil & Filter", category: "Maintenance" } }),
    prisma.job.create({ data: { slug: "battery-replacement", title: "Battery Replacement", category: "Electrical" } }),
    prisma.job.create({ data: { slug: "spark-plugs",       title: "Spark Plugs", category: "Ignition" } }),
    prisma.job.create({ data: { slug: "serpentine-belt",   title: "Serpentine Belt", category: "Drive Belt" } }),
    prisma.job.create({ data: { slug: "engine-air-filter", title: "Engine Air Filter", category: "Maintenance" } }),
    prisma.job.create({ data: { slug: "cabin-air-filter",  title: "Cabin Air Filter",  category: "Maintenance" } }),
  ]);

  const tools = await prisma.$transaction([
    prisma.tool.create({ data: { name: "Hydraulic Floor Jack", notes: "2-ton+ rated" } }),
    prisma.tool.create({ data: { name: "Jack Stands (x2)", notes: "ANSI/ASME rated" } }),
    prisma.tool.create({ data: { name: "Socket", size: "19mm", drive: "1/2\"", notes: "Lug nuts" } }),
    prisma.tool.create({ data: { name: "Socket", size: "21mm", drive: "1/2\"", notes: "Truck lug nuts" } }),
    prisma.tool.create({ data: { name: "Ratchet", drive: "3/8\"" } }),
    prisma.tool.create({ data: { name: "Extension", notes: "3\"" } }),
    prisma.tool.create({ data: { name: "Socket", size: "12mm", drive: "3/8\"", notes: "Caliper slide bolts" } }),
    prisma.tool.create({ data: { name: "Socket", size: "17mm", drive: "1/2\"", notes: "Caliper bracket bolts" } }),
    prisma.tool.create({ data: { name: "C-Clamp / Piston Compressor" } }),
    prisma.tool.create({ data: { name: "Torque Wrench", drive: "1/2\"", notes: "20–150 ft-lb" } }),
    prisma.tool.create({ data: { name: "Brake Cleaner", notes: "Consumable" } }),
    prisma.tool.create({ data: { name: "Nitrile Gloves" } }),
    prisma.tool.create({ data: { name: "Oil Drain Pan" } }),
    prisma.tool.create({ data: { name: "Oil Filter Wrench", notes: "Band or cap type" } }),
    prisma.tool.create({ data: { name: "Socket", size: "14mm", drive: "3/8\"", notes: "Honda drain plug" } }),
    prisma.tool.create({ data: { name: "Socket", size: "10mm", drive: "1/4\"", notes: "Battery terminals" } }),
    prisma.tool.create({ data: { name: "Spark Plug Socket", size: "16mm", drive: "3/8\"", notes: "Magnetic or rubber insert" } }),
    prisma.tool.create({ data: { name: "Spark Plug Socket", size: "14mm", drive: "3/8\"", notes: "Some Toyota/BMW" } }),
    prisma.tool.create({ data: { name: "Feeler Gauge" } }),
    prisma.tool.create({ data: { name: "Dielectric Grease" } }),
    prisma.tool.create({ data: { name: "Serpentine Belt Tool", notes: "Low-profile breaker or 3/8\" square" } }),
    prisma.tool.create({ data: { name: "Trim Clip Removal Tool", notes: "Cabin filter covers" } }),
    prisma.tool.create({ data: { name: "Phillips Screwdriver" } }),
  ]);

  const by = (name: string, size?: string) => tools.find(t => t.name === name && (size ? t.size === size : true))!.id;
  const add = (vIdx: number, jobId: string, toolName: string, size?: string, notes?: string) =>
    prisma.requirement.create({ data: { vehicleId: vehicles[vIdx].id, jobId, toolId: by(toolName, size), qty: 1, notes } });

  const tx: any[] = [];
  // (…same per-vehicle adds as earlier…)
  tx.push(
    add(0, frontBrakes.id, "Hydraulic Floor Jack"),
    add(0, frontBrakes.id, "Jack Stands (x2)"),
    add(0, frontBrakes.id, "Socket", "19mm", "Lug nuts"),
    add(0, frontBrakes.id, "Ratchet"),
    add(0, frontBrakes.id, "Extension"),
    add(0, frontBrakes.id, "Socket", "12mm", "Caliper slide bolts"),
    add(0, frontBrakes.id, "Socket", "17mm", "Caliper bracket bolts"),
    add(0, frontBrakes.id, "C-Clamp / Piston Compressor"),
    add(0, frontBrakes.id, "Torque Wrench", undefined, "Check manual for torque"),
    add(0, rearBrakes.id, "Hydraulic Floor Jack"),
    add(0, rearBrakes.id, "Jack Stands (x2)"),
    add(0, rearBrakes.id, "Socket", "19mm", "Lug nuts"),
    add(0, rearBrakes.id, "Ratchet"),
    add(0, oil.id, "Oil Drain Pan"),
    add(0, oil.id, "Socket", "14mm", "Drain plug"),
    add(0, oil.id, "Oil Filter Wrench"),
    add(0, oil.id, "Nitrile Gloves"),
    add(0, air.id, "Phillips Screwdriver"),
    add(0, cabin.id, "Trim Clip Removal Tool"),
    // (Civic, Camry, Corolla, etc…)
  );

  await prisma.$transaction(tx);
  console.log("Seed complete.");
}

seed().then(() => prisma.$disconnect()).catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
