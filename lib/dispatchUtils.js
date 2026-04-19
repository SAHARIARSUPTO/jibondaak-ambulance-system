import { promises as fs } from "fs";
import path from "path";

async function readJsonFile(filename) {
  const filePath = path.join(process.cwd(), "public", "json", filename);
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw);
}

export async function loadDrivers() {
  const parsed = await readJsonFile("drivers.json");
  return parsed?.drivers || [];
}

export async function loadRoutes() {
  const parsed = await readJsonFile("routes.json");
  return parsed?.routes || [];
}

export function distanceKm(from, to) {
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad((to.latitude || 0) - (from.latitude || 0));
  const dLng = toRad((to.longitude || 0) - (from.longitude || 0));
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(from.latitude || 0)) *
      Math.cos(toRad(to.latitude || 0)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function resolveFare({ customFare, routeBaseFare, distance }) {
  if (typeof customFare === "number") return customFare;
  if (typeof routeBaseFare === "number") return routeBaseFare;
  return Math.round(500 + distance * 70);
}
