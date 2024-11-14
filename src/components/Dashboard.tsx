import React from 'react';
import { useStore } from '../store/useStore';
import { Bookmark, BookmarkCheck, Circle, CircleDot, Tag } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { feedItems, preferences, toggleBookmark, toggleRead } = useStore();

  const getFreshness = (pubDate: string) => {
    const articleDate = new Date(pubDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    articleDate.setHours(0, 0, 0, 0);

    const diffTime = Math.ceil((today.getTime() - articleDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffTime === 0) {
      return <span className="text-emerald-600 font-bold text-sm mt-1">FRESH</span>;
    } else {
      return <span className="text-gray-500 text-sm mt-1">{diffTime} {diffTime === 1 ? 'Day' : 'Days'}</span>;
    }
  };

  const getMatchingTags = (item: any) => {
    if (!preferences?.searchTags || preferences.searchTags.length === 0) {
      return [];
    }
    
    const searchText = `${item.title} ${item.content}`.toLowerCase();
    return preferences.searchTags.filter(tag => searchText.includes(tag.toLowerCase()));
  };

  const filteredItems = feedItems
    .filter((item) => preferences?.selectedCategories?.includes(item.category))
    .map(item => ({
      ...item,
      matchingTags: getMatchingTags(item)
    }));

  // Sort by number of matching tags (descending) and then by date
  const sortedItems = filteredItems.sort((a, b) => {
    // First sort by number of matching tags
    const tagDiff = (b.matchingTags?.length || 0) - (a.matchingTags?.length || 0);
    if (tagDiff !== 0) return tagDiff;
    
    // Then by date if tag counts are equal
    return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
  });

  const getCategoryClass = (category: string) => {
    switch (category) {
      case 'AI News':
        return 'bg-indigo-100 text-indigo-800';
      case 'Science':
        return 'bg-emerald-100 text-emerald-800';
      case 'Technology':
        return 'bg-sky-100 text-sky-800';
      default:
        return 'bg-purple-100 text-purple-800';
    }
  };

  if (!preferences) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {sortedItems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <Tag className="w-16 h-16 text-purple-200 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No articles match your selected tags</p>
          <p className="text-gray-400 mt-2">Try adjusting your search tags in Settings</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedItems.map((item) => (
            <article key={item.id} className="news-card">
              <div className="news-card-header">
                <h2 className="text-xl font-semibold mb-3 text-purple-900">
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:text-purple-600">
                    {item.title}
                  </a>
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-3">{item.content}</p>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex flex-col">
                    <span className="text-gray-500">{new Date(item.pubDate).toLocaleDateString()}</span>
                    {getFreshness(item.pubDate)}
                  </div>
                  <span className={`px-3 py-1 rounded-full font-medium ${getCategoryClass(item.category)}`}>
                    {item.category}
                  </span>
                </div>
              </div>
              <div className="news-card-footer">
                <div className="flex-1 flex gap-2 mb-3">
                  {item.matchingTags.map((tag) => (
                    <span key={tag} className="tag-badge tag-badge-default">
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex justify-end space-x-2">
                  <div className="tooltip-wrapper">
                    <button
                      onClick={() => toggleRead(item.id)}
                      className="action-button text-gray-400 hover:text-purple-600"
                      aria-label={preferences.readItems?.includes(item.id) ? "Mark as unread" : "Mark as read"}
                    >
                      {preferences.readItems?.includes(item.id) ? (
                        <Circle className="w-5 h-5 fill-current" />
                      ) : (
                        <CircleDot className="w-5 h-5" />
                      )}
                      <span className="tooltip">
                        {preferences.readItems?.includes(item.id) ? "Mark as unread" : "Mark as read"}
                      </span>
                    </button>
                  </div>
                  
                  <div className="tooltip-wrapper">
                    <button
                      onClick={() => toggleBookmark(item.id)}
                      className="action-button text-gray-400 hover:text-purple-600"
                      aria-label={preferences.bookmarkedItems?.includes(item.id) ? "Remove from Read Later" : "Save for Later"}
                    >
                      {preferences.bookmarkedItems?.includes(item.id) ? (
                        <BookmarkCheck className="w-5 h-5 fill-current text-purple-600" />
                      ) : (
                        <Bookmark className="w-5 h-5" />
                      )}
                      <span className="tooltip">
                        {preferences.bookmarkedItems?.includes(item.id) ? "Remove from Read Later" : "Save for Later"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};