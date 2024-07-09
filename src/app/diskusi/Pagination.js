import React from 'react';

const Pagination = () => {
  return (
    <div className="flex justify-center mt-6">
      <nav className="inline-flex">
        <button className="px-3 py-2 border rounded-l-lg">Prev</button>
        <button className="px-3 py-2 border">1</button>
        <button className="px-3 py-2 border">2</button>
        <button className="px-3 py-2 border">3</button>
        <button className="px-3 py-2 border">...</button>
        <button className="px-3 py-2 border">10</button>
        <button className="px-3 py-2 border rounded-r-lg">Next</button>
      </nav>
    </div>
  );
}

export default Pagination;
