import React, { useState, useRef, useEffect } from 'react';
import api from '../services/api';
import './Chatbot.css';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hi! I'm your Inventory Assistant 🤖. Ask me about your total products, inventory value, or low stock items!", isBot: true }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input.trim();
        setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
        setInput('');
        setIsTyping(true);

        const lowerInput = userMsg.toLowerCase();
        let botReply = '';

        try {
            if (lowerInput.includes('total') || lowerInput.includes('value') || lowerInput.includes('how many') || lowerInput.includes('product') || lowerInput.includes('stat')) {
                const res = await api.get('/dashboard/stats');
                const stats = res.data;
                botReply = `You currently have **${stats.totalProducts}** products. The total value of your inventory is **Rs${stats.totalStockValue.toFixed(2)}**. There are **${stats.lowStockCount}** items running low.`;
            } else if (lowerInput.includes('low') || lowerInput.includes('stock')) {
                const res = await api.get('/dashboard/stats');
                const stats = res.data;
                if (stats.lowStockCount > 0) {
                    botReply = `You have **${stats.lowStockCount}** products critically low on stock! Please check the dashboard to reorder.`;
                } else {
                    botReply = `Great news! You have no low stock items. Everything is optimal!`;
                }
            } else {
                botReply = "I can help you with inventory insights! Try asking me:\n- 'What is my total inventory value?'\n- 'How many products do we have?'\n- 'Do I have any low stock items?'";
            }
        } catch (err) {
            botReply = "Oops! I had trouble connecting to the inventory database. Please try again later.";
        }

        setTimeout(() => {
            setMessages(prev => [...prev, { text: botReply, isBot: true }]);
            setIsTyping(false);
        }, 800);
    };

    return (
        <div className="chatbot-container">
            <button className="chat-fab" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? '✕' : '💬'}
            </button>

            {isOpen && (
                <div className="chat-window glass-card">
                    <div className="chat-header">
                        <h3>Inventory Assistant</h3>
                    </div>
                    <div className="chat-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.isBot ? 'bot-message' : 'user-message'}`}>
                                {msg.text}
                            </div>
                        ))}
                        {isTyping && (
                            <div className="message bot-message typing-indicator">
                                <span></span><span></span><span></span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <form className="chat-input-area" onSubmit={handleSend}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask me anything..."
                            className="glass-input"
                        />
                        <button type="submit" className="btn-primary send-btn">Send</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
