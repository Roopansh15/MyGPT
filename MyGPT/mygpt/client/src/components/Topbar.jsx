import { Bot, LogOut, Menu, Plus } from "lucide-react";

const Topbar = ({ onLogout, onMenuClick, onNewChat, title, user }) => {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-800 bg-zinc-950/95 px-4 lg:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          className="grid size-10 place-items-center rounded-md border border-zinc-800 text-zinc-300 transition hover:border-zinc-600 hover:text-white lg:hidden"
          type="button"
          onClick={onMenuClick}
          title="Open sidebar"
          aria-label="Open sidebar"
        >
          <Menu size={20} aria-hidden="true" />
        </button>

        <div className="hidden size-10 place-items-center rounded-lg bg-emerald-400 text-zinc-950 sm:grid">
          <Bot size={22} aria-hidden="true" />
        </div>

        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold tracking-normal text-zinc-100 sm:text-lg">
            {title}
          </h1>
          <p className="truncate text-xs text-zinc-500">{user?.name || "MyGPT user"}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="hidden size-10 place-items-center rounded-md border border-zinc-800 text-zinc-300 transition hover:border-emerald-400 hover:text-emerald-200 sm:grid"
          type="button"
          onClick={onNewChat}
          title="New chat"
          aria-label="New chat"
        >
          <Plus size={18} aria-hidden="true" />
        </button>

        <button
          className="grid size-10 place-items-center rounded-md border border-zinc-800 text-zinc-300 transition hover:border-red-400 hover:text-red-200"
          type="button"
          onClick={onLogout}
          title="Log out"
          aria-label="Log out"
        >
          <LogOut size={18} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
};

export default Topbar;

