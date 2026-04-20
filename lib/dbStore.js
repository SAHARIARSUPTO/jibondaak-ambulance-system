// Permanently delete a booking by ID
export async function deleteBookingById(bookingId) {
  const db = await getDb();
  const result = await db
    .collection("bookings")
    .deleteOne({ _id: String(bookingId) });
  return result.deletedCount > 0;
}
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { randomUUID } from "crypto";

// --- Hospital Data Model & CRUD ---
export async function createHospital(hospital) {
  const db = await getDb();
  const now = new Date();
  const doc = {
    _id: makeId("hosp"),
    createdAt: now,
    updatedAt: now,
    ...hospital,
  };
  await db.collection("hospitals").insertOne(doc);
  return doc;
}

export async function updateHospital(hospitalId, patch) {
  const db = await getDb();
  const now = new Date();

  // Build query to support both custom string IDs and ObjectIds
  const query = { _id: String(hospitalId) };
  if (ObjectId.isValid(hospitalId)) {
    query.$or = [
      { _id: String(hospitalId) },
      { _id: new ObjectId(hospitalId) },
    ];
    delete query._id;
  }

  const updated = await db.collection("hospitals").findOneAndUpdate(
    query,
    { $set: { ...patch, updatedAt: now } },
    {
      returnDocument: "after",
      includeResultMetadata: false, // Ensure direct document return
    },
  );

  // Return result directly (handles both new and old driver versions)
  return updated?.value !== undefined ? updated.value : updated;
}

export async function deleteHospital(hospitalId) {
  const db = await getDb();
  await db.collection("hospitals").deleteOne({ _id: String(hospitalId) });
  return true;
}

export async function listHospitalsByLocation({
  division_id,
  district_id,
  upazila_id,
}) {
  const db = await getDb();

  const normalizeValue = (value) => {
    if (value === undefined || value === null) return value;
    const asString = String(value);
    const asNumber = Number(value);
    return Number.isFinite(asNumber) ? [asString, asNumber] : [asString];
  };

  const filter = {};
  if (division_id) filter.division_id = { $in: normalizeValue(division_id) };
  if (district_id) filter.district_id = { $in: normalizeValue(district_id) };
  if (upazila_id) filter.upazila_id = { $in: normalizeValue(upazila_id) };

  let hospitals = await db
    .collection("hospitals")
    .find(filter)
    .sort({ name: 1 })
    .toArray();

  if (hospitals.length === 0 && division_id) {
    hospitals = await db
      .collection("hospitals")
      .find({ division_id: { $in: normalizeValue(division_id) } })
      .sort({ name: 1 })
      .toArray();
  }

  return hospitals;
}

export async function getHospitalById(hospitalId) {
  const db = await getDb();
  return db.collection("hospitals").findOne({ _id: String(hospitalId) });
}

export async function getHospitalByUserId(userId) {
  const db = await getDb();
  return db.collection("hospitals").findOne({ userId: String(userId) });
}

const DB_NAME = "jibondaak";
const ACTIVE_STATUSES = [
  "pending_driver_acceptance",
  "driver_assigned",
  "en_route",
  "arrived",
  "trip_started",
  "awaiting_seeker_approval",
  "destination_reached",
];

export function makeId(prefix) {
  return `${prefix}_${Date.now()}_${randomUUID().slice(0, 8)}`;
}

export async function getDb() {
  const client = await clientPromise;
  return client.db(DB_NAME);
}

export function isMongoConnectivityError(error) {
  const code = error?.code || "";
  const message = error?.message || "";
  return (
    code === "ETIMEOUT" ||
    message.includes("querySrv ETIMEOUT") ||
    message.includes("MongoNetworkError") ||
    message.includes("ENOTFOUND") ||
    message.includes("ECONNREFUSED") ||
    message.includes("MongoServerSelectionError")
  );
}

export async function upsertDriverProfile(providerId, profile = {}) {
  const db = await getDb();
  const now = new Date();
  const providerKey = String(providerId);
  const driverId = `provider_${providerKey}`;

  const setPayload = {
    providerId: providerKey,
    id: driverId,
    updatedAt: now,
    ...profile,
  };

  await db.collection("drivers").updateOne(
    { providerId: providerKey },
    {
      $set: setPayload,
      $setOnInsert: { createdAt: now },
    },
    { upsert: true },
  );

  return db.collection("drivers").findOne({ providerId: providerKey });
}

export async function getDriverById(driverId) {
  const db = await getDb();
  if (!driverId) return null;
  const idStr = String(driverId);

  // Check both the custom string ID and the MongoDB ObjectId
  const query = {
    $or: [{ id: idStr }],
  };
  if (ObjectId.isValid(idStr)) {
    query.$or.push({ _id: new ObjectId(idStr) });
  }

  return db.collection("drivers").findOne(query);
}

