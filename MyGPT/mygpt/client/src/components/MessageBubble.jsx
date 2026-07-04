import { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { Bot, Check, Copy, User } from "lucide-react";

const MessageBubble = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const isAssistant = message.role === "assistant";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <article className={`flex gap-3 ${isAssistant ? "justify-start" : "justify-end"}`}>
      {isAssistant ? (
        <div className="mt-1 grid size-9 shrink-0 place-items-center rounded-lg bg-emerald-400 text-zinc-950">
          <Bot size={18} aria-hidden="true" />
        </div>
      ) : null}

      <div
        className={`max-w-[88%] rounded-lg border px-4 py-3 shadow-sm sm:max-w-[78%] ${
          isAssistant
            ? "border-zinc-800 bg-zinc-900 text-zinc-100"
            : "border-emerald-500/40 bg-emerald-500/15 text-emerald-50"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            {isAssistant ? (
              <div className="markdown-body text-sm sm:text-[15px]">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                  components={{
                    a: ({ node, ...props }) => (
                      <a {...props} target="_blank" rel="noreferrer" />
                    )
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="whitespace-pre-wrap text-sm leading-7 sm:text-[15px]">{message.content}</p>
            )}
          </div>

          {isAssistant ? (
            <button
              className="grid size-8 shrink-0 place-items-center rounded-md text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
              type="button"
              onClick={handleCopy}
              title="Copy response"
              aria-label="Copy response"
            >
              {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
            </button>
          ) : null}
        </div>
      </div>

      {!isAssistant ? (
        <div className="mt-1 grid size-9 shrink-0 place-items-center rounded-lg bg-zinc-800 text-zinc-200">
          <User size={18} aria-hidden="true" />
        </div>
      ) : null}
    </article>
  );
};

export default MessageBubble;
