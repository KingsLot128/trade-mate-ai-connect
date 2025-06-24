
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";

interface HelpCenterSearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const HelpCenterSearchBar = ({ searchQuery, onSearchChange }: HelpCenterSearchBarProps) => {
  return (
    <div className="max-w-2xl mx-auto mb-6 md:mb-8 px-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 md:h-5 md:w-5" />
        <Input
          type="text"
          placeholder="Search help articles..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-4 py-2 md:py-3 text-base md:text-lg"
        />
      </div>
    </div>
  );
};

export default HelpCenterSearchBar;
