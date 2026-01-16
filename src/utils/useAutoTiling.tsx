import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useConfig } from "../context/ConfigContext";

export const useAutoTiling = () => {
  const queryClient = useQueryClient();
  const { useAutoTiling: isAutoTilingEnabled } = useConfig();
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Default WebSocket URI - can be made configurable later
  const autoTilingWebSocketUri = 'ws://localhost:6123';

  const scheduleReconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000); // Exponential backoff, max 30s
    reconnectAttempts.current++;
    
    console.log(`Scheduling reconnect attempt ${reconnectAttempts.current} in ${delay}ms`);
    
    reconnectTimeoutRef.current = setTimeout(() => {
      connectWebSocket();
    }, delay);
  };

  const connectWebSocket = () => {
    // Only connect to WebSocket if auto-tiling is enabled
    if (!isAutoTilingEnabled) return;

    try {
      const websocket = new WebSocket(autoTilingWebSocketUri);

      websocket.onopen = () => {
        console.log("WebSocket connected successfully");
        websocket.send("sub -e window_managed");
        reconnectAttempts.current = 0; // Reset on successful connection
      };

      websocket.onmessage = async (event) => {
        try {
          const response = JSON.parse(event.data);

          if (response.messageType === "client_response") {
            console.log(`Event subscription: ${response.success}`);
          } else if (response.messageType === "event_subscription") {
            const tilingSize = response?.data?.managedWindow?.tilingSize;

            if (tilingSize !== null && tilingSize <= 0.5) {
              websocket.send("c toggle-tiling-direction");
            }

            queryClient.setQueryData(["tilingSize"], tilingSize);
          }
        } catch (err) {
          console.error("Error parsing WebSocket message:", err);
        }
      };

      websocket.onerror = (error) => {
        console.error("WebSocket error:", error);
        if (reconnectAttempts.current < maxReconnectAttempts) {
          scheduleReconnect();
        }
      };

      websocket.onclose = () => {
        console.log("WebSocket connection closed");
        if (reconnectAttempts.current < maxReconnectAttempts) {
          scheduleReconnect();
        }
      };

      return () => {
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        websocket.close();
      };
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
      if (reconnectAttempts.current < maxReconnectAttempts) {
        scheduleReconnect();
      }
    }
  };

  useEffect(() => {
    const cleanup = connectWebSocket();
    return cleanup;
  }, [isAutoTilingEnabled, queryClient]);

  return {
    tilingSize: queryClient.getQueryData(["tilingSize"]),
    isAutoTilingEnabled,
  };
};

export default useAutoTiling;
