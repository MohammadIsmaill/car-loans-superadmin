interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSearch?: () => void;
}

export default function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  onSearch,
}: SearchInputProps) {
  return (
    <div className="flex-1 relative">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-3 sm:p-4 pr-20 sm:pr-32 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black placeholder:text-gray-400 text-primary text-sm sm:text-base"
      />
      <button
        onClick={onSearch}
        className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 px-3 sm:px-5 py-2 sm:py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 flex items-center gap-1 sm:gap-2 cursor-pointer text-sm sm:text-base"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="hidden sm:inline">Search</span>
      </button>
    </div>
  );
}
