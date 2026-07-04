const formatChatTitle = (prompt) => {
  const compact = prompt.replace(/\s+/g, " ").trim();

  if (compact.length <= 48) {
    return compact;
  }

  return `${compact.slice(0, 45).trim()}...`;
};

export default formatChatTitle;

