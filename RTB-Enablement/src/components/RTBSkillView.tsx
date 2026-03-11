import React, { useState, useRef, useEffect } from "react";
import { RTBSkill, Message, QuickPrompt } from "../types/skill";

interface RTBSkillViewProps {
  skill: RTBSkill;
  onMessage?: (message: string) => void;
  isLoading?: boolean;
  messages?: Message[];
  onSendMessage?: (text: string) => Promise<void>;
}

export const RTBSkillView: React.FC<RTBSkillViewProps> = ({
  skill,
  onMessage,
  isLoading = false,
  messages = [],
  onSendMessage,
}) => {
  const [input, setInput] = useState("");
  const [localMessages, setLocalMessages] = useState<Message[]>(messages);
  const [loading, setLoading] = useState(isLoading);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages]);

  const handleSendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || loading) return;

    setInput("");
    const userMsg: Message = { role: "user", content: messageText };
    setLocalMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      if (onSendMessage) {
        await onSendMessage(messageText);
      }
      if (onMessage) {
        onMessage(messageText);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setLocalMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Connection error. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: skill.ui.theme === "dark" ? "#0a0a0f" : "#ffffff",
        fontFamily: skill.ui.typography.fontFamily,
        display: "flex",
        flexDirection: "column",
        color: skill.ui.colorScheme.text,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2a2a3a; border-radius: 2px; }

        .msg-user { animation: slideUp 0.25s ease; }
        .msg-ai { animation: slideUp 0.3s ease; }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .quick-btn:hover {
          background: rgba(255,200,100,0.12) !important;
          border-color: rgba(255,200,100,0.4) !important;
          transform: translateY(-1px);
        }
        .quick-btn { transition: all 0.18s ease; }

        .send-btn:hover:not(:disabled) { background: ${skill.ui.colorScheme.accent} !important; transform: scale(1.04); }
        .send-btn { transition: all 0.15s ease; }

        .input-box:focus { outline: none; }

        .badge-escalate {
          display: inline-block;
          background: rgba(255,80,80,0.15);
          border: 1px solid rgba(255,80,80,0.3);
          color: #ff8080;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 2px 7px;
          border-radius: 4px;
          margin-right: 6px;
        }

        .typing-dot {
          width: 5px; height: 5px;
          background: ${skill.ui.colorScheme.accent};
          border-radius: 50%;
          animation: bounce 1.2s infinite;
          display: inline-block;
          margin: 0 2px;
        }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-5px); opacity: 1; }
        }

        .prose p { margin-bottom: 10px; }
        .prose ul { padding-left: 18px; margin-bottom: 10px; }
        .prose li { margin-bottom: 5px; line-height: 1.6; }
        .prose strong { color: ${skill.ui.colorScheme.accent}; font-weight: 600; }
        .prose code { background: rgba(240,192,80,0.1); padding: 1px 5px; border-radius: 3px; font-size: 0.88em; }

        .grid-bg {
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(240,192,80,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(240,192,80,0.03) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
          z-index: 0;
        }

        .higharc-logo {
          filter: invert(1) brightness(2);
          height: 28px;
          width: auto;
          object-fit: contain;
        }
      `}</style>

      <div className="grid-bg" />

      {/* Header */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          borderBottom: `1px solid ${skill.ui.colorScheme.border}`,
          background: "rgba(10,10,15,0.95)",
          backdropFilter: "blur(12px)",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "60px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {skill.ui.header.logoBase64 && (
            <img
              src={`data:image/jpeg;base64,${skill.ui.header.logoBase64}`}
              alt="Logo"
              className="higharc-logo"
            />
          )}
          <div
            style={{
              width: "1px",
              height: "24px",
              background: "rgba(240,192,80,0.2)",
            }}
          />
          <div>
            <div
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: skill.ui.colorScheme.accentLight,
                letterSpacing: "-0.01em",
              }}
            >
              {skill.ui.header.title}
            </div>
            <div
              style={{
                fontSize: "10px",
                color: "#806040",
                fontWeight: 500,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginTop: "1px",
              }}
            >
              {skill.ui.header.subtitle}
            </div>
          </div>
        </div>

        <div
          style={{
            padding: "5px 14px",
            borderRadius: "6px",
            border: `1px solid ${skill.ui.colorScheme.accent}33`,
            background: `${skill.ui.colorScheme.accent}14`,
            fontSize: "11px",
            fontWeight: 600,
            letterSpacing: "0.08em",
            color: skill.ui.colorScheme.accent,
          }}
        >
          {skill.restrictions.roleTargetAudience}
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          zIndex: 1,
          maxWidth: skill.ui.layout.maxWidth,
          width: "100%",
          margin: "0 auto",
          padding: "0 16px",
        }}
      >
        {localMessages.length === 0 && (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              paddingTop: "40px",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "40px" }}>
              <div
                style={{
                  fontSize: skill.ui.typography.sizes.heading,
                  fontWeight: 700,
                  color: skill.ui.colorScheme.accentLight,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.15,
                  marginBottom: "14px",
                }}
              >
                {skill.name}
                <br />
                <span style={{ color: skill.ui.colorScheme.accent }}>
                  {skill.description.split(".")[0]}.
                </span>
              </div>
              <p
                style={{
                  fontSize: "14px",
                  color: "#60504a",
                  maxWidth: "420px",
                  margin: "0 auto",
                  lineHeight: 1.6,
                  fontWeight: 400,
                }}
              >
                {skill.description}
              </p>
            </div>

            {/* Quick Prompts Grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: "10px",
                marginBottom: "32px",
              }}
            >
              {skill.quickPrompts.map((prompt: QuickPrompt) => (
                <button
                  key={prompt.id}
                  className="quick-btn"
                  onClick={() => handleSendMessage(prompt.prompt)}
                  style={{
                    padding: "14px 16px",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "10px",
                    textAlign: "left",
                    cursor: "pointer",
                    color: skill.ui.colorScheme.textSecondary,
                    fontFamily: skill.ui.typography.fontFamily,
                  }}
                >
                  <div style={{ fontSize: "18px", marginBottom: "7px" }}>
                    {prompt.icon}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: skill.ui.colorScheme.accentLight,
                      marginBottom: "3px",
                    }}
                  >
                    {prompt.label}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#504840",
                      lineHeight: 1.5,
                    }}
                  >
                    {prompt.prompt.slice(0, 55)}…
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {localMessages.length > 0 && (
          <div style={{ flex: 1, overflowY: "auto", padding: "24px 0 12px" }}>
            {localMessages.map((msg, i) => (
              <div
                key={i}
                className={msg.role === "user" ? "msg-user" : "msg-ai"}
                style={{
                  display: "flex",
                  justifyContent:
                    msg.role === "user" ? "flex-end" : "flex-start",
                  marginBottom: "16px",
                }}
              >
                {msg.role === "assistant" && skill.ui.header.logoBase64 && (
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "7px",
                      flexShrink: 0,
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "10px",
                      marginTop: "2px",
                      overflow: "hidden",
                      padding: "5px",
                    }}
                  >
                    <img
                      src={`data:image/jpeg;base64,${skill.ui.header.logoBase64}`}
                      alt="Logo"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        filter: "invert(1) brightness(2)",
                      }}
                    />
                  </div>
                )}
                <div
                  style={{
                    maxWidth:
                      msg.role === "user"
                        ? skill.ui.layout.messageMaxWidth.user
                        : skill.ui.layout.messageMaxWidth.assistant,
                    padding:
                      msg.role === "user" ? "10px 14px" : "14px 16px",
                    borderRadius:
                      msg.role === "user"
                        ? "16px 16px 4px 16px"
                        : "4px 16px 16px 16px",
                    background:
                      msg.role === "user"
                        ? skill.ui.colorScheme.userMessage
                        : skill.ui.colorScheme.aiMessage,
                    border: "1px solid",
                    borderColor:
                      msg.role === "user"
                        ? "rgba(240,192,80,0.25)"
                        : "rgba(255,255,255,0.07)",
                    fontSize: skill.ui.typography.sizes.bodyText,
                    lineHeight: 1.65,
                    color:
                      msg.role === "user"
                        ? skill.ui.colorScheme.accentLight
                        : skill.ui.colorScheme.textSecondary,
                    fontFamily: skill.ui.typography.fontFamily,
                  }}
                >
                  {msg.role === "assistant" ? (
                    <div
                      className="prose"
                      dangerouslySetInnerHTML={{
                        __html: msg.content
                          .replace(/⚠️\s*/g, '<span class="badge-escalate">⚠ Escalate</span>')
                          .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                          .replace(/`(.*?)`/g, "<code>$1</code>")
                          .replace(/^- (.*)/gm, "<li>$1</li>")
                          .replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>")
                          .replace(/\n\n/g, "</p><p>")
                          .replace(/\n/g, "<br/>"),
                      }}
                    />
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div
                className="msg-ai"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "7px",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    padding: "5px",
                  }}
                >
                  {skill.ui.header.logoBase64 && (
                    <img
                      src={`data:image/jpeg;base64,${skill.ui.header.logoBase64}`}
                      alt="Logo"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        filter: "invert(1) brightness(2)",
                      }}
                    />
                  )}
                </div>
                <div
                  style={{
                    padding: "12px 16px",
                    background: skill.ui.colorScheme.aiMessage,
                    border: "1px solid rgba(255,255,255,0.07)",
                    borderRadius: "4px 16px 16px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "2px",
                  }}
                >
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Input Area */}
        <div
          style={{
            padding: "16px 0 24px",
            position: "sticky",
            bottom: 0,
            background: "linear-gradient(to top, #0a0a0f 70%, transparent)",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "flex-end",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "14px",
              padding: "10px 12px 10px 16px",
            }}
          >
            <textarea
              className="input-box"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder={skill.interactions.inputHandler.placeholder}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                resize: "none",
                fontSize: skill.ui.typography.sizes.bodyText,
                color: skill.ui.colorScheme.text,
                lineHeight: 1.6,
                fontFamily: skill.ui.typography.fontFamily,
                minHeight: "24px",
                maxHeight: "120px",
                overflowY: "auto",
              }}
            />
            <button
              className="send-btn"
              onClick={() => handleSendMessage()}
              disabled={loading || !input.trim()}
              style={{
                width: 34,
                height: 34,
                borderRadius: "9px",
                flexShrink: 0,
                background: input.trim()
                  ? skill.ui.colorScheme.accent
                  : "rgba(240,192,80,0.15)",
                border: "none",
                cursor: input.trim() ? "pointer" : "default",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "15px",
                color: input.trim() ? "#1a0f00" : "#604020",
              }}
            >
              ↑
            </button>
          </div>
          <div
            style={{
              textAlign: "center",
              marginTop: "8px",
              fontSize: skill.ui.typography.sizes.label,
              color: "#302820",
              letterSpacing: "0.06em",
              fontFamily: skill.ui.typography.fontFamily,
            }}
          >
            {skill.interactions.inputHandler.multilineSupport &&
              `PRESS ENTER TO SEND · ${skill.interactions.inputHandler.multilineKeybinding?.toUpperCase()} FOR NEW LINE`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RTBSkillView;
