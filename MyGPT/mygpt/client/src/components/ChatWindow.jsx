import { useEffect, useRef } from "react";
import { Sparkles } from "lucide-react";
import MessageBubble from "./MessageBubble.jsx";
import Loader from "./Loader.jsx";

const starterPrompts = [
  "Explain JWT authentication in simple terms.",
  "Review this React component for improvements.",
  "Create a 7-day DSA study plan."
];

const ChatWindow = ({ messages, isSending, onPromptClick }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  return (
    <section className="min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto flex min-h-full w-full max-w-4xl flex-col px-4 py-6 lg:px-6">
        {messages.length === 0 ? (
          <div className="grid flex-1 place-items-center">
            <div className="w-full max-w-2xl text-center">
              <div className="mx-auto mb-5 grid size-14 place-items-center rounded-lg bg-emerald-400 text-zinc-950">
                <Sparkles size={28} aria-hidden="true" />
              </div>
              <h2 className="text-2xl font-semibold tracking-normal text-zinc-100 sm:text-3xl">
                Ask anything
              </h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {starterPrompts.map((prompt) => (
                  <button
                    className="min-h-24 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-left text-sm text-zinc-300 transition hover:border-emerald-400 hover:text-emerald-100"
                    key={prompt}
                    type="button"
                    onClick={() => onPromptClick(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((message) => (
              <MessageBubble key={message._id || `${message.role}-${message.createdAt}`} message={message} />
            ))}
          </div>
        )}

        {isSending ? (
          <div className="mt-6 flex justify-start">
            <div className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-zinc-300">
              <Loader label="Thinking" size="sm" />
            </div>
          </div>
        ) : null}

        <div ref={bottomRef} />
      </div>
    </section>
  );
};

export default ChatWindow;

