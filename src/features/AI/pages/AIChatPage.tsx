import { WithNavbar } from "@/shared/components/hoc";
import AIImage from "@/assets/AIImage.jpeg";
import { useCurrentUser } from "@/shared/store";
import { IoSend } from "react-icons/io5";
import { useState, useEffect, useRef } from "react";

interface Message {
    id: string;
    text: string;
    sender: "user" | "ai";
    isTyping?: boolean;
}

export default function AIChatPage() {
    const currentUser = useCurrentUser();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isThinking, setIsThinking] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const generateTimeMessage = () => {
        const hours = new Date().getHours();
        if (hours < 12) return "Good morning";
        if (hours < 18) return "Good afternoon";
        return "Good evening";
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isThinking]);

    // Auto-resize textarea as content grows
    useEffect(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        textarea.style.height = "auto";
        textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
    }, [message]);

    const simulateAIResponse = (userMessage: string) => {
        console.log("User message:", userMessage);
        setIsThinking(true);
        const thinkingTime = 1500 + Math.random() * 1000;

        setTimeout(() => {
            setIsThinking(false);

            const responses = [
                "That's a great question! Here's what I think about that...",
                "I understand! Let me help you with this...",
                "Interesting! Here are some thoughts on that...",
                "I can definitely help you with that!",
                "Great point! Let me elaborate...",
            ];

            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            const aiMessage: Message = {
                id: Date.now().toString(),
                text: "",
                sender: "ai",
                isTyping: true,
            };

            setMessages((prev) => [...prev, aiMessage]);

            let charIndex = 0;
            const typingInterval = setInterval(() => {
                if (charIndex < randomResponse.length) {
                    setMessages((prev) =>
                        prev.map((m) =>
                            m.id === aiMessage.id
                                ? { ...m, text: randomResponse.slice(0, charIndex + 1) }
                                : m
                        )
                    );
                    charIndex++;
                } else {
                    clearInterval(typingInterval);
                    setMessages((prev) =>
                        prev.map((m) =>
                            m.id === aiMessage.id ? { ...m, isTyping: false } : m
                        )
                    );
                }
            }, 20);
        }, thinkingTime);
    };

    const handleSendMessage = () => {
        if (message.trim().length === 0 || isThinking) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: message,
            sender: "user",
        };

        setMessages((prev) => [...prev, userMessage]);
        setMessage("");

        // Reset textarea height after clearing
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }

        simulateAIResponse(message);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // Send on Enter (without Shift). Shift+Enter adds a newline.
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const isFirstMessage = messages.length === 0;

    return (
        <WithNavbar>
            <div className="flex flex-col h-[calc(100vh-70px)] bg-white overflow-hidden">

                {/* ── Chat messages (hidden until first message) ── */}
                <div
                    className={`flex-1 transition-all duration-700 ease-in-out overflow-y-auto ${
                        isFirstMessage ? "opacity-0 pointer-events-none" : "opacity-100"
                    }`}
                >
                    <div className="px-3 sm:px-6 py-6">
                        <div className="max-w-2xl mx-auto space-y-5">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${
                                        msg.sender === "user" ? "justify-end" : "justify-start"
                                    } animate-fadeIn`}
                                >
                                    <div
                                        className={`max-w-[85%] sm:max-w-lg px-3.5 py-2.5 rounded-2xl text-sm sm:text-[15px] leading-relaxed ${
                                            msg.sender === "user"
                                                ? "bg-primary text-white rounded-br-sm"
                                                : "bg-slate-100 text-contrast rounded-bl-sm"
                                        }`}
                                    >
                                        {/* whitespace-pre-wrap preserves newlines */}
                                        <p className="whitespace-pre-wrap break-words">
                                            {msg.text}
                                            {msg.isTyping && (
                                                <span className="inline-block w-0.5 h-3.5 ml-0.5 bg-current animate-pulse" />
                                            )}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            {/* Thinking indicator */}
                            {isThinking && (
                                <div className="flex justify-start animate-fadeIn">
                                    <div className="bg-slate-100 text-contrast rounded-2xl rounded-bl-sm px-3.5 py-2.5">
                                        <div className="flex items-center space-x-2">
                                            <div className="flex space-x-1">
                                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                            </div>
                                            <span className="text-xs sm:text-sm text-gray-500">owra is thinking...</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>
                    </div>
                </div>

                {/*
                 * ── Input area ──
                 *
                 * When isFirstMessage:  position:absolute, centred vertically in the page
                 * After first message:  position:static, sits at the bottom as a footer
                 *
                 * The transition animates both position and the welcome content opacity.
                 */}
                <div
                    className={`w-full bg-white transition-all duration-700 ease-in-out ${
                        isFirstMessage
                            ? "absolute inset-0 top-[70px] flex flex-col items-center justify-center px-4 pb-6"
                            : "relative flex flex-col items-center px-4 pb-4 pt-2"
                    }`}
                >
                    {/* Welcome content — fades out after first message */}
                    <div
                        className={`flex flex-col items-center mb-6 transition-all duration-500 ${
                            isFirstMessage ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 h-0 overflow-hidden mb-0"
                        }`}
                    >
                        <img
                            src={AIImage}
                            alt="AI Chat"
                            className="w-16 h-16 sm:w-24 sm:h-24 mb-4 object-cover rounded-full"
                        />
                        <p className="text-2xl sm:text-3xl font-semibold text-contrast text-center">
                            {generateTimeMessage()},{" "}
                            {currentUser?.englishFullName.split(" ")[0] || "there"}
                        </p>
                        <p className="text-sm sm:text-base text-gray-500 text-center mt-2">
                            How can I help you today?
                        </p>
                    </div>

                    {/* Input box */}
                    <div className={`w-full transition-all duration-700 ${isFirstMessage ? "max-w-xl" : "max-w-2xl"}`}>
                        <div className="relative flex items-end">
                            <textarea
                                ref={textareaRef}
                                rows={1}
                                className={`w-full resize-none rounded-2xl px-4 py-3 pr-12 border border-gray-200 hover:border-gray-300 focus:border-primary bg-white text-sm sm:text-[15px] focus:outline-none transition-all shadow-sm focus:shadow-md leading-relaxed overflow-hidden ${
                                    isThinking ? "opacity-60" : ""
                                }`}
                                style={{ maxHeight: "160px" }}
                                placeholder="Message owra..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={isThinking}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={message.trim().length === 0 || isThinking}
                                className={`absolute right-2.5 bottom-2.5 p-1.5 rounded-full transition-all ${
                                    message.trim().length > 0 && !isThinking
                                        ? "bg-primary text-white hover:bg-primary/90 cursor-pointer"
                                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                }`}
                            >
                                <IoSend className="text-base" />
                            </button>
                        </div>
                        <p className="text-[11px] sm:text-xs text-gray-400 text-center mt-2">
                            {isFirstMessage
                                ? "Press Enter to send · Shift+Enter for new line"
                                : "Owra can make mistakes, so please verify the information it provides!"}
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(8px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.35s ease-out;
                }
            `}</style>
        </WithNavbar>
    );
}