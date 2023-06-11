export var socket = new WebSocket("ws://localhost:8000/ws/notifications/");

socket.onopen = () => {
  console.log("Socket is open");
};

socket.onerror = (event) => {
  console.log(event);
};

socket.onclose = () => {
  console.log("Socket is closed");
};
