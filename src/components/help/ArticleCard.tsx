
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Article {
  id: number;
  title: string;
  description: string;
  category: string;
  readTime: string;
  featured?: boolean;
}

interface ArticleCardProps {
  article: Article;
  isFeatured?: boolean;
}

const ArticleCard = ({ article, isFeatured = false }: ArticleCardProps) => {
  if (isFeatured) {
    return (
      <Card className="hover:shadow-lg transition-shadow cursor-pointer border-blue-200 bg-blue-50">
        <CardHeader className="pb-2 md:pb-4">
          <div className="flex items-center justify-between mb-2">
            <Badge className="bg-blue-100 text-blue-800 text-xs">Featured</Badge>
            <span className="text-xs md:text-sm text-gray-500">{article.readTime}</span>
          </div>
          <CardTitle className="text-blue-900 text-base md:text-lg leading-tight">{article.title}</CardTitle>
          <CardDescription className="text-blue-700 text-sm md:text-base">{article.description}</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <span className="text-xs md:text-sm text-blue-600 capitalize">{article.category.replace('-', ' ')}</span>
            <ChevronRight className="h-4 w-4 text-blue-600" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-4 md:p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1 pr-4">
            <div className="flex items-start gap-2 md:gap-3 mb-2">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 leading-tight">{article.title}</h3>
              {article.featured && (
                <Badge className="bg-blue-100 text-blue-800 text-xs flex-shrink-0">Featured</Badge>
              )}
            </div>
            <p className="text-sm md:text-base text-gray-600 mb-2 line-clamp-2">{article.description}</p>
            <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-500">
              <span className="capitalize">{article.category.replace('-', ' ')}</span>
              <span>•</span>
              <span>{article.readTime}</span>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 md:h-5 md:w-5 text-gray-400 flex-shrink-0" />
        </div>
      </CardContent>
    </Card>
  );
};

export default ArticleCard;
