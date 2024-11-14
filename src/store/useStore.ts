import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Feed, FeedItem, UserPreferences, TagPreset } from '../types';

interface StoreState {
  feeds: Feed[];
  feedItems: FeedItem[];
  preferences: UserPreferences;
  addFeed: (feed: Feed) => void;
  removeFeed: (id: string) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  setFeedItems: (items: FeedItem[]) => void;
  toggleBookmark: (itemId: string) => void;
  toggleRead: (itemId: string) => void;
  addSearchTag: (tag: string) => void;
  removeSearchTag: (tag: string) => void;
  addTagPreset: (name: string, tags: string[]) => void;
  removeTagPreset: (presetId: string) => void;
  applyTagPreset: (presetId: string) => void;
}

const defaultFeeds: Feed[] = [
  {
    id: 'nasa',
    title: 'NASA Breaking News',
    url: 'https://www.nasa.gov/rss/dyn/breaking_news.rss',
    category: 'Science',
  },
  {
    id: 'hackernews',
    title: 'Hacker News',
    url: 'https://hnrss.org/frontpage',
    category: 'Technology',
  },
  {
    id: 'ai-latest',
    title: 'AI Latest News',
    url: 'https://news.google.com/rss/search?q=artificial+intelligence+when:1d&hl=en-US&gl=US&ceid=US:en',
    category: 'AI News',
  },
  {
    id: 'ai-research',
    title: 'AI Research Updates',
    url: 'https://news.google.com/rss/search?q=artificial+intelligence+research+when:7d&hl=en-US&gl=US&ceid=US:en',
    category: 'AI News',
  },
  {
    id: 'ai-business',
    title: 'AI Business Impact',
    url: 'https://news.google.com/rss/search?q=artificial+intelligence+business+when:7d&hl=en-US&gl=US&ceid=US:en',
    category: 'AI News',
  },
  {
    id: 'llm-news',
    title: 'LLM Developments',
    url: 'https://news.google.com/rss/search?q=large+language+models+when:7d&hl=en-US&gl=US&ceid=US:en',
    category: 'AI News',
  },
  {
    id: 'ai-image',
    title: 'AI Image Generation',
    url: 'https://news.google.com/rss/search?q=ai+image+generation+stable+diffusion+dall-e+when:7d&hl=en-US&gl=US&ceid=US:en',
    category: 'AI News',
  }
];

const initialPreferences: UserPreferences = {
  selectedCategories: ['Science', 'Technology', 'AI News'],
  selectedFeeds: defaultFeeds.map(feed => feed.id),
  bookmarkedItems: [],
  readItems: [],
  searchTags: [],
  tagPresets: [],
};

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      feeds: defaultFeeds,
      feedItems: [],
      preferences: initialPreferences,
      addFeed: (feed) =>
        set((state) => ({ feeds: [...state.feeds, feed] })),
      removeFeed: (id) =>
        set((state) => ({ feeds: state.feeds.filter((feed) => feed.id !== id) })),
      updatePreferences: (newPreferences) =>
        set((state) => ({
          preferences: { ...state.preferences, ...newPreferences },
        })),
      setFeedItems: (items) =>
        set({ feedItems: items }),
      toggleBookmark: (itemId) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            bookmarkedItems: state.preferences.bookmarkedItems?.includes(itemId)
              ? state.preferences.bookmarkedItems.filter(id => id !== itemId)
              : [...(state.preferences.bookmarkedItems || []), itemId]
          }
        })),
      toggleRead: (itemId) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            readItems: state.preferences.readItems?.includes(itemId)
              ? state.preferences.readItems.filter(id => id !== itemId)
              : [...(state.preferences.readItems || []), itemId]
          }
        })),
      addSearchTag: (tag) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            searchTags: [...new Set([...(state.preferences.searchTags || []), tag])]
          }
        })),
      removeSearchTag: (tag) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            searchTags: (state.preferences.searchTags || []).filter(t => t !== tag)
          }
        })),
      addTagPreset: (name, tags) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            tagPresets: [
              ...(state.preferences.tagPresets || []),
              {
                id: `preset-${Date.now()}`,
                name,
                tags
              }
            ]
          }
        })),
      removeTagPreset: (presetId) =>
        set((state) => ({
          preferences: {
            ...state.preferences,
            tagPresets: state.preferences.tagPresets.filter(preset => preset.id !== presetId)
          }
        })),
      applyTagPreset: (presetId) =>
        set((state) => {
          const preset = state.preferences.tagPresets.find(p => p.id === presetId);
          if (!preset) return state;

          return {
            preferences: {
              ...state.preferences,
              searchTags: [...new Set([...state.preferences.searchTags, ...preset.tags])]
            }
          };
        }),
    }),
    {
      name: 'feed-reader-storage',
      partialize: (state) => ({
        preferences: state.preferences,
        feeds: state.feeds,
      }),
    }
  )
);