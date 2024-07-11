"use client"; // Menambahkan directive untuk menunjukkan bahwa ini adalah komponen client-side

import { useState } from 'react'; // Import useState for managing state

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white border-b border-[#EEEEEE]">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-[#5A67BA]">Cendekiawan Aswaja</span>
        </a>
        <button
          onClick={toggleMenu}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          aria-label="Open main menu"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>
        <div
          className={`w-full md:flex md:items-center md:w-auto ${isMenuOpen ? 'block' : 'hidden'}`}
          id="navbar-dropdown"
        >
          <ul className="flex flex-col md:flex-row font-medium p-4 md:p-0 mt-4 md:mt-0 border-t md:border-0 border-gray-100 rounded-lg bg-gray-50 md:bg-white md:space-x-8 rtl:space-x-reverse">
            <li>
              <a href="#" className="block py-2 px-1 text-sm text-[#1F384C] rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-[#5A67BA]">
                Crowdfunding
              </a>
            </li>
            <li>
              <a href="#" className="block py-2 px-1 text-sm text-[#1F384C] rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-[#5A67BA]">
                Kolaborasi
              </a>
            </li>
            <li>
              <a href="/diskusi" className="block py-2 px-1 text-sm text-[#1F384C] rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-[#5A67BA]">
                Forum
              </a>
            </li>
            <li>
              <a href="#" className="block py-2 px-1 text-sm text-[#1F384C] rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-[#5A67BA]">
                Daftar Penelitian
              </a>
            </li>
            <li>
              <a href="#" className="block py-2 px-1 text-sm text-[#1F384C] rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-[#5A67BA]">
                Daftar Publikasi
              </a>
            </li>
            <li>
              <a href="#" className="block py-2 px-1 mr-6 text-sm text-[#1F384C] rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-[#5A67BA]">
                 Konferensi
              </a>
            </li>
            <li className="relative inline-block md:hidden">
              <button
                id="dropdownNavbarLink"
                onClick={toggleDropdown}
                className="flex items-center justify-between w-full py-2 px-1 text-sm text-[#1F384C] rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-[#5A67BA] md:w-auto"
                aria-haspopup="true"
                aria-expanded={isOpen ? 'true' : 'false'}
              >
                Nama Akun
                <svg
                  className={`w-2.5 h-2.5 ml-2.5 ${isOpen ? 'transform rotate-180' : ''}`}
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              <div
                id="dropdownNavbar"
                className={`z-10 ${isOpen ? 'block' : 'hidden'} absolute mt-2 right-0 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 md:hidden`}
              >
                <ul className="py-2 text-sm text-gray-700" aria-labelledby="dropdownNavbarLink">
                  <li>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                      Profil
                    </a>
                  </li>
                  <li>
                    <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                      Logout
                    </a>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
          <div className="hidden md:block">
            <button
              id="dropdownNavbarLink"
              onClick={toggleDropdown}
              className="flex items-center justify-between py-2 px-1 text-sm text-[#1F384C] rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-[#5A67BA] md:w-auto"
              aria-haspopup="true"
              aria-expanded={isOpen ? 'true' : 'false'}
            >
              Nama Akun
              <svg
                className={`w-2.5 h-2.5 ml-2.5 ${isOpen ? 'transform rotate-180' : ''}`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </button>
            <div
              id="dropdownNavbar"
              className={`z-10 ${isOpen ? 'block' : 'hidden'} absolute mt-2 right-0 bg-white divide-y divide-gray-100 rounded-lg shadow w-44`}
            >
              <ul className="py-2 text-sm text-gray-700" aria-labelledby="dropdownNavbarLink">
                <li>
                  <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                    Profil
                  </a>
                </li>
                <li>
                  <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
