// Khởi tạo Firebase (dán config của em vào đây!)
const firebaseConfig = {
  // ← DÁN CONFIG TỪ BƯỚC 1 VÀO ĐÂY, thay thế toàn bộ object này
  apiKey: "AIzaSyB...",  // Ví dụ thôi, thay bằng của em
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123...",
  appId: "1:123...:web:abc..."
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const messagesDiv = document.getElementById("messages");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const typing = document.getElementById("typing");

// Tên phòng chat (em với crush chat chung phòng này)
let currentRoom = "nhom-chat-ban-";  // Có thể đổi thành tên riêng
const messagesRef = db.ref("chats/" + currentRoom);

function loadChat(room) {
  currentRoom = room;
  messagesDiv.innerHTML = "";  // Clear cũ
  // Load tin nhắn mới
  messagesRef.on("child_added", snap => {
    const msg = snap.val();
    const div = document.createElement("div");
    div.className = `message ${msg.sender === "me" ? "sent" : "received"}`;
    div.innerHTML = `
      ${msg.text}
      <small>${new Date(msg.time).toLocaleTimeString("vi-VN", {hour:"2-digit", minute:"2-digit"})}</small>
    `;
    messagesDiv.appendChild(div);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  });
}

// Gửi tin nhắn
function sendMessage() {
  const text = messageInput.value.trim();
  if (!text) return;

  messagesRef.push({
    text: text,
    sender: "me",
    time: Date.now()
  });

  messageInput.value = "";
}

sendBtn.addEventListener("click", sendMessage);
messageInput.addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});

// Typing indicator
let typingTimer;
messageInput.addEventListener("input", () => {
  typing.textContent = "Đang gõ...";
  clearTimeout(typingTimer);
  typingTimer = setTimeout(() => typing.textContent = "Đang hoạt động", 1500);
});

// Load phòng mặc định
loadChat(currentRoom);
