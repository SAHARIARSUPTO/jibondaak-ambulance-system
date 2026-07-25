/**
 * Hook for driver location tracking via Socket.io
 * Provides functions to send location updates and status updates to the tracking server
 */

import { useEffect, useState, useRef, useCallback } from "react";
import { io } from "socket.io-client";

export function useDriverLocationTracking({ bookingId, providerId, driverId, enabled = true }) {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [lastLocation, setLastLocation] = useState(null);
  const [error, setError] = useState(null);
  
  const watchIdRef = useRef(null);
  const streamingIntervalRef = useRef(null);

  // Initialize Socket.io connection
  useEffect(() => {
    if (!enabled || !providerId || !driverId) return;

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";
    const newSocket = io(socketUrl, {
      auth: {
        userId: providerId,
        userType: "provider",
      },
    });

    newSocket.on("connect", () => {
      console.log("Driver connected to tracking server");
      setConnected(true);
      setError(null);
    });

    newSocket.on("connect_error", (err) => {
      console.error("Driver socket connection error:", err);
      setConnected(false);
      setError("Failed to connect to tracking server");
    });

    newSocket.on("auth:success", (data) => {
      console.log("Driver authenticated:", data);
    });

    newSocket.on("driver:request_received", (data) => {
      console.log("New booking request received:", data);
      // Handle incoming booking requests
    });

    newSocket.on("driver:location_update_ack", (data) => {
      console.log("Location update acknowledged:", data);
    });

    newSocket.on("driver:status_update_ack", (data) => {
      console.log("Status update acknowledged:", data);
    });

    newSocket.on("error", (data) => {
      console.error("Socket error:", data);
      setError(data.message || "An error occurred");
    });

    setSocket(newSocket);

    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (streamingIntervalRef.current) {
        clearInterval(streamingIntervalRef.current);
      }
      newSocket.disconnect();
    };
  }, [enabled, providerId, driverId]);

  /**
   * Accept a booking request
   */
  const acceptRequest = useCallback(() => {
    if (!socket || !bookingId) return;
    
    socket.emit("driver:accept_request", {
      bookingId,
      providerId,
      driverId,
    });
  }, [socket, bookingId, providerId, driverId]);

  /**
   * Send location update to server
   */
  const updateLocation = useCallback((location) => {
    if (!socket || !bookingId) return;
    
    const locationData = {
      latitude: location.latitude || location.coords?.latitude,
      longitude: location.longitude || location.coords?.longitude,
      heading: location.heading || location.coords?.heading || 0,
      speed: location.speed || location.coords?.speed || 0,
      accuracy: location.accuracy || location.coords?.accuracy || 0,
    };

    socket.emit("driver:update_location", {
      bookingId,
      location: locationData,
      status: "moving",
    });

    setLastLocation(locationData);
  }, [socket, bookingId]);

  /**
   * Update trip status
   */
  const updateStatus = useCallback((status) => {
    if (!socket || !bookingId) return;
    
    const validStatuses = ["en_route", "arrived", "trip_started", "completed"];
    if (!validStatuses.includes(status)) {
      console.error("Invalid status:", status);
      return;
    }

    socket.emit("driver:update_status", {
      bookingId,
      status,
    });
  }, [socket, bookingId]);

  /**
   * Start automatic location streaming using GPS
   */
  const startLocationStreaming = useCallback((interval = 5000) => {
    if (!socket || !bookingId) return;
    
    // Start streaming on server
    socket.emit("driver:start_location_stream", {
      bookingId,
      interval,
    });

    // Start GPS tracking
    if ("geolocation" in navigator) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            heading: position.coords.heading,
            speed: position.coords.speed,
            accuracy: position.coords.accuracy,
          };
          updateLocation(location);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setError("Failed to get GPS location");
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    }

    setIsStreaming(true);
  }, [socket, bookingId, updateLocation]);

  /**
   * Stop location streaming
   */
  const stopLocationStreaming = useCallback(() => {
    if (!socket) return;
    
    // Stop streaming on server
    socket.emit("driver:stop_location_stream", {
      bookingId,
    });

    // Stop GPS tracking
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    setIsStreaming(false);
  }, [socket, bookingId]);

  /**
   * Get current location once
   */
  const getCurrentLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!("geolocation" in navigator)) {
        reject(new Error("Geolocation not supported"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            heading: position.coords.heading,
            speed: position.coords.speed,
            accuracy: position.coords.accuracy,
          };
          resolve(location);
          updateLocation(location);
        },
        (error) => {
          console.error("Geolocation error:", error);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  }, [updateLocation]);

  return {
    connected,
    isStreaming,
    lastLocation,
    error,
    acceptRequest,
    updateLocation,
    updateStatus,
    startLocationStreaming,
    stopLocationStreaming,
    getCurrentLocation,
  };
}
