import React, { useEffect, useState, useRef } from 'react';
import Sidebar from "./Sidebar";
import { MdDelete } from "react-icons/md";
import { IoCopyOutline } from "react-icons/io5";
import { getAdCopiesByUser, deleteAdCopy } from '../../api/AdCopyApi';
import { useAuth } from '../../contexts/AuthContext';
import { AdCopy } from '../../types/AdCopyTypes';

const AdCopies: React.FC = () => {
    const [adCopies, setAdCopies] = useState<AdCopy[]>([]);
    const [copied, setCopied] = useState(false);
    const [deleted, setDeleted] = useState(false);
    const [isVHLarger, setIsVHLarger] = useState(false);
    const backgroundRef = useRef<HTMLDivElement>(null);
    const { getUserId } = useAuth();
    const userId = getUserId();

    // Check viewport size for responsive layout
    useEffect(() => {
        const handleResize = () => {
            const viewportHeight = window.innerHeight;
            if (backgroundRef.current) {
                setIsVHLarger(viewportHeight > backgroundRef.current.offsetHeight);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);
    if (!userId) { // Check if userId is null or undefined
        alert('User ID is missing. Please log in to generate an ad copy.');
        return;
    }
    // Fetch user ad copies from the backend
    useEffect(() => {
        const fetchAdCopies = async () => {
            try {
                const adCopiesData = await getAdCopiesByUser(userId);
                setAdCopies(adCopiesData);
            } catch (error) {
                console.error("Error fetching ad copies:", error);
            }
        };

        fetchAdCopies();
    }, [deleted, userId]);

    // Delete specific ad copy
    const handleDeleteAdCopy = async (adCopyId: number) => {
        try {
            await deleteAdCopy(adCopyId);
            setDeleted(!deleted); // Trigger re-fetch of ad copies
        } catch (error) {
            console.error("Error deleting ad copy:", error);
            alert("Failed to delete ad copy. Please try again.");
        }
    };

    // Copy ad copy content to clipboard
    const copyToClipboard = (content: string) => {
        navigator.clipboard.writeText(content).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 500); // Reset after a short delay
        });
    };

    return (
        <div className="w-full grid grid-cols-4">
            <Sidebar />
            <div
                ref={backgroundRef}
                className={`col-start-2 col-end-5 pr-12 pt-6 pb-6 ${isVHLarger ? 'h-[calc(100vh-80px)]' : ''}`}>
                <main className="w-full h-full rounded-lg bg-primary-grey-light">
                    <div className="flex flex-col">
                        {adCopies.length === 0 ? (
                            <p className="text-lg font-semibold text-gray-900">No saved ad copies found.</p>
                        ) : (
                            adCopies.map(ad => (
                                <div key={ad.id} className="flex flex-row ml-10 mt-10 h-48">
                                    <div className="w-2/3 bg-white rounded-xl overflow-y-auto p-6">
                                        <p className="font-medium text-lg">{ad.title}</p>
                                        <p className="text-md text-justify leading-relaxed">{ad.content}</p>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <IoCopyOutline
                                            onClick={() => copyToClipboard(`${ad.title}\n${ad.content}`)}
                                            className="w-10 h-10 p-1 cursor-pointer text-gray-700 hover:text-gray-500"
                                        />
                                        <MdDelete
                                            onClick={() => handleDeleteAdCopy(ad.id)}
                                            className="w-10 h-10 cursor-pointer text-red-600 hover:text-red-400"
                                        />
                                    </div>
                                    {copied && <p className="text-green-500 ml-2">Copied!</p>}
                                </div>
                            ))
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdCopies;
