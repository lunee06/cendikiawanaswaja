'use client';

import React, { useState } from 'react';
import DiscussionList from './DiscussionList'; // Adjust the path based on your file structure
import Sidebar from './Sidebar'; // Adjust the path based on your file structure
import Pagination from './Pagination'; // Adjust the path based on your file structure

const DiscussionForum = () => {
  const [selectedTag, setSelectedTag] = useState(null);

  const handleSelectTag = (tag) => {
    setSelectedTag(tag);
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      <div className="container mx-auto p-6">
        <header className="flex justify-between items-center mb-6">
          <div></div>
          <button className="bg-blue-500 text-[#1F384C] px-4 py-2 rounded-lg">Buat Diskusi Baru</button>
        </header>
        <div className="flex">
          <Sidebar onSelectTag={handleSelectTag} />
          <main className="flex-1">
            <div className="flex justify-between items-center mb-4">
              <input
                type="text"
                placeholder="Search"
                className="border rounded-lg px-4 py-2 w-full max-w-lg"
              />
              <div className="ml-4">
                <label className="mr-2">Urut berdasarkan</label>
                <select className="border rounded-lg px-4 py-2">
                  <option>Diskusi terbaru</option>
                  <option>Diskusi terlama</option>
                </select>
              </div>
            </div>
            <DiscussionList selectedTag={selectedTag} />
            <Pagination />
          </main>
        </div>
      </div>
    </div>
  );
}

export default DiscussionForum;
