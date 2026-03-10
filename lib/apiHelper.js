/**
 * Safe API fetch with proper error handling
 * Prevents "Unexpected end of JSON input" errors
 */
export async function safeFetch(url, options = {}) {
  try {
    const response = await fetch(url, options);
    
    // Get response text first
    const text = await response.text();
    
    // If empty response
    if (!text || text.trim() === '') {
      return {
        success: false,
        error: 'Empty response from server',
        status: response.status
      };
    }
    
    // Try to parse JSON
    try {
      const data = JSON.parse(text);
      return {
        ...data,
        status: response.status,
        ok: response.ok
      };
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Response text:', text);
      return {
        success: false,
        error: 'Invalid response format',
        status: response.status
      };
    }
  } catch (error) {
    console.error('Fetch error:', error);
    return {
      success: false,
      error: error.message || 'Network error',
      status: 0
    };
  }
}
