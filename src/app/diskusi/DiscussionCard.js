import React from 'react';

const DiscussionCard = ({ discussion }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-start space-x-4">
      <div className="flex-1">
        <div className="flex items-center mb-2">
          <div className="w-8 h-8 rounded-full bg-blue-500 mr-2"></div>
          <h2 className="text-xl font-bold text-[#1F384C]">User</h2>
          <span className="mx-2">•</span>
          <p className="text-[#1F384C] text-sm">{discussion.formattedCreatedAt}</p>
        </div>
        <div className="w-full text-left">
          <h2 className="text-l font-bold text-[#1F384C]">{discussion.title}</h2>
          <p className="text-[#1F384C]">{discussion.description}</p>
        </div>
        <div className="flex flex-wrap mt-2">
          {discussion.tags.map(tag => (
            <span key={tag} className="bg-blue-100 text-[#1F384C] rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiscussionCard;
