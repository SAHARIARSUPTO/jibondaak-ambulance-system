const ACTIVE_STATUSES = [
  "pending_driver_acceptance",
  "driver_assigned",
  "en_route",
  "arrived",
];

function getStore() {
  if (!global.__bookingStore) {
    global.__bookingStore = {
      byId: new Map(),
      byUserId: new Map(),
      chatsByBooking: new Map(),
      providerOnline: new Map(),
      ambulancesByProvider: new Map(),
      routeFaresByDriver: new Map(),
      providerDrivers: new Map(),
    };
  }
  // Backfill newly introduced maps for hot-reload / legacy in-memory store shapes.
  if (!global.__bookingStore.byId) global.__bookingStore.byId = new Map();
  if (!global.__bookingStore.byUserId) global.__bookingStore.byUserId = new Map();
  if (!global.__bookingStore.chatsByBooking) global.__bookingStore.chatsByBooking = new Map();
  if (!global.__bookingStore.providerOnline) global.__bookingStore.providerOnline = new Map();
  if (!global.__bookingStore.ambulancesByProvider) global.__bookingStore.ambulancesByProvider = new Map();
  if (!global.__bookingStore.routeFaresByDriver) global.__bookingStore.routeFaresByDriver = new Map();
  if (!global.__bookingStore.providerDrivers) global.__bookingStore.providerDrivers = new Map();
  return global.__bookingStore;
}

export function saveBooking(booking) {
  const store = getStore();
  store.byId.set(String(booking._id), booking);
  store.byUserId.set(String(booking.userId), String(booking._id));
  return booking;
}

export function getBookingById(bookingId) {
  const store = getStore();
  return store.byId.get(String(bookingId)) || null;
}

export function updateBookingStatus(bookingId, status, patch = {}) {
  const store = getStore();
  const booking = store.byId.get(String(bookingId));
  if (!booking) return null;
  const next = {
    ...booking,
    status,
    ...patch,
    updatedAt: new Date(),
  };
  store.byId.set(String(bookingId), next);

  // Keep active-booking index clean so cancelled/completed items do not resurface.
  if (!ACTIVE_STATUSES.includes(status) && booking.userId) {
    const userKey = String(booking.userId);
    const indexedBookingId = store.byUserId.get(userKey);
    if (indexedBookingId === String(bookingId)) {
      store.byUserId.delete(userKey);
    }
  }

  return next;
}

export function getActiveBookingByUserId(userId) {
  const store = getStore();
  const bookingId = store.byUserId.get(String(userId));
  if (!bookingId) return null;
  const booking = store.byId.get(String(bookingId));
  if (!booking) return null;
  if (!ACTIVE_STATUSES.includes(booking.status)) return null;
  return booking;
}

