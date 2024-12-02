import consumer from "./consumer";

const TweetsChannel = consumer.subscriptions.create("TweetsChannel", {
  connected() {
    console.log("Connected to TweetsChannel");
    // Called when the subscription is ready for use on the server
  },

  disconnected() {
    console.log("Disconnected from TweetsChannel");
    // Called when the subscription has been terminated by the server
  },

  received(data) {
    console.log("New tweet received via WebSocket:", data);
    // Broadcast the received data to your React app
    const event = new CustomEvent("tweet-received", { detail: data });
    window.dispatchEvent(event);
  },
});

export default TweetsChannel;
