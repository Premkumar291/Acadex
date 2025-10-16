import { checkAuth } from '../api/auth';

let currentUser = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

/**
 * Get current user's college name with caching
 * @returns {Promise<string|null>} College name or null if not available
 */
export const getCurrentUserCollegeName = async () => {
  const now = Date.now();
  
  // Return cached user if still valid
  if (currentUser && (now - lastFetchTime) < CACHE_DURATION) {
    return currentUser.collegeName || null;
  }
  
  try {
    const authResponse = await checkAuth();
    if (authResponse.success && authResponse.user) {
      currentUser = authResponse.user;
      lastFetchTime = now;
      return authResponse.user.collegeName || null;
    }
  } catch (error) {
    console.error('Error fetching current user:', error);
  }
  
  return null;
};