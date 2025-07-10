const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatHistory = document.getElementById('chat-history');
const loading = document.getElementById('loading');

// Local session for UI rendering only
let session = [];

// Render chat messages
function renderMessages() {
  chatHistory.innerHTML = '';
  session.forEach(({ role, content }) => {
    const div = document.createElement('div');
    div.className = `chat-message ${role}`;
    div.textContent = content;
    chatHistory.appendChild(div);
  });
  chatHistory.scrollTop = chatHistory.scrollHeight;
}

// Send message to API
async function sendMessage(prompt) {
  session.push({ role: 'user', content: prompt });
  renderMessages();
  loading.classList.remove('hidden');

  try {
    const response = await 
fetch('https://mychatapp.azurefd.net/api/ask-agent', {
  method: 'POST',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify({ prompt })
});


    const data = await response.json();
    session.push({ role: 'bot', content: data.response || 'No response received.' });
    renderMessages();
  } catch (error) {
    session.push({ role: 'bot', content: '⚠️ Error contacting the API.' });
    renderMessages();
  } finally {
    loading.classList.add('hidden');
  }
}

// Handle form submission
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const prompt = input.value.trim();
  if (prompt) {
    sendMessage(prompt);
    input.value = '';
  }
});

// Restart button
const restartButton = document.createElement('button');
restartButton.textContent = 'Restart Chat';
restartButton.style.marginTop = '10px';
restartButton.onclick = () => {
  session = [];
  renderMessages();
};
document.querySelector('.chat-container').appendChild(restartButton);

// Clear UI session on reload
window.addEventListener('load', () => {
  session = [];
  renderMessages();
});

renderMessages();