export async function listAvailableDriversFromDb() {
  const db = await getDb();
  const drivers = await db.collection("drivers").find({}).toArray();
  if (!drivers.length) return [];

  const providerIds = drivers.map((d) => String(d.providerId));
  const statuses = await db
    .collection("provider_status")
    .find({ providerId: { $in: providerIds } })
    .toArray();
  const statusMap = new Map(
    statuses.map((s) => [String(s.providerId), Boolean(s.isOnline)]),
  );

  return drivers.map((driver) => ({
    ...driver,
    status: statusMap.get(String(driver.providerId)) ? "available" : "offline",
  }));
}

export async function listProviderAmbulances(providerId) {
  const db = await getDb();
  return db
    .collection("ambulances")
    .find({ providerId: String(providerId) })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function createProviderAmbulance(providerId, ambulancePatch) {
  const db = await getDb();
  const providerKey = String(providerId);
  const now = new Date();

  const doc = {
    _id: makeId("amb"),
    providerId: providerKey,
    isAvailable: true,
    createdAt: now,
    updatedAt: now,
    ...ambulancePatch,
  };

  await db.collection("ambulances").insertOne(doc);
  return doc;
}

export async function upsertProviderAmbulance(providerId, ambulancePatch) {
  const db = await getDb();
  const providerKey = String(providerId);
  const now = new Date();

  const existing = await db
    .collection("ambulances")
    .findOne({ providerId: providerKey });
  const doc = {
    _id: existing?._id || makeId("amb"),
    providerId: providerKey,
    isAvailable: true,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
    ...existing,
    ...ambulancePatch,
  };

  await db
    .collection("ambulances")
    .replaceOne({ providerId: providerKey }, doc, { upsert: true });
  return doc;
}

// Utility to bulk update division_id for ambulances if missing
export async function syncAmbulanceLocations(providerId, locationPatch) {
  const db = await getDb();
  return db
    .collection("ambulances")
    .updateMany(
      { providerId: String(providerId) },
      { $set: { ...locationPatch, updatedAt: new Date() } },
    );
}

// Get ambulances by division
export async function listAmbulancesByDivision(divisionId) {
  const db = await getDb();
  // Convert divisionId to both string and number to handle any format
  const divIdStr = String(divisionId);
  const divIdNum = Number(divisionId);

  const ambulances = await db
    .collection("ambulances")
    .find({
      division_id: { $in: [divIdStr, divIdNum] },
    })
    .sort({ createdAt: -1 })
    .toArray();
  return ambulances;
}

export async function setProviderOnline(providerId, isOnline) {
  const db = await getDb();
  const providerKey = String(providerId);
  const now = new Date();
  const online = Boolean(isOnline);

  await db.collection("provider_status").updateOne(
    { providerId: providerKey },
    {
      $set: {
        providerId: providerKey,
        isOnline: online,
        updatedAt: now,
      },
      $setOnInsert: { createdAt: now },
    },
    { upsert: true },
  );

  if (online) {
    await db
      .collection("notifications")
      .updateMany(
        { providerId: providerKey, status: "queued_offline" },
        { $set: { status: "delivered", deliveredAt: now, updatedAt: now } },
      );
  }

  return online;
}

export async function getProviderOnline(providerId) {
  const db = await getDb();
  const doc = await db
    .collection("provider_status")
    .findOne({ providerId: String(providerId) });
  return Boolean(doc?.isOnline);
}

export async function setRouteFare(driverId, routeId, amount) {
  const db = await getDb();
  const now = new Date();
  await db.collection("route_fares").updateOne(
    { driverId: String(driverId), routeId: String(routeId) },
    {
      $set: {
        driverId: String(driverId),
        routeId: String(routeId),
        amount: Number(amount),
        updatedAt: now,
      },
      $setOnInsert: { createdAt: now },
    },
    { upsert: true },
  );
  return Number(amount);
}

export async function getRouteFare(driverId, routeId) {
  const db = await getDb();
  const doc = await db
    .collection("route_fares")
    .findOne({ driverId: String(driverId), routeId: String(routeId) });
  return typeof doc?.amount === "number" ? doc.amount : undefined;
}

export async function getAllDriverRouteFares(driverId) {
  const db = await getDb();
  const docs = await db
    .collection("route_fares")
    .find({ driverId: String(driverId) })
    .toArray();
  return docs.reduce((acc, doc) => {
    acc[doc.routeId] = doc.amount;
    return acc;
  }, {});
}

export async function saveBooking(bookingPatch) {
  const db = await getDb();
  const now = new Date();
  const doc = {
    _id: bookingPatch._id || makeId("booking"),
    createdAt: now,
    updatedAt: now,
    ...bookingPatch,
  };
  await db.collection("bookings").insertOne(doc);
  return doc;
}

export async function getBookingById(bookingId) {
  const db = await getDb();
  return db.collection("bookings").findOne({ _id: String(bookingId) });
}

export async function updateBookingStatus(bookingId, status, patch = {}) {
  const db = await getDb();
  const now = new Date();
  const updated = await db.collection("bookings").findOneAndUpdate(
    { _id: String(bookingId) },
    {
      $set: {
        status,
        ...patch,
        updatedAt: now,
      },
    },
    { returnDocument: "after" },
  );
  return updated || null;
}

export async function cancelBookingById(bookingId) {
  return updateBookingStatus(bookingId, "cancelled", {
    cancelledAt: new Date(),
  });
}

export async function getActiveBookingByUserId(userId) {
  const db = await getDb();
  return db.collection("bookings").findOne(
    {
      userId: String(userId),
      status: { $in: ACTIVE_STATUSES },
    },
    { sort: { createdAt: -1 } },
  );
}

export async function listPendingRequests(providerId) {
  const db = await getDb();
  const query = {
    status: "pending_driver_acceptance",
  };

  if (providerId) {
    query.providerId = String(providerId);
  }

  return db
    .collection("bookings")
    .find(query)
    .sort({ createdAt: -1 })
    .toArray();
}

export async function listActiveBookings(providerId) {
  const db = await getDb();
  const query = {
    status: {
      $in: [
        "driver_assigned",
        "en_route",
        "arrived",
        "trip_started",
        "destination_reached",
        "awaiting_seeker_approval",
      ],
    },
  };
  if (providerId) {
    query.providerId = String(providerId);
  }
  return db
    .collection("bookings")
    .find(query)
    .sort({ createdAt: -1 })
    .toArray();
}

export async function listBookingsByProvider(providerId) {
  const db = await getDb();
  return db
    .collection("bookings")
    .find({ providerId: String(providerId) })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function acceptRequest(bookingId, providerId) {
  const now = new Date();
  const db = await getDb();
  const result = await db.collection("bookings").findOneAndUpdate(
    {
      _id: String(bookingId),
      status: "pending_driver_acceptance",
    },
    {
      $set: {
        status: "driver_assigned",
        providerId: String(providerId),
        acceptedAt: now,
        updatedAt: now,
      },
    },
    { returnDocument: "after" },
  );

  if (result) {
    await db
      .collection("notifications")
      .updateMany(
        { bookingId: String(bookingId), type: "booking_assigned" },
        { $set: { status: "accepted", acceptedAt: now, updatedAt: now } },
      );
  }

  return result || null;
}

export async function rejectRequest(bookingId, providerId) {
  const now = new Date();
  const db = await getDb();
  const result = await db.collection("bookings").findOneAndUpdate(
    {
      _id: String(bookingId),
      status: "pending_driver_acceptance",
    },
    {
      $set: {
        status: "rejected",
        providerId: String(providerId),
        rejectedAt: now,
        updatedAt: now,
      },
    },
    { returnDocument: "after" },
  );

  if (result) {
    await db
      .collection("notifications")
      .updateMany(
        { bookingId: String(bookingId), type: "booking_assigned" },
        { $set: { status: "rejected", rejectedAt: now, updatedAt: now } },
      );
  }

  return result || null;
}

export async function createDriverAssignmentNotification({
  bookingId,
  providerId,
  driverId,
  isOnline,
}) {
  const db = await getDb();
  const now = new Date();
  const notification = {
    _id: makeId("notif"),
    bookingId: String(bookingId),
    providerId: String(providerId),
    driverId: String(driverId),
    type: "booking_assigned",
    status: isOnline ? "delivered" : "queued_offline",
    sentAt: now,
    deliveredAt: isOnline ? now : null,
    createdAt: now,
    updatedAt: now,
  };
  await db.collection("notifications").insertOne(notification);
  return notification;
}

export async function saveChatMessage(bookingId, messagePatch) {
  const db = await getDb();
  const message = {
    _id: messagePatch._id || makeId("chat"),
    bookingId: String(bookingId),
    createdAt: new Date(),
    ...messagePatch,
  };
  await db.collection("chats").insertOne(message);
  return message;
}

export async function getChatMessages(bookingId) {
  const db = await getDb();
  return db
    .collection("chats")
    .find({ bookingId: String(bookingId) })
    .sort({ createdAt: 1 })
    .toArray();
}
