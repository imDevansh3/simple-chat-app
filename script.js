const socket = io();
let username;

const sendMessage = () => {
    const messageInput = document.getElementById("messageInput");
    let message = messageInput.value;

    const replacements = {
        react: "⚛",
        woah: "😮",
        hey: "👋",
        lol: "😂",
        like: "❤️",
        congratulations: "🎉",
    };

    // hey world => ["hey","world"]
    // Split message into words and replace
    let words = message.split(" ");
    for (let i = 0; i < words.length; i++) {
        if (replacements[words[i]]) {
            words[i] = replacements[words[i]];
        }
    }

    message = words.join(" ");

    if (message.trim() !== "") {
        socket.emit("chat message", message);
        messageInput.value = "";
    }
};

do {
    username = prompt("Please enter your username:");
} while (!username);

socket.emit("user joined", username);

socket.on("update userlist", (users) => {
    const contactsList = document.querySelector(".contact-list");
    contactsList.innerHTML = ""; // Clear the list first

    users.forEach((user) => {
        const contactItem = document.createElement("li");
        contactItem.className = "contact";

        const contactNameSpan = document.createElement("span");
        contactNameSpan.className = "contact-name";
        contactNameSpan.textContent = user;

        contactItem.appendChild(contactNameSpan);
        contactsList.appendChild(contactItem);
    });
});

document.getElementById("sendButton").addEventListener("click", sendMessage);
document.getElementById("messageInput").addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        sendMessage();
    }
});

const appendChatMessage = (messageNode) => {
    const messagesDiv = document.querySelector(".messages");
    messagesDiv.appendChild(messageNode);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
};

socket.on("chat message", (msg) => {
    const newMessageDiv = document.createElement("div");
    newMessageDiv.className = "message received";
    newMessageDiv.textContent = msg;
    appendChatMessage(newMessageDiv);
});
