import { useState, useEffect } from "react";
import Overview from './components/SpaceOverview/Overview';
import MySpaces from './components/SpaceOverview/MySpaces';

export default function SpacesOverview() {
    const [activeTab, setActiveTab] = useState('spaces');

    return (
        <div className="min-h-screen w-screen bg-[#ece7e3] pb-20">
            <div className="flex flex-col pt-20">
                {/* Tabs */}
                <div className="h-16 w-full flex flex-row items-center sticky top-0 bg-[#ece7e3] z-10">
                    <div className="w-full flex border-t border-border justify-center">
                        {['spaces', 'overview', 'settings'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 font-medium capitalize transition-colors ${
                                    activeTab === tab
                                        ? 'border-b-2 border-blue-500 text-blue-500'
                                        : 'text-gray-500'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content (scrollable) */}
                <div className="w-full">
                    {activeTab === 'spaces' && <MySpaces />}
                    {activeTab === 'overview' && <Overview />}
                    {activeTab === 'settings' && <p>This is the settings panel.</p>}
                </div>
            </div>
        </div>
    );
}