export function listPendingRequests(providerId) {
  const store = getStore();
  const pending = [];
  for (const booking of store.byId.values()) {
    if (booking.status !== "pending_driver_acceptance") continue;
    if (!providerId) {
      pending.push(booking);
      continue;
    }
    if (booking.providerId === providerId) {
      pending.push(booking);
    }
  }
  return pending.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function listActiveBookings(providerId) {
  const store = getStore();
  const active = [];
  for (const booking of store.byId.values()) {
    if (!["driver_assigned", "en_route", "arrived"].includes(booking.status)) {
      continue;
    }
    if (!providerId || booking.providerId === providerId) {
      active.push(booking);
    }
  }
  return active.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function listBookingsByProvider(providerId) {
  const store = getStore();
  const result = [];
  const key = String(providerId);
  for (const booking of store.byId.values()) {
    if (String(booking.providerId || "") !== key) continue;
    result.push(booking);
  }
  return result.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function acceptRequest(bookingId, providerId) {
  const booking = getBookingById(bookingId);
  if (!booking || booking.status !== "pending_driver_acceptance") return null;
  return updateBookingStatus(bookingId, "driver_assigned", {
    providerId: providerId || booking.providerId || null,
    acceptedAt: new Date(),
  });
}

export function rejectRequest(bookingId, providerId) {
  const booking = getBookingById(bookingId);
  if (!booking || booking.status !== "pending_driver_acceptance") return null;
  return updateBookingStatus(bookingId, "rejected", {
    providerId: providerId || booking.providerId || null,
    rejectedAt: new Date(),
  });
}

export function cancelBookingById(bookingId) {
  return updateBookingStatus(bookingId, "cancelled", {
    cancelledAt: new Date(),
  });
}

export function setProviderOnline(providerId, isOnline) {
  const store = getStore();
  store.providerOnline.set(String(providerId), Boolean(isOnline));
  return Boolean(isOnline);
}

export function getProviderOnline(providerId) {
  const store = getStore();
  return Boolean(store.providerOnline.get(String(providerId)));
}

export function listProviderAmbulances(providerId) {
  const store = getStore();
  return store.ambulancesByProvider.get(String(providerId)) || [];
}

export function addProviderAmbulance(providerId, ambulance) {
  const store = getStore();
  const key = String(providerId);
  const list = store.ambulancesByProvider.get(key) || [];
  // Single-driver model: one provider can maintain only one active vehicle profile.
  const next = [ambulance];
  store.ambulancesByProvider.set(key, next);
  return ambulance;
}

export function hasProviderAmbulance(providerId) {
  const store = getStore();
  const list = store.ambulancesByProvider.get(String(providerId)) || [];
  return list.length > 0;
}

export function upsertProviderDriver(providerId, driverProfile = {}) {
  const store = getStore();
  const providerKey = String(providerId);
  const existing = store.providerDrivers.get(providerKey) || {};
  const next = {
    id: `provider_${providerKey}`,
    providerId: providerKey,
    status: "available",
    ...existing,
    ...driverProfile,
    updatedAt: new Date(),
  };
  store.providerDrivers.set(providerKey, next);
  return next;
}

export function getProviderDriver(providerId) {
  const store = getStore();
  return store.providerDrivers.get(String(providerId)) || null;
}

export function listProviderDrivers() {
  const store = getStore();
  return Array.from(store.providerDrivers.values());
}

export function setRouteFare(driverId, routeId, amount) {
  const store = getStore();
  const key = `${String(driverId)}:${String(routeId)}`;
  store.routeFaresByDriver.set(key, Number(amount));
  return Number(amount);
}

export function getRouteFare(driverId, routeId) {
  const store = getStore();
  const key = `${String(driverId)}:${String(routeId)}`;
  return store.routeFaresByDriver.get(key);
}

export function getAllDriverRouteFares(driverId) {
  const store = getStore();
  const fares = {};
  const prefix = `${String(driverId)}:`;
  for (const [key, amount] of store.routeFaresByDriver.entries()) {
    if (!key.startsWith(prefix)) continue;
    fares[key.slice(prefix.length)] = amount;
  }
  return fares;
}

export function saveChatMessage(bookingId, message) {
  const store = getStore();
  const key = String(bookingId);
  const list = store.chatsByBooking.get(key) || [];
  const next = [...list, message];
  store.chatsByBooking.set(key, next);
  return message;
}

export function getChatMessages(bookingId) {
  const store = getStore();
  return store.chatsByBooking.get(String(bookingId)) || [];
}

export function makeLocalBookingId() {
  return `local_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function makeLocalEntityId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function isMongoConnectivityError(error) {
  const code = error?.code || "";
  const message = error?.message || "";
  return (
    code === "ETIMEOUT" ||
    message.includes("querySrv ETIMEOUT") ||
    message.includes("ENOTFOUND") ||
    message.includes("ECONNREFUSED") ||
    message.includes("MongoServerSelectionError")
  );
}

export function logConnectivityFallback(scope, error) {
  if (!global.__bookingFallbackLogTimes) {
    global.__bookingFallbackLogTimes = new Map();
  }
  const now = Date.now();
  const prev = global.__bookingFallbackLogTimes.get(scope) || 0;
  const THROTTLE_MS = 60000;

  if (now - prev > THROTTLE_MS) {
    global.__bookingFallbackLogTimes.set(scope, now);
    console.warn(
      `[${scope}] MongoDB unreachable, using local fallback (${error?.code || "unknown"})`,
    );
  }
}
