import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, set, onChildAdded, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const firebaseConfig = {
    ///config for friebase
};

const inputField = document.getElementById("message-input");
const formId = document.getElementById("send-container");

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let isScrolling = false;

const messagesRef = ref(db, 'general');

// other useful functions

function extractImageUrl(inputString) {
    const imagePattern = /(https?:\/\/[^\s]+?\.(jpeg|jpg|gif|png|bmp|webp|svg|tiff|tif))/gi;
    const matches = inputString.match(imagePattern);

    return matches ? matches : []; // Return matched URLs or an empty array if none found
}

function clearAllMessages() {
    // Replace 'messages' with the actual path to your messages node
    remove(messagesRef)
        .then(() => {
            console.log('All messages deleted successfully.');
        })
        .catch((error) => {
            console.error('Error deleting messages:', error);
    });
};

function scrollToBottom() {
    if (!isScrolling) {
        isScrolling = true;
        setTimeout(() => {
            const chatContainer = document.getElementById('message-container');
            chatContainer.scrollTop = chatContainer.scrollHeight;
            isScrolling = false;
        }, 100);
    }
}

if (JSON.parse(localStorage.getItem('userdata')) === null) {
    location.replace("/")
} else {

    const dataRetv = JSON.parse(localStorage.getItem('userdata'));
    const username = dataRetv.name;
    
    // pfp random
    let pfpImagePAth = dataRetv.pfp;
    
    // event listener
    formId.addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent the form from submitting
        sendMessageToDB();
    });
    
    inputField.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            if (event.shiftKey) {
                // If Shift + Enter is pressed, add a new line
                inputField.value += '\n';
                // Prevent the form from submitting
                event.preventDefault();
            } else {
                // If just Enter is pressed, send the message
                sendMessageToDB();
                event.preventDefault(); // Prevent new line from being added
            }
        }
    });
    
    function sendMessageToDB() {
        let message = inputField.value.trim();
        if (message !== "") {
            const newMessageRef = push(messagesRef);
            set(newMessageRef, {
                message: [username, message, pfpImagePAth],
                timestamp: new Date().toISOString()
            });
            inputField.value = ''; // Clear the input field
            setTimeout(scrollToBottom, 100);
        }
    }
    
    // Listen for new messages and display them
    onChildAdded(messagesRef, (snapshot) => {
        const messageData = snapshot.val();
        const messageElement = document.createElement('div');
        const images = extractImageUrl(messageData.message[1]);
    
        if (messageData.message[1] === "cls") {
            clearAllMessages();
        } else {
            let imagesHTML = '';
    
            if (images.length > 0) {
                images.forEach(element => {
                    imagesHTML += `<img id="image-sent" src="${element}" alt="" width="200">\n`;
                });
    
                const regexPattern = images.join("|");
                const cleanText = messageData.message[1].replace(new RegExp(regexPattern, 'g'), '').replace(/\s+/g, ' ').trim();
    
                messageElement.innerHTML = `
                <div class="comment">
                    <img id="pfp-image" src="${messageData.message[2]}" alt="pfp-image">
                    <div class="comment-text-container">
                        <h2 id="name-text">${messageData.message[0]}</h2>
                        <h2 id="comment-text">${cleanText}</h2>
                        <div class="container">
                            ${imagesHTML}
                        </div>
                    </div>
                </div>
                `;
            } else {
                messageElement.innerHTML = `
                <div class="comment">
                    <img id="pfp-image" src="${messageData.message[2]}" alt="pfp-image">
                    <div class="comment-text-container">
                        <h2 id="name-text">${messageData.message[0]}</h2>
                        <h2 id="comment-text">${messageData.message[1]}</h2>
                    </div>
                </div>`;
            }
    
            // Append the message element to the container
            document.getElementById('message-container').appendChild(messageElement);

            setTimeout(() => {
                scrollToBottom();
            }, 0);
        }
    });

}
