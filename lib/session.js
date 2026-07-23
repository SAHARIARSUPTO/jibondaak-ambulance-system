import { cookies } from 'next/headers';

// This module is server-side only
if (typeof window !== 'undefined') {
  throw new Error('session.js can only be used on the server side');
}

const SESSION_COOKIE_NAME = 'admin_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

/**
 * Create a session by setting a secure HTTP-only cookie
 * @param {Object} userData - User data to store in session
 * @param {string} userData.id - User ID
 * @param {string} userData.email - User email
 * @param {string} userData.role - User role (ADMIN | USER)
 */
export async function createSession(userData) {
  const cookieStore = await cookies();
  
  const sessionData = {
    id: userData.id,
    email: userData.email,
    role: userData.role,
    createdAt: new Date().toISOString(),
  };

  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(sessionData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });
}

/**
 * Get the current session from cookies
 * @returns {Promise<Object|null>} Session data or null if not authenticated
 */
export async function getSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie) {
    return null;
  }

  try {
    const sessionData = JSON.parse(sessionCookie.value);
    return sessionData;
  } catch (error) {
    // Invalid session data
    return null;
  }
}

/**
 * Destroy the current session by clearing the cookie
 */
export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

/**
 * Check if the current user is authenticated and has ADMIN role
 * @returns {Promise<boolean>} True if user is authenticated admin
 */
export async function isAdminAuthenticated() {
  const session = await getSession();
  return session && session.role === 'ADMIN';
}

/**
 * Get the current authenticated admin user
 * @returns {Promise<Object|null>} Admin user data or null if not authenticated
 */
export async function getCurrentAdmin() {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    return null;
  }
  return session;
}

/**
 * Require admin authentication - throw error if not authenticated
 * @throws {Error} If user is not authenticated as admin
 * @returns {Promise<Object>} Admin user data
 */
export async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    throw new Error('Unauthorized: Admin access required');
  }
  return admin;
}
