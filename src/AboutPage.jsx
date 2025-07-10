import SpaceHeader from "./components/SpaceRoom/SpaceHeader";
import Tabs from "./components/SpaceRoom/Tabs";
import PostSection from "./components/SpaceRoom/PostSection";
import { useState } from "react";


export default function AboutPage() {
    const [activeTab, setActiveTab] = useState('home');
    return(
        <div className="w-screen h-screen bg-white">
            <SpaceHeader/>
            <div>
                  <div className="h-16 w-full flex flex-row items-center top-0 bg-white z-10">
                    <div className="w-full flex border-t border-border justify-center">
                      {['home', 'gallery', 'more'].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className="px-8 py-2 capitalize transition-colors md:text-xl text-gray-500 font-medium"
                        >
                          <span
                            className={`inline-block pb-1 transition-all ${
                              activeTab === tab
                                ? 'border-b-2 border-blue-500 text-blue-500 font-bold'
                                : ''
                            }`}
                          >
                            {tab}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
            
                  <div className="w-full">
                    {activeTab === 'home'}
                    {activeTab === 'gallery' }
                    {activeTab === 'more'}
                  </div>
                </div>
            
            
            
        </div>
    );
    
}