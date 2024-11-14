import React from 'react';
import { Home, Rss, BookOpen, Tag, Settings } from 'lucide-react';

interface SubHeaderProps {
  activeView: 'dashboard' | 'feeds' | 'bookmarks' | 'tags' | 'settings';
}

const viewConfigs = {
  dashboard: {
    icon: <Home className="w-6 h-6" />,
    title: 'Latest Updates',
    subtitle: 'Stay informed with your personalized news feed'
  },
  feeds: {
    icon: <Rss className="w-6 h-6" />,
    title: 'Manage AI News Feeds',
    subtitle: 'Customize your AI news sources'
  },
  bookmarks: {
    icon: <BookOpen className="w-6 h-6" />,
    title: 'Read Later',
    subtitle: 'Your saved articles for future reading'
  },
  tags: {
    icon: <Tag className="w-6 h-6" />,
    title: 'Search Tags',
    subtitle: 'Manage your content filters'
  },
  settings: {
    icon: <Settings className="w-6 h-6" />,
    title: 'User Settings',
    subtitle: 'Customize your experience'
  }
};

export const SubHeader: React.FC<SubHeaderProps> = ({ activeView }) => {
  const content = viewConfigs[activeView];

  return (
    <div className="fixed top-16 left-20 right-0 z-10 bg-white border-b border-purple-100 shadow-sm">
      <div className="px-8 py-6">
        <div className="flex items-center">
          <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl text-purple-700 shadow-sm">
            {content.icon}
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-semibold text-purple-900 mb-1">{content.title}</h2>
            <p className="text-sm text-purple-600/80">{content.subtitle}</p>
          </div>
        </div>
      </div>
    </div>
  );
};