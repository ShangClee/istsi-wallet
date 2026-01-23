import React from "react"

const InlineLoader = () => {
  return (
    <div className="inline-block w-[250px] my-2 animate-fade-in">
      <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-blue-600 animate-progress"></div>
      </div>
    </div>
  )
}

export default InlineLoader
