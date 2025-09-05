import React, { useState, useRef }  from 'react'
import axios from 'axios';

const AIChat = () => {
  const [messages, setMessages] = useState([]); 
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim()) return;

  const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      const response = await axios.post('https://20.244.28.96/doctor_chat', {
        query: input, // API expects 'query'
      });

      // Assuming the API returns the text in response.data.reply or adjust accordingly
      const aiMessage = { sender: 'ai', text: response.data.answer };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage = { sender: 'ai', text: 'Error: Could not get response' };
      setMessages((prev) => [...prev, errorMessage]);
    }

    scrollToBottom();
    };

    const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
    };

    return (
    <div className="pt-10 mt-10 flex flex-col h-[600px] w-full mx-auto bg-neutral-100 rounded-lg shadow-xl">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-[70%] ${
                msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={chatEndRef}></div>
      </div>

      {/* Input */}
      <div className="p-4 flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1 bg-neutral-200 rounded-l px-4 py-2 outline-none"
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-blue-600 text-white rounded-r hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default AIChat