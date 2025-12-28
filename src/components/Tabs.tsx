interface Tab {
  label: string;
  value: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (value: string) => void;
}

export default function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
  return (
    <div className="flex flex-wrap gap-2 sm:gap-4 md:gap-6 mb-4 sm:mb-6 border-gray-200 overflow-x-auto pb-1">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onTabChange(tab.value)}
          className={`px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base font-semibold cursor-pointer whitespace-nowrap ${
            activeTab === tab.value
              ? 'text-primary border border-gray-200 rounded-lg'
              : 'text-gray-400'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
