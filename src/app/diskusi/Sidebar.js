import React, { useEffect, useState } from 'react';

const Sidebar = ({ onSelectTag }) => {
  const [popularKeywords, setPopularKeywords] = useState([]);

  useEffect(() => {
    const fetchPopularKeywords = async () => {
      try {
        const response = await fetch('http://34.45.189.129:3000/tags/popular');
        if (!response.ok) {
          throw new Error('Failed to fetch popular keywords');
        }
        const data = await response.json();
        console.log('Popular keywords fetched:', data.tags); // Log fetched data
        setPopularKeywords(data.tags);
      } catch (error) {
        console.error('Error fetching popular keywords:', error);
      }
    };

    fetchPopularKeywords();
  }, []);

  return (
    <aside className="w-1/4 pr-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4 text-[#1F384C]">Kata kunci populer</h2>
        <div className="flex flex-wrap">
          {popularKeywords.map(tag => (
            <button
              key={tag.name}
              onClick={() => onSelectTag(tag.name)} // Pass tag name to onSelectTag
              className="bg-gray-200 text-[#1F384C] rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2 cursor-pointer"
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
