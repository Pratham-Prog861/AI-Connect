const LoadingAnimation = () => {
  return (
    <div className="flex items-center justify-center space-x-2 my-4">
      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
    </div>
  );
};

export default LoadingAnimation;