import { useState } from 'react';

const DropdownOpen = ({ folder, submitStored, openDropdown, setOpenDropdown }) => {
  const isOpen = openDropdown === folder; // Check if this folder's dropdown is open

  return (
    <div className="relative">
    {/* Button to toggle dropdown */}
    <button
      className="text-zinc-200 bg-transparent border-none w-fit text-center hover:bg-zinc-700 hover:text-zinc-700 py-2"
      onClick={() => setOpenDropdown(isOpen ? null : folder)} // Toggle dropdown for this folder
      style={{
        backgroundColor: 'transparent',
        border: 'none',
      }}
      type="button"
    >
      <i className="ri-quill-pen-line text-slate-300 text-xl hover:text-3xl"></i>
    </button>

    {/* Dropdown Menu */}
    {isOpen && (
      <div className="absolute right-0 bg-white shadow-md border rounded mt-2 z-10">
        <ul className="py-1">
          <li
            className="px-4 py-2 hover:bg-zinc-200 cursor-pointer"
            onClick={() => {
              submitStored(folder); // Restore functionality
              setOpenDropdown(null); // Close dropdown
            }}
          >
            Restore
          </li>
          <li
            className="px-4 py-2 hover:bg-zinc-200 cursor-pointer"
            onClick={() => {
              alert(`Renamed: ${folder}`); // Rename alert
              setOpenDropdown(null); // Close dropdown
            }}
          >
            Rename
          </li>
        </ul>
      </div>
    )}
  </div>
  );
};

export default DropdownOpen;