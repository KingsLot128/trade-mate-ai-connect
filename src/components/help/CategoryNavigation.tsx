
import React from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface Category {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface CategoryNavigationProps {
  categories: Category[];
  selectedCategory: string;
  showMobileCategories: boolean;
  onCategorySelect: (categoryId: string) => void;
  onToggleMobileCategories: () => void;
}

const CategoryNavigation = ({ 
  categories, 
  selectedCategory, 
  showMobileCategories, 
  onCategorySelect, 
  onToggleMobileCategories 
}: CategoryNavigationProps) => {
  return (
    <div className="mb-6 md:mb-8">
      {/* Mobile Category Toggle */}
      <div className="md:hidden mb-4">
        <Button
          variant="outline"
          onClick={onToggleMobileCategories}
          className="w-full flex items-center justify-between"
        >
          <span>Categories: {categories.find(c => c.id === selectedCategory)?.name}</span>
          {showMobileCategories ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Category Buttons */}
      <div className={`${showMobileCategories ? 'flex' : 'hidden'} md:flex flex-wrap gap-2 justify-center`}>
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => {
                onCategorySelect(category.id);
                onToggleMobileCategories();
              }}
              className="flex items-center gap-2 text-xs md:text-sm px-2 md:px-4 py-1 md:py-2"
            >
              <Icon className="h-3 w-3 md:h-4 md:w-4" />
              <span className="hidden sm:inline">{category.name}</span>
              <span className="sm:hidden">{category.name.split(' ')[0]}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryNavigation;
