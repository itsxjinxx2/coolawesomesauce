import { Plugin } from "vendetta";

export default class MsgSpam extends Plugin {
  onLoad() {
    this.registerCommand({
      name: "msgspam",
      description: "Spam a message in the current channel as fast as possible without hitting rate limits.",
      options: [
        {
          name: "message",
          description: "The message to spam",
          type: 3, // STRING
          required: true
        },
        {
          name: "count",
          description: "Number of times to send the message",
          type: 4, // INTEGER
          required: true
        }
      ],
      execute: async (args, context) => {
        const message = args.message as string;
        let remaining = args.count as number;
        const channel = context.channel;

        const burstSize = 5; // max safe burst per 5 seconds
        const burstDelay = 5200; // 5.2s between bursts to stay safe

        while (remaining > 0) {
          const sendNow = Math.min(remaining, burstSize);
          for (let i = 0; i < sendNow; i++) {
            try {
              await channel.send(message);
              // tiny random delay between messages in a burst (50–150ms)
              await new Promise(res => setTimeout(res, 50 + Math.random() * 100));
            } catch (err) {
              console.error("Error sending message:", err);
              return;
            }
          }
          remaining -= sendNow;
          if (remaining > 0) await new Promise(res => setTimeout(res, burstDelay));
        }
      }
    });
  }

  onUnload() {
    // Cleanup if needed
  }
}
