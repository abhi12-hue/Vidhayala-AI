import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AiChat = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Greetings, human! I am Grok 3, your cosmic AI companion. How may I illuminate your universe today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/v1/courses/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) throw new Error("Quantum connection failed");

      const reader = response.body.getReader();
      let aiResponse = "";
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      const readStream = async () => {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          aiResponse += new TextDecoder().decode(value);
          setMessages((prev) => [
            ...prev.slice(0, -1),
            { role: "assistant", content: aiResponse },
          ]);
        }
        setLoading(false);
      };

      readStream();
    } catch (error) {
      console.error("Cosmic disturbance:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error: Reality matrix malfunction!" },
      ]);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-r from-gray-900 via-[#09090B] to-black flex flex-col p-4 md:p-6">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex-1 flex flex-col bg-gray-900/80 backdrop-blur-xl mt-10 md:mt-20 rounded-2xl md:rounded-3xl shadow-2xl shadow-purple-500/20 border border-purple-500/30 overflow-hidden relative"
      >
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4 md:space-y-6 bg-gradient-to-b from-gray-900 to-black/50 scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-transparent">
          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] md:max-w-[75%] p-3 md:p-5 rounded-xl md:rounded-2xl shadow-lg transform transition-all hover:scale-105 ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white border border-purple-400/50"
                      : "bg-gray-800/90 text-purple-100 border border-purple-600/30"
                  }`}
                >
                  <span className="block font-mono text-sm leading-relaxed">
                    {msg.content}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-purple-900/50 p-3 md:p-5 rounded-xl md:rounded-2xl text-purple-300 animate-pulse font-mono">
                Transmitting through the void...
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-gray-900/80 p-4 md:p-6 flex items-center gap-2 md:gap-4 border-t border-purple-500/30">
          <motion.input
            type="text"
            className="flex-1 p-3 md:p-4 bg-gray-800/50 rounded-xl outline-none text-white placeholder-purple-400/50 border border-purple-600/20 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 font-mono text-sm md:text-base"
            placeholder="Enter your cosmic query..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            disabled={loading}
            whileFocus={{ scale: 1.02 }}
          />
          <motion.button
            onClick={sendMessage}
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold tracking-wide shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-sm md:text-base"
          >
            Transmit
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default AiChat;