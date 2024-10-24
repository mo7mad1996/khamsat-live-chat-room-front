import { ref, onUnmounted } from "vue";
import { io } from "socket.io-client";
const socket = io(import.meta.env.VITE_API_URL);

export function useSocket() {
  const isConnected = ref(false);

  // Handle connection
  socket.on("connect", () => (isConnected.value = true));

  // Handle disconnection
  socket.on("disconnect", () => (isConnected.value = false));

  return {
    socket,
    isConnected,
  };
}
