import { useState } from "react";
import { SendHorizontal } from "lucide-react";

const ChatInput = ({ disabled, onSend }) => {
  const [message, setMessage] = useState("");

  const submitMessage = () => {
    const text = message.trim();

    if (!text || disabled) {
      return;
    }

    onSend(text);
    setMessage("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    submitMessage();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submitMessage();
    }
  };

  return (
    <form className="border-t border-zinc-800 bg-zinc-950 px-4 py-4 lg:px-6" onSubmit={handleSubmit}>
      <div className="mx-auto flex max-w-4xl items-end gap-3 rounded-lg border border-zinc-800 bg-zinc-900 p-2 shadow-soft focus-within:border-emerald-400">
        <textarea
          className="max-h-36 min-h-12 flex-1 resize-none bg-transparent px-3 py-3 text-sm leading-6 text-zinc-100 outline-none placeholder:text-zinc-500"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message MyGPT"
          disabled={disabled}
          rows={1}
        />
        <button
          className="grid size-12 shrink-0 place-items-center rounded-md bg-emerald-400 text-zinc-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
          type="submit"
          disabled={disabled || !message.trim()}
          title="Send message"
          aria-label="Send message"
        >
          <SendHorizontal size={20} aria-hidden="true" />
        </button>
      </div>
    </form>
  );
};

export default ChatInput;

