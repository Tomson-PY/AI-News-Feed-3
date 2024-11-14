import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Tag, X, Save, Plus, Trash2 } from 'lucide-react';

export const SearchTags: React.FC = () => {
  const { preferences, addSearchTag, removeSearchTag, addTagPreset, removeTagPreset, applyTagPreset } = useStore();
  const [newTag, setNewTag] = useState('');
  const [isCreatingPreset, setIsCreatingPreset] = useState(false);
  const [presetName, setPresetName] = useState('');

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag.trim()) {
      addSearchTag(newTag.trim());
      setNewTag('');
    }
  };

  const handleSavePreset = (e: React.FormEvent) => {
    e.preventDefault();
    if (presetName.trim() && preferences.searchTags.length > 0) {
      addTagPreset(presetName.trim(), preferences.searchTags);
      setPresetName('');
      setIsCreatingPreset(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Current Tags Section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-purple-900 mb-4">Search Tags</h2>
            <form onSubmit={handleAddTag} className="flex gap-4 mb-6">
              <div className="flex-1">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Enter a search tag..."
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors"
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary flex items-center gap-2"
                disabled={!newTag.trim()}
              >
                <Tag className="w-4 h-4" />
                Add Tag
              </button>
            </form>

            <div className="space-y-3">
              {(!preferences?.searchTags || preferences.searchTags.length === 0) ? (
                <p className="text-gray-500 text-center py-4">No search tags created yet</p>
              ) : (
                <>
                  <div className="flex flex-wrap gap-2">
                    {preferences.searchTags.map((tag) => (
                      <div
                        key={tag}
                        className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full group hover:bg-purple-100 transition-colors"
                      >
                        <Tag className="w-4 h-4" />
                        <span>{tag}</span>
                        <button
                          onClick={() => removeSearchTag(tag)}
                          className="p-0.5 hover:bg-purple-200 rounded-full transition-colors"
                          title="Remove tag"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  {!isCreatingPreset && (
                    <button
                      onClick={() => setIsCreatingPreset(true)}
                      className="mt-4 flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
                    >
                      <Save className="w-4 h-4" />
                      Save as Preset
                    </button>
                  )}

                  {isCreatingPreset && (
                    <form onSubmit={handleSavePreset} className="mt-4 flex items-center gap-2">
                      <input
                        type="text"
                        value={presetName}
                        onChange={(e) => setPresetName(e.target.value)}
                        placeholder="Enter preset name..."
                        className="flex-1 px-3 py-1.5 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors"
                      />
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={!presetName.trim()}
                      >
                        Save Preset
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsCreatingPreset(false)}
                        className="btn btn-secondary"
                      >
                        Cancel
                      </button>
                    </form>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tag Presets Section */}
        {preferences.tagPresets && preferences.tagPresets.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-purple-900 mb-4">Tag Presets</h2>
            <div className="space-y-4">
              {preferences.tagPresets.map((preset) => (
                <div
                  key={preset.id}
                  className="flex items-center justify-between p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <div>
                    <h3 className="font-medium text-purple-900">{preset.name}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {preset.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => applyTagPreset(preset.id)}
                      className="p-2 text-purple-600 hover:text-purple-700 hover:bg-purple-200 rounded-lg transition-colors"
                      title="Apply preset"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => removeTagPreset(preset.id)}
                      className="p-2 text-purple-600 hover:text-red-600 hover:bg-purple-200 rounded-lg transition-colors"
                      title="Delete preset"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};