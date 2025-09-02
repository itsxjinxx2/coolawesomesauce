import { setStatus, getStatus } from "@vendetta/status";

let interval: NodeJS.Timeout;

export default {
  onLoad: () => {
    // Force DND immediately
    setStatus("dnd");

    // Check every 5 seconds and reset if changed
    interval = setInterval(() => {
      if (getStatus() !== "dnd") {
        setStatus("dnd");
        console.log("[LockDND] Status forced back to DND.");
      }
    }, 5000);

    console.log("[LockDND] Plugin loaded. Status locked to DND.");
  },

  onUnload: () => {
    clearInterval(interval);
    console.log("[LockDND] Plugin unloaded. Status unlocked.");
  }
};
