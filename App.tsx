
import React, { useState } from 'react';
import Header from './components/Header';
import ImageStylist from './components/ImageStylist';
import ChatConsultant from './components/ChatConsultant';

type ActiveTab = 'stylist' | 'consultant';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('stylist');

  const tabClasses = (tabName: ActiveTab) =>
    `px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-pink-500 ${
      activeTab === tabName
        ? 'bg-pink-600 text-white shadow-md'
        : 'text-gray-300 hover:bg-gray-700'
    }`;

  return (
    <div className="bg-gray-900 min-h-screen text-white antialiased">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800 p-1 rounded-lg flex space-x-1">
            <button
              onClick={() => setActiveTab('stylist')}
              className={tabClasses('stylist')}
            >
              Image Stylist
            </button>
            <button
              onClick={() => setActiveTab('consultant')}
              className={tabClasses('consultant')}
            >
              Chat Consultant
            </button>
          </div>
        </div>

        <div>
          {activeTab === 'stylist' && <ImageStylist />}
          {activeTab === 'consultant' && <ChatConsultant />}
        </div>
      </main>
       <footer className="text-center py-4 text-gray-500 text-xs">
          <p>Powered by Gemini. For illustrative purposes only.</p>
        </footer>
    </div>
  );
};

export default App;
