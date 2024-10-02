import React from "react";

export default function Loader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex space-x-2">
        <div className="w-4 h-4 bg-black dark:bg-white rounded-full animate-bounce"></div>
        <div className="w-4 h-4 bg-black dark:bg-white rounded-full animate-bounce delay-200"></div>
        <div className="w-4 h-4 bg-black dark:bg-white rounded-full animate-bounce delay-400"></div>
      </div>
    </div>
  );
}
