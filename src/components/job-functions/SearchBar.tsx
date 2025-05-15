
import React from 'react';
import { Button } from "@/components/ui/button";
import { FilterX } from "lucide-react";

interface SearchBarProps {
  searchText: string;
  setSearchText: (text: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchText, setSearchText }) => {
  return (
    <div className="flex gap-2">
      {searchText && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSearchText('')}
          className="h-9 w-9"
        >
          <FilterX className="h-4 w-4" />
        </Button>
      )}
      <div className="relative">
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search job functions..."
          className="w-[250px] h-9 px-3 py-2 text-sm rounded-md border border-input bg-background ring-offset-background"
        />
      </div>
    </div>
  );
};

export default SearchBar;
