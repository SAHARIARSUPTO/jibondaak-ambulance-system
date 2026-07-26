"use client";

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import { io } from "socket.io-client";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Navigation, MapPin, Clock, AlertCircle, Loader2 } from "lucide-react";

// Custom icons - initialized lazily to avoid SSR issues
let ambulanceIcon = null;
let hospitalIcon = null;
let pickupIcon = null;

// Initialize Leaflet icons only on client side
if (typeof window !== 'undefined') {
  // Fix default marker icon issue in Leaflet with React
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });

  // Custom ambulance icon
  ambulanceIcon = L.divIcon({
    className: "custom-ambulance-icon",
    html: `
      <div style="
        background: #dc2626;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <rect x="2" y="7" width="20" height="14" rx="2" />
          <path d="M16 21V7a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v14" />
        </svg>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });

  // Custom hospital icon
  hospitalIcon = L.divIcon({
    className: "custom-hospital-icon",
    html: `
      <div style="
        background: #2563eb;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <path d="M3 21h18" />
          <path d="M5 21V7l8-4 8 4v14" />
          <path d="M8 9a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2H8V9z" />
        </svg>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });

  // Custom pickup icon
  pickupIcon = L.divIcon({
    className: "custom-pickup-icon",
    html: `
      <div style="
        background: #16a34a;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
}

// Component to auto-fit map bounds
function MapBounds({ positions }) {
  const map = useMap();
  
  useEffect(() => {
    if (positions.length > 0) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
    }
  }, [positions, map]);
  
  return null;
}

export default function LiveTrackingMap({ bookingId, hospitalId, userId, userType }) {
  const [socket, setSocket] = useState(null);
  const [driverLocation, setDriverLocation] = useState(null);
  const [pickupLocation, setPickupLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [route, setRoute] = useState([]);
  const [status, setStatus] = useState("connecting");
  const [distanceRemaining, setDistanceRemaining] = useState(null);
  const [eta, setEta] = useState(null);
  const [error, setError] = useState(null);
  const [driverInfo, setDriverInfo] = useState(null);
  
  const mapRef = useRef(null);
  const socketRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    // Prevent multiple socket connections
    if (socketRef.current) {
      console.log("Socket already exists, skipping connection");
      return;
    }

    // Initialize Socket.io connection with auto-reconnect config
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";
    const newSocket = io(socketUrl, {
      auth: {
        userId,
        userType,
      },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000,
      transports: ["websocket", "polling"],
    });

    // Store socket in ref to prevent re-connections
    socketRef.current = newSocket;

    // Connection event handlers
    newSocket.on("connect", () => {
      if (!isMountedRef.current) return;
      console.log("Connected to Socket.io server");
      setStatus("connected");
      setError(null);
    });

    newSocket.on("connect_error", (err) => {
      if (!isMountedRef.current) return;
      console.error("Socket connection error:", err);
      setStatus("error");
      setError(`Failed to connect: ${err.message || "Unknown error"}`);
    });

    newSocket.on("disconnect", (reason) => {
      if (!isMountedRef.current) return;
      console.log("Socket disconnected:", reason);
      if (reason === "io server disconnect") {
        // Server disconnected the socket, reconnect manually
        newSocket.connect();
      } else {
        setStatus("disconnected");
      }
    });

    newSocket.on("reconnect", (attemptNumber) => {
      if (!isMountedRef.current) return;
      console.log("Reconnected after", attemptNumber, "attempts");
      setStatus("connected");
      setError(null);
      // Re-subscribe to tracking after reconnection
      newSocket.emit("hospital:subscribe_tracking", { bookingId });
    });

    newSocket.on("reconnect_attempt", (attemptNumber) => {
      if (!isMountedRef.current) return;
      console.log("Reconnection attempt:", attemptNumber);
      setStatus("reconnecting");
    });

    newSocket.on("reconnect_failed", () => {
      if (!isMountedRef.current) return;
      console.error("Reconnection failed");
      setStatus("error");
      setError("Failed to reconnect to tracking server");
    });

    // Authentication handlers
    newSocket.on("auth:success", (data) => {
      if (!isMountedRef.current) return;
      console.log("Authenticated:", data);
      
      // Subscribe to tracking updates
      newSocket.emit("hospital:subscribe_tracking", { bookingId });
    });

    newSocket.on("auth:error", (data) => {
      if (!isMountedRef.current) return;
      console.error("Auth error:", data);
      setStatus("error");
      setError(data.error || "Authentication failed");
    });

    // Tracking event handlers
    newSocket.on("hospital:tracking_started", (data) => {
      if (!isMountedRef.current) return;
      console.log("Tracking started:", data);
      setStatus("tracking");
    });

    newSocket.on("hospital:driver_assigned", (data) => {
      if (!isMountedRef.current) return;
      console.log("Driver assigned:", data);
      setDriverInfo(data.driverInfo);
      setEta(data.estimatedArrival);
    });

    newSocket.on("hospital:location_update", (data) => {
      if (!isMountedRef.current) return;
      console.log("Location update:", data);
      setDriverLocation(data.location);
      setDistanceRemaining(data.distanceRemaining);
      setEta(data.eta);
      
      // Update route with new location
      setRoute((prevRoute) => {
        if (pickupLocation && destination) {
          return [
            [data.location.latitude, data.location.longitude],
            [pickupLocation.latitude, pickupLocation.longitude],
            [destination.latitude, destination.longitude],
          ];
        }
        return prevRoute;
      });
    });

    newSocket.on("hospital:driver_status_update", (data) => {
      if (!isMountedRef.current) return;
      console.log("Driver status update:", data);
      setStatus(data.status);
    });

    // General error handler
    newSocket.on("error", (data) => {
      if (!isMountedRef.current) return;
      console.error("Socket error:", data);
      setError(data.message || "An error occurred");
    });

    // Set socket in state after all listeners are attached
    setSocket(newSocket);

    // Fetch initial booking data
    fetchInitialBookingData();

    // Cleanup function
    return () => {
      isMountedRef.current = false;
      
      // Remove all event listeners
      newSocket.off("connect");
      newSocket.off("connect_error");
      newSocket.off("disconnect");
      newSocket.off("reconnect");
      newSocket.off("reconnect_attempt");
      newSocket.off("reconnect_failed");
      newSocket.off("auth:success");
      newSocket.off("auth:error");
      newSocket.off("hospital:tracking_started");
      newSocket.off("hospital:driver_assigned");
      newSocket.off("hospital:location_update");
      newSocket.off("hospital:driver_status_update");
      newSocket.off("error");
      
      // Unsubscribe from tracking
      if (newSocket.connected) {
        newSocket.emit("hospital:unsubscribe_tracking", { bookingId });
      }
      
      // Disconnect socket
      newSocket.disconnect();
      
      // Clear ref
      socketRef.current = null;
    };
  }, [bookingId, hospitalId, userId, userType]);

  const fetchInitialBookingData = async () => {
    try {
      const response = await fetch(`/api/bookings/driver-location?bookingId=${bookingId}`);
      const data = await response.json();
      
      if (data.success) {
        const booking = await fetch(`/api/bookings/active/${bookingId}`).then(r => r.json());
        if (booking.success) {
          const bookingData = booking.booking;
          setDriverLocation(bookingData.driverCurrentLocation);
          setPickupLocation(bookingData.userLocation);
          setDestination(bookingData.destination);
          
          if (bookingData.driverCurrentLocation && bookingData.userLocation) {
            setRoute([
              [bookingData.driverCurrentLocation.latitude, bookingData.driverCurrentLocation.longitude],
              [bookingData.userLocation.latitude, bookingData.userLocation.longitude],
            ]);
          }
          
          if (bookingData.driverInfo) {
            setDriverInfo(bookingData.driverInfo);
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch initial booking data:", err);
    }
  };

  const formatDistance = (meters) => {
    if (meters < 1000) {
      return `${Math.round(meters)}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  };

  const formatTime = (date) => {
    if (!date) return "--";
    const now = new Date();
    const diff = new Date(date) - now;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return "Arriving now";
    if (minutes < 60) return `${minutes} min`;
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  };

  if (status === "connecting") {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-slate-50 rounded-2xl">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-red-600 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-600">Connecting to tracking server...</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-red-50 rounded-2xl">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
          <p className="text-sm font-bold text-red-600">{error || "Connection failed"}</p>
          <button
            onClick={() => typeof window !== 'undefined' && window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const mapPositions = [];
  if (driverLocation) mapPositions.push([driverLocation.latitude, driverLocation.longitude]);
  if (pickupLocation) mapPositions.push([pickupLocation.latitude, pickupLocation.longitude]);
  if (destination) mapPositions.push([destination.latitude, destination.longitude]);

  return (
    <div className="space-y-4">
      {/* Status Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${status === "tracking" ? "bg-green-500 animate-pulse" : "bg-slate-300"}`} />
            <span className="text-sm font-bold text-slate-700 capitalize">
              {status === "tracking" ? "Live Tracking Active" : status}
            </span>
          </div>
          
          {driverInfo && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <Navigation className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">{driverInfo.name}</p>
                <p className="text-[10px] text-slate-500">{driverInfo.ambulanceNumber}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span className="text-[10px] font-bold text-slate-400 uppercase">Distance</span>
          </div>
          <p className="text-lg font-black text-slate-900">
            {distanceRemaining ? formatDistance(distanceRemaining) : "--"}
          </p>
        </div>
        
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-orange-600" />
            <span className="text-[10px] font-bold text-slate-400 uppercase">ETA</span>
          </div>
          <p className="text-lg font-black text-slate-900">
            {formatTime(eta)}
          </p>
        </div>
        
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-2">
            <Navigation className="w-4 h-4 text-red-600" />
            <span className="text-[10px] font-bold text-slate-400 uppercase">Status</span>
          </div>
          <p className="text-lg font-black text-slate-900 capitalize">
            {status === "tracking" ? "En Route" : status}
          </p>
        </div>
      </div>

      {/* Map */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100" style={{ height: "500px" }}>
        {driverLocation ? (
          <MapContainer
            center={[driverLocation.latitude, driverLocation.longitude]}
            zoom={14}
            style={{ height: "100%", width: "100%" }}
            ref={mapRef}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <MapBounds positions={mapPositions} />
            
            {/* Driver/Ambulance Marker */}
            {driverLocation && (
              <Marker
                position={[driverLocation.latitude, driverLocation.longitude]}
                icon={ambulanceIcon}
              >
                <Popup>
                  <div className="text-sm">
                    <p className="font-bold">Ambulance</p>
                    <p className="text-xs text-slate-600">
                      Speed: {driverLocation.speed || 0} km/h
                    </p>
                    <p className="text-xs text-slate-600">
                      Updated: {new Date(driverLocation.updatedAt).toLocaleTimeString()}
                    </p>
                  </div>
                </Popup>
              </Marker>
            )}
            
            {/* Pickup Location Marker */}
            {pickupLocation && (
              <Marker
                position={[pickupLocation.latitude, pickupLocation.longitude]}
                icon={pickupIcon}
              >
                <Popup>
                  <div className="text-sm">
                    <p className="font-bold">Pickup Location</p>
                    <p className="text-xs text-slate-600">
                      {pickupLocation.address || "Patient Location"}
                    </p>
                  </div>
                </Popup>
              </Marker>
            )}
            
            {/* Destination/Hospital Marker */}
            {destination && (
              <Marker
                position={[destination.latitude, destination.longitude]}
                icon={hospitalIcon}
              >
                <Popup>
                  <div className="text-sm">
                    <p className="font-bold">Destination</p>
                    <p className="text-xs text-slate-600">
                      {destination.hospitalName || destination.address || "Hospital"}
                    </p>
                  </div>
                </Popup>
              </Marker>
            )}
            
            {/* Route Polyline */}
            {route.length > 1 && (
              <Polyline
                positions={route}
                color="#dc2626"
                weight={4}
                opacity={0.7}
                dashArray="10, 10"
              />
            )}
          </MapContainer>
        ) : (
          <div className="flex items-center justify-center h-full bg-slate-50">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-500">Waiting for driver location...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
