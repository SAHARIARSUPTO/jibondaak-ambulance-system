"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Bell, X, Navigation, Clock, MapPin, CheckCircle, AlertCircle } from "lucide-react";

export default function NotificationSystem({ hospitalId, userId, userType = "hospital" }) {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    if (!userId || !hospitalId) return;

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";
    const newSocket = io(socketUrl, {
      auth: {
        userId,
        userType,
      },
    });

    newSocket.on("connect", () => {
      console.log("Notification system connected");
    });

    newSocket.on("hospital:driver_assigned", (data) => {
      addNotification({
        type: "driver_assigned",
        title: "Driver Assigned",
        message: `${data.driverInfo?.name || "Driver"} has been assigned to your request`,
        data,
        icon: <Navigation className="w-5 h-5 text-blue-600" />,
        actionLabel: "View Tracking",
        actionUrl: `/tracking/${data.bookingId}`,
      });
    });

    newSocket.on("hospital:location_update", (data) => {
      // Don't add notification for every location update, just update existing
      updateNotification(data.bookingId, {
        message: `Driver is ${data.distanceRemaining ? Math.round(data.distanceRemaining / 1000) : 0}km away`,
        data,
      });
    });

    newSocket.on("hospital:driver_status_update", (data) => {
      const statusMessages = {
        en_route: "Driver is on the way",
        arrived: "Driver has arrived at pickup",
        trip_started: "Trip has started",
        completed: "Trip completed successfully",
      };

      addNotification({
        type: "status_update",
        title: "Status Update",
        message: statusMessages[data.status] || data.message,
        data,
        icon: data.status === "completed" 
          ? <CheckCircle className="w-5 h-5 text-green-600" />
          : <Clock className="w-5 h-5 text-orange-600" />,
      });
    });

    newSocket.on("notification", (data) => {
      addNotification({
        type: data.type,
        title: data.title,
        message: data.message,
        data: data.data,
        icon: <Bell className="w-5 h-5 text-slate-600" />,
      });
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [userId, hospitalId, userType]);

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date(),
      read: false,
      ...notification,
    };

    setNotifications((prev) => [newNotification, ...prev]);
    setUnreadCount((prev) => prev + 1);

    // Auto-dismiss after 10 seconds for non-critical notifications
    if (notification.type !== "driver_assigned" && notification.type !== "status_update") {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, 10000);
    }
  };

  const updateNotification = (bookingId, updates) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.data?.bookingId === bookingId
          ? { ...notif, ...updates, timestamp: new Date() }
          : notif
      )
    );
  };

  const removeNotification = (id) => {
    setNotifications((prev) => {
      const notif = prev.find((n) => n.id === id);
      if (notif && !notif.read) {
        setUnreadCount((count) => Math.max(0, count - 1));
      }
      return prev.filter((n) => n.id !== id);
    });
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount((count) => Math.max(0, count - 1));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
    setUnreadCount(0);
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="relative p-2 rounded-full hover:bg-slate-100 transition-colors"
      >
        <Bell className="w-6 h-6 text-slate-600" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {showPanel && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setShowPanel(false)}
          />

          {/* Panel */}
          <div className="absolute right-0 top-12 w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 max-h-[500px] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900">Notifications</h3>
                <p className="text-xs text-slate-500">
                  {unreadCount} unread
                </p>
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setShowPanel(false)}
                  className="p-1 hover:bg-slate-100 rounded-full"
                >
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-500">No notifications</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors ${
                      !notification.read ? "bg-blue-50/50" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {notification.icon || <Bell className="w-5 h-5 text-slate-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-bold text-slate-900 text-sm">
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1.5" />
                          )}
                        </div>
                        <p className="text-xs text-slate-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-2">
                          {formatTime(notification.timestamp)}
                        </p>
                        {notification.actionLabel && (
                          <button
                            onClick={() => {
                              markAsRead(notification.id);
                              if (notification.actionUrl) {
                                window.location.href = notification.actionUrl;
                              }
                            }}
                            className="mt-2 text-xs font-bold text-blue-600 hover:text-blue-700"
                          >
                            {notification.actionLabel}
                          </button>
                        )}
                      </div>
                      <button
                        onClick={() => removeNotification(notification.id)}
                        className="flex-shrink-0 p-1 hover:bg-slate-200 rounded-full"
                      >
                        <X className="w-3 h-3 text-slate-400" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-slate-100">
              <button
                onClick={() => {
                  setNotifications([]);
                  setUnreadCount(0);
                }}
                className="w-full text-xs font-bold text-slate-500 hover:text-slate-700"
              >
                Clear all notifications
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
