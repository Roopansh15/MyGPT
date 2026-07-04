import { MessageSquare, Plus, Trash2, X } from "lucide-react";
import Loader from "./Loader.jsx";

const Sidebar = ({
  activeChatId,
  chats,
  isLoading,
  isOpen,
  onClose,
  onDeleteChat,
  onNewChat,
  onSelectChat
}) => {
  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-black/60 transition lg:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-80 max-w-[86vw] flex-col border-r border-zinc-800 bg-zinc-950 transition-transform lg:static lg:z-auto lg:w-80 lg:max-w-none lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center gap-3 border-b border-zinc-800 px-4">
          <button
            className="flex h-10 flex-1 items-center justify-center gap-2 rounded-md border border-zinc-700 bg-zinc-900 text-sm font-medium text-zinc-100 transition hover:border-emerald-400 hover:text-emerald-200"
            type="button"
            onClick={onNewChat}
          >
            <Plus size={18} aria-hidden="true" />
            <span>New chat</span>
          </button>

          <button
            className="grid size-10 place-items-center rounded-md border border-zinc-800 text-zinc-300 transition hover:border-zinc-600 hover:text-white lg:hidden"
            type="button"
            onClick={onClose}
            title="Close sidebar"
            aria-label="Close sidebar"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader label="Loading chats" />
            </div>
          ) : null}

          {!isLoading && chats.length === 0 ? (
            <div className="rounded-lg border border-dashed border-zinc-700 px-4 py-6 text-center text-sm text-zinc-400">
              No chats yet
            </div>
          ) : null}

          <div className="space-y-2">
            {chats.map((chat) => {
              const isActive = chat._id === activeChatId;

              return (
                <div
                  className={`group flex min-h-14 items-center gap-2 rounded-lg border px-3 py-2 transition ${
                    isActive
                      ? "border-emerald-500/50 bg-emerald-500/10"
                      : "border-transparent hover:border-zinc-800 hover:bg-zinc-900"
                  }`}
                  key={chat._id}
                >
                  <button
                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                    type="button"
                    onClick={() => onSelectChat(chat._id)}
                  >
                    <MessageSquare
                      className={isActive ? "text-emerald-300" : "text-zinc-500"}
                      size={18}
                      aria-hidden="true"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-zinc-100">
                        {chat.title}
                      </span>
                      <span className="block truncate text-xs text-zinc-500">
                        {chat.preview || `${chat.messageCount || 0} messages`}
                      </span>
                    </span>
                  </button>

                  <button
                    className="grid size-8 shrink-0 place-items-center rounded-md text-zinc-500 opacity-100 transition hover:bg-red-500/10 hover:text-red-300 sm:opacity-0 sm:group-hover:opacity-100"
                    type="button"
                    onClick={() => onDeleteChat(chat._id)}
                    title="Delete chat"
                    aria-label={`Delete ${chat.title}`}
                  >
                    <Trash2 size={16} aria-hidden="true" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

