import React, { useState, useEffect } from 'react';
import { IoClose } from "react-icons/io5";

const AdSection = () => {
    const [currentAdIndex, setCurrentAdIndex] = useState(0);
    const [visibleAds, setVisibleAds] = useState([0, 1, 2]);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [adToDelete, setAdToDelete] = useState(null);
    
    // Enhanced ad data with more diverse categories
    const ads = [
        {
            id: 1,
            category: "Education",
            imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            title: "Online Learning",
            description: "Learn from anywhere, anytime",
            link: "https://www.udemy.com"
        },
        {
            id: 2,
            category: "Sports",
            imageUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            title: "Sports Equipment",
            description: "Get game-ready with premium gear",
            link: "https://www.nike.com"
        },
        {
            id: 3,
            category: "Shopping",
            imageUrl: "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            title: "Fashion Deals",
            description: "Latest trends at great prices",
            link: "https://www.zara.com"
        },
        {
            id: 4,
            category: "Trends",
            imageUrl: "https://images.unsplash.com/photo-1616530940355-351fabd9524b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            title: "Digital Entertainment",
            description: "Stream the latest shows",
            link: "https://www.netflix.com"
        },
        {
            id: 5,
            category: "Technology",
            imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            title: "Latest Gadgets",
            description: "Discover new tech innovations",
            link: "https://www.apple.com"
        },
        {
            id: 6,
            category: "Travel",
            imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            title: "Exotic Destinations",
            description: "Plan your next adventure",
            link: "https://www.booking.com"
        },
        {
            id: 7,
            category: "Food & Dining",
            imageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            title: "Food Delivery",
            description: "Order delicious meals",
            link: "https://www.ubereats.com"
        },
        {
            id: 8,
            category: "Fitness",
            imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            title: "Gym Membership",
            description: "Start your fitness journey",
            link: "https://www.goldsgym.com"
        },
        {
            id: 9,
            category: "Beauty & Wellness",
            imageUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            title: "Skincare Products",
            description: "Natural beauty solutions",
            link: "https://www.sephora.com"
        },
        {
            id: 10,
            category: "Home & Living",
            imageUrl: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            title: "Home Decor",
            description: "Transform your space",
            link: "https://www.ikea.com"
        },
        {
            id: 11,
            category: "Automotive",
            imageUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            title: "Electric Vehicles",
            description: "Future of mobility",
            link: "https://www.tesla.com"
        },
        {
            id: 12,
            category: "Photography",
            imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            title: "Camera Gear",
            description: "Capture moments perfectly",
            link: "https://www.canon.com"
        },
        {
            id: 13,
            category: "Art & Design",
            imageUrl: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            title: "Digital Art Tools",
            description: "Create amazing designs",
            link: "https://www.adobe.com"
        }
    ];

    useEffect(() => {
        const adRotationInterval = window.setInterval(() => {
            setCurrentAdIndex((prevIndex) => (prevIndex + 1) % ads.length);
            setVisibleAds(prev => {
                const newAds = [...prev];
                newAds[0] = (newAds[0] + 1) % ads.length;
                newAds[1] = (newAds[1] + 1) % ads.length;
                newAds[2] = (newAds[2] + 1) % ads.length;
                return newAds;
            });
        }, 5000);

        return () => {
            window.clearInterval(adRotationInterval);
        };
    }, []);

    const handleAdClick = (link) => {
        window.open(link, '_blank', 'noopener,noreferrer');
    };

    const handleCloseAd = (adId, e) => {
        e.stopPropagation();
        setAdToDelete(adId);
        setShowConfirmDialog(true);
    };

    const confirmDelete = () => {
        setVisibleAds(prev => {
            // Remove the closed ad
            const filteredAds = prev.filter(id => id !== adToDelete);
            // Add a new random ad that's not already visible
            const availableAds = Array.from({ length: ads.length }, (_, i) => i)
                .filter(i => !filteredAds.includes(i));
            const newAdIndex = availableAds[Math.floor(Math.random() * availableAds.length)];
            return [...filteredAds, newAdIndex];
        });
        setShowConfirmDialog(false);
        setAdToDelete(null);
    };

    const cancelDelete = () => {
        setShowConfirmDialog(false);
        setAdToDelete(null);
    };

    return (
        <div className="relative w-full h-full bg-[#181818] p-4 space-y-4">
            {visibleAds.map((adIndex) => {
                const ad = ads[adIndex];
                return (
                    <div 
                        key={ad.id}
                        onClick={() => handleAdClick(ad.link)}
                        className="relative h-[calc(33.33%-1rem)] cursor-pointer group rounded-lg overflow-hidden transition-all duration-700"
                        style={{
                            transform: 'scale(1)',
                            opacity: '1',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                        }}
                    >
                        <button 
                            onClick={(e) => handleCloseAd(adIndex, e)}
                            className="absolute top-2 right-2 z-[9999] bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                        >
                            <IoClose size={20} />
                        </button>
                        <img 
                            src={ad.imageUrl} 
                            alt={`Ad ${ad.id}`}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3 z-[60]">
                            <span className="text-xs text-green-400 font-semibold">{ad.category}</span>
                            <h3 className="text-white font-bold text-sm mt-1">{ad.title}</h3>
                            <p className="text-gray-300 text-xs mt-1">{ad.description}</p>
                        </div>
                    </div>
                );
            })}

            {/* Confirmation Dialog */}
            {showConfirmDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999]">
                    <div className="bg-white rounded-xl p-8 max-w-lg w-full mx-4 shadow-2xl transform transition-all">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-gray-900">Remove Advertisement</h3>
                            <button 
                                onClick={cancelDelete}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <IoClose size={24} />
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center space-x-3">
                                    <img 
                                        src={ads[adToDelete]?.imageUrl} 
                                        alt="Ad thumbnail" 
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                    <div>
                                        <span className="text-sm text-green-600 font-semibold">
                                            {ads[adToDelete]?.category}
                                        </span>
                                        <h4 className="text-lg font-semibold text-gray-900">
                                            {ads[adToDelete]?.title}
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                            {ads[adToDelete]?.description}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-yellow-700">
                                            Removing this advertisement will replace it with a new one from our collection. 
                                            This action cannot be undone.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end space-x-4">
                            <button
                                onClick={cancelDelete}
                                className="px-6 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                            >
                                Keep Advertisement
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-6 py-2.5 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors font-medium flex items-center space-x-2"
                            >
                                <IoClose size={18} />
                                <span>Remove Advertisement</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdSection; 