import SpaceHeader from "./components/SpaceRoom/SpaceHeader";
import Tabs from "./components/SpaceRoom/Tabs";
import PostSection from "./components/SpaceRoom/PostSection";
import { useState } from "react";
import { IoShareOutline } from "react-icons/io5";
import { IoAdd } from "react-icons/io5";


export default function AboutPage() {
    const [activeTab, setActiveTab] = useState('home');
    const [handleShare, setHandleShare] = useState('');
    const [isOpen, setOpen] = useState(false)
    return(
        <div className="w-screen h-screen bg-white">
            <SpaceHeader/>
            <div>
                  <div className="h-16 w-full flex flex-row items-center top-0 bg-white z-10">
                    <div className="w-full flex justify-center">
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
            <div className="backdrop-blur-md bg-white/70 dark:bg-black/30 p-3 px-5 flex flex-row flex-nowrap justify-center items-center gap-3
                md:w-1/3 md:self-center md:mr-12 transition-all duration-200">
                <button
                  onClick={() => setOpen(true)}
                  className="flex items-center gap-2 bg-primary text-white font-medium rounded-full px-4 py-2 hover:shadow-md hover:bg-primary/90 transition-all duration-150"
                >
                  <IoAdd className="text-2xl"/>
                  Create Post
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 bg-surface text-secondary font-medium rounded-full px-4 py-2 hover:shadow-md hover:bg-surface/80 transition-all duration-150"
                >
                  <IoShareOutline className="text-xl"/>
                  Share Space
                </button>
              </div>
            
            
        </div>
    );
    
}