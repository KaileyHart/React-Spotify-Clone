import { getRefreshToken } from './spotify';

/**
 * Safe JSON deserializer that prevents JSON parsing errors
 * when the API returns non-JSON responses (like HTML error pages)
 */
class SafeResponseDeserializer {
    async deserialize(response) {
        try {
            const text = await response.text();
            const contentType = response.headers.get("content-type") || '';

            // Only parse as JSON if we have content and the correct content type
            if (text.length > 0 && contentType.includes("application/json")) {
                const json = JSON.parse(text);
                return json;
            }

            // Return null for non-JSON responses
            console.log('Non-JSON response received:', {
                status: response.status,
                contentType,
                text: text.substring(0, 100) + (text.length > 100 ? '...' : '')
            });
            return null;

        } catch (error) {
            console.error('Error deserializing response:', error);
            return null;
        }
    }
}

/**
 * Safe Spotify API wrapper that handles authentication and response parsing
 */
class SafeSpotifyAPI {
    constructor() {
        this.deserializer = new SafeResponseDeserializer();
        this.baseURL = 'https://api.spotify.com/v1';
    }

    /**
     * Make a safe API request with proper error handling
     */
    async makeRequest(endpoint, options = {}) {
        try {

            // *Ensure we have a valid token
            const token = await getRefreshToken();

            console.log('token', token);
            if (!token) {
                throw new Error('No valid authentication token available');
            }

            const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`;

            const requestOptions = {
                ...options,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            };

            console.log('Making Spotify API request:', { url, method: options.method || 'GET' });

            const response = await fetch(url, requestOptions);

            console.log('response', response);

            console.log('url', url);

            console.log('requestOptions', requestOptions);

            // Handle different HTTP status codes
            if (response.status === 401) {
                throw new Error('Authentication failed - please log in again');
            } else if (response.status === 403) {
                throw new Error('Insufficient permissions - Premium account may be required');
            } else if (response.status === 404) {
                throw new Error('Resource not found - device may be inactive');
            } else if (response.status === 429) {
                throw new Error('Rate limited - please wait a moment');
            } else if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            // Use our safe deserializer
            const data = await this.deserializer.deserialize(response);
            return { success: true, data, status: response.status };

        } catch (error) {
            console.error('Spotify API request failed:', error);
            return { success: false, error: error.message, status: error.status };
        }
    }

    /**
     * Skip to the next track
     */
    async skipToNext(deviceId = null) {
        const endpoint = '/me/player/next';
        const params = deviceId ? `?device_id=${deviceId}` : '';

        return await this.makeRequest(`${endpoint}${params}`, {
            method: 'POST'
        });
    }

    /**
     * Skip to the previous track
     */
    async skipToPrevious(deviceId = null) {
        const endpoint = '/me/player/previous';
        const params = deviceId ? `?device_id=${deviceId}` : '';

        return await this.makeRequest(`${endpoint}${params}`, {
            method: 'POST'
        });
    }

    /**
     * Get current playback state
     */
    async getCurrentPlaybackState() {
        return await this.makeRequest('/me/player');
    }

    /**
     * Get available devices
     */
    async getDevices() {
        return await this.makeRequest('/me/player/devices');
    }

    /**
     * Pause playback
     */
    async pause(deviceId = null) {
        const endpoint = '/me/player/pause';
        const params = deviceId ? `?device_id=${deviceId}` : '';

        return await this.makeRequest(`${endpoint}${params}`, {
            method: 'PUT'
        });
    }

    /**
     * Resume playback
     */
    async play(deviceId = null, contextUri = null, uris = null) {
        const endpoint = '/me/player/play';
        const params = deviceId ? `?device_id=${deviceId}` : '';

        let body = {};
        if (contextUri) body.context_uri = contextUri;
        if (uris) body.uris = uris;

        return await this.makeRequest(`${endpoint}${params}`, {
            method: 'PUT',
            body: Object.keys(body).length > 0 ? JSON.stringify(body) : undefined
        });
    }

    /**
     * Get currently playing track
     */
    async getCurrentlyPlaying() {
        return await this.makeRequest('/me/player/currently-playing');
    }
}

// Export singleton instance
export const safeSpotifyAPI = new SafeSpotifyAPI();
export default SafeSpotifyAPI;
