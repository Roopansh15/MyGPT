import { useEffect, useMemo, useState } from "react";
import api, { getApiError } from "../api/axios.js";
import ChatInput from "../components/ChatInput.jsx";
import ChatWindow from "../components/ChatWindow.jsx";
import Sidebar from "../components/Sidebar.jsx";
import Topbar from "../components/Topbar.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const Dashboard = () => {
  const { logout, user } = useAuth();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  const messages = activeChat?.messages || [];

  const activeTitle = useMemo(() => {
    return activeChat?.title && activeChat.title !== "New chat" ? activeChat.title : "MyGPT";
  }, [activeChat]);

  useEffect(() => {
    const loadChats = async () => {
      setError("");
      setIsLoadingChats(true);

      try {
        const { data } = await api.get("/chats");
        setChats(data.chats);

        if (data.chats.length > 0) {
          const firstChat = await api.get(`/chats/${data.chats[0]._id}`);
          setActiveChat(firstChat.data.chat);
        }
      } catch (apiError) {
        setError(getApiError(apiError));
      } finally {
        setIsLoadingChats(false);
      }
    };

    loadChats();
  }, []);

  const refreshChatList = async () => {
    const { data } = await api.get("/chats");
    setChats(data.chats);
  };

  const handleNewChat = async () => {
    setError("");

    try {
      const { data } = await api.post("/chats");
      setActiveChat(data.chat);
      setChats((current) => [data.chat, ...current]);
      setIsSidebarOpen(false);
      return data.chat;
    } catch (apiError) {
      setError(getApiError(apiError));
      return null;
    }
  };

  const handleSelectChat = async (chatId) => {
    setError("");

    try {
      const { data } = await api.get(`/chats/${chatId}`);
      setActiveChat(data.chat);
      setIsSidebarOpen(false);
    } catch (apiError) {
      setError(getApiError(apiError));
    }
  };

  const handleDeleteChat = async (chatId) => {
    setError("");

    try {
      await api.delete(`/chats/${chatId}`);

      const remainingChats = chats.filter((chat) => chat._id !== chatId);
      setChats(remainingChats);

      if (activeChat?._id === chatId) {
        if (remainingChats.length > 0) {
          const { data } = await api.get(`/chats/${remainingChats[0]._id}`);
          setActiveChat(data.chat);
        } else {
          setActiveChat(null);
        }
      }
    } catch (apiError) {
      setError(getApiError(apiError));
    }
  };

  const handleSendMessage = async (text) => {
    setError("");
    setIsSending(true);

    let chatForMessage = activeChat;

    if (!chatForMessage) {
      chatForMessage = await handleNewChat();

      if (!chatForMessage) {
        setIsSending(false);
        return;
      }
    }

    const optimisticMessage = {
      _id: `temp-${Date.now()}`,
      role: "user",
      content: text,
      createdAt: new Date().toISOString()
    };

    setActiveChat((current) => ({
      ...chatForMessage,
      ...(current?._id === chatForMessage._id ? current : {}),
      messages: [...(current?.messages || chatForMessage.messages || []), optimisticMessage]
    }));

    try {
      const { data } = await api.post(`/chats/${chatForMessage._id}/messages`, {
        message: text
      });
      setActiveChat(data.chat);
      await refreshChatList();
    } catch (apiError) {
      setError(getApiError(apiError));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950 text-zinc-100">
      <Sidebar
        activeChatId={activeChat?._id}
        chats={chats}
        isLoading={isLoadingChats}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onDeleteChat={handleDeleteChat}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
      />

      <main className="flex min-w-0 flex-1 flex-col">
        <Topbar
          title={activeTitle}
          user={user}
          onLogout={logout}
          onMenuClick={() => setIsSidebarOpen(true)}
          onNewChat={handleNewChat}
        />

        {error ? (
          <div className="mx-4 mt-3 rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100 lg:mx-6">
            {error}
          </div>
        ) : null}

        <ChatWindow messages={messages} isSending={isSending} onPromptClick={handleSendMessage} />
        <ChatInput disabled={isSending} onSend={handleSendMessage} />
      </main>
    </div>
  );
};

export default Dashboard;

