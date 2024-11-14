import React from 'react';
import { Logo } from './Logo';

export const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-20 header-gradient text-white h-20 shadow-lg">
      <div className="h-full max-w-7xl mx-auto flex items-center justify-center px-8">
        <div className="flex items-center">
          <div className="bg-gradient-to-br from-white to-purple-100 p-2 rounded-xl shadow-md">
            <Logo className="w-8 h-8 text-purple-900" />
          </div>
          <div className="ml-4 text-center">
            <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-100">
              OTTOMATOR Custom AI News Feed
            </h1>
            <p className="text-purple-200 text-sm mt-0.5 font-medium">
              Just the news you are interested in
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};