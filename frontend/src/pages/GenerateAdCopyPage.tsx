// src/pages/GenerateAdCopyPage.tsx
import React, { useState, useEffect } from 'react';
import { searchPCParts } from '../api/PCPartApi'; // API call function
import { PCPart } from '../types/PCPart';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { generateAdCopy } from '../api/AdCopyApi';
import { AdCopyRequest, AdCopy } from '../types/AdCopyTypes';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
const partTypesList = [
    'CPU', 'COOLER', 'MOTHERBOARD', 'MEMORY',
    'STORAGE', 'GPU', 'CASE', 'POWER_SUPPLY', 'OS'
];

const GenerateAdCopyPage: React.FC = () => {
    const [query, setQuery] = useState('');
    const [partTypes, setPartTypes] = useState<string[]>(partTypesList);
    const [parts, setParts] = useState<PCPart[]>([]);
    const [selectedPart, setSelectedPart] = useState<PCPart | null>(null);
    const [used, setUsed] = useState(false);
    const [boxed, setBoxed] = useState(false);
    const [ageInMonths, setAgeInMonths] = useState(0);
    const [title, setTitle] = useState('');
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { getUserId } = useAuth();
    const userId = getUserId();
    const [generatedAdCopy, setGeneratedAdCopy] = useState<AdCopy | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    // Load search query and filters from the URL on page load
    useEffect(() => {
        const currentQuery = searchParams.get('query') || '';
        const currentPartTypes = searchParams.getAll('partTypes');
        setQuery(currentQuery);
        setPartTypes(currentPartTypes.length ? currentPartTypes : partTypesList);
        handleSearch(currentQuery, currentPartTypes);
    }, [searchParams]);

    // Handle part type checkbox changes
    const handlePartTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        setPartTypes((prevTypes) =>
            checked ? [...prevTypes, value] : prevTypes.filter((type) => type !== value)
        );
    };

    // Perform search and update the URL with query and filters
    const handleSearch = async (searchQuery = query, selectedPartTypes = partTypes) => {
        // If no part types are selected, use all part types by default
        const filters = selectedPartTypes.length ? selectedPartTypes : partTypesList;

        // Create a URLSearchParams object to update the URL with query and part types
        const urlParams = new URLSearchParams();
        if (searchQuery) urlParams.set('query', searchQuery);
        filters.forEach((type) => urlParams.append('partTypes', type));

        navigate(`/advertising?${urlParams.toString()}`); // Update the URL

        try {
            const results = await searchPCParts(searchQuery, filters);
            setParts(results);
        } catch (error) {
            console.error('Error searching PC parts:', error);
        }
    };

    // Handle 'Enter' key press in the search bar
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch(); // Trigger search on Enter
        }
    };

    // Handle part selection
    const handlePartSelect = (part: PCPart) => {
        setSelectedPart(part);
        setGeneratedAdCopy(null); // Reset generated ad copy when a new part is selected
    };

    // Handle ad copy generation
    const handleGenerateAdCopy = async () => {
        
        if (!selectedPart) {
            alert('Please select a PC part.');
            return;
        }

        if (!title.trim()) {
            alert('Please provide a title for your ad.');
            return;
        }
        if (!userId) { // Check if userId is null or undefined
            alert('User ID is missing. Please log in to generate an ad copy.');
            return;
        }

        const adCopyRequest: AdCopyRequest = {
            pcPartId: selectedPart.id,
            used,
            boxed,
            ageInMonths,
            title,
            userId, // Replace with actual user ID
        };

        try {
            setIsGenerating(true);
            const adCopy = await generateAdCopy(adCopyRequest);
            console.log('Raw Ad Copy API Response:', adCopy);
            setGeneratedAdCopy(adCopy); // Set the generated ad copy in state
            console.log('Generated Ad Copy Response2:', generatedAdCopy);
            setIsSaved(false);

        } catch (error) {
            console.error('Error generating ad copy:', error);
            if (axios.isAxiosError(error) && error.response) {
                // Attempt to extract the error message
                const errorMessage =
                    error.response.data.message || // For custom error messages
                    error.response.data.error || // For default Spring Boot error messages
                    JSON.stringify(error.response.data); // As a fallback
                alert(`Failed to generate ad copy: ${errorMessage}`);
            } else {
                alert('Failed to generate ad copy. Please try again.');
            }
        } finally {
            setIsGenerating(false);
        }
    };
    // Handle saving the generated ad copy
    const handleSaveAdCopy = async () => {
        if (!generatedAdCopy) return;

        try {
            await axios.post(`http://localhost:8080/api/users/${userId}/save-ad-copy`, generatedAdCopy);
            alert('Ad copy saved to your profile.');
            setIsSaved(true);
        } catch (error) {
            console.error('Error saving ad copy:', error);
            alert('Failed to save ad copy. Please try again.');
        }
    };    

    return (
        <div className="generate-ad-copy-page p-6">
            <h2 className="text-2xl font-bold mb-4">Generate Ad Copy</h2>

            <div className="search-container">
                <div className="search-bar mb-4">
                    <input
                        type="text"
                        placeholder="Enter part name..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="p-2 border border-gray-300 rounded-md flex grow"
                    />
                    <Button className='w-32' onClick={() =>handleSearch()}>
                        Search
                    </Button>
                </div>

                <div className="filters mb-4">
                    <h3 className="font-semibold mb-2">Filter by Part Type:</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {partTypesList.map((type) => (
                            <div key={type} className="flex items-center">
                                <input
                                    type="checkbox"
                                    value={type}
                                    checked={partTypes.includes(type)}
                                    onChange={handlePartTypeChange}
                                    className="mr-2"
                                />
                                <label>{type}</label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="results mb-6">
                {parts.length === 0 ? (
                    <p>No parts found.</p>
                ) : (
                    <ul className="parts-list">
                        {parts.map((pcPart) => (
                            <li
                                key={pcPart.id}
                                className={`part-item p-4 border rounded-md mb-2 cursor-pointer ${
                                    selectedPart?.id === pcPart.id ? 'bg-blue-100' : ''
                                }`}
                                onClick={() => handlePartSelect(pcPart)}
                            >
                                <div className="flex items-center">
                                    <img
                                        src={`http://localhost:8080/${pcPart.imageURL}`}
                                        alt={pcPart.name}
                                        className="w-16 h-16 object-contain mr-4"
                                    />
                                    <div>
                                        <h3 className="font-semibold">{pcPart.name}</h3>
                                        <p>Price: ${pcPart.price}</p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {selectedPart && (
                <div className="selected-part mb-6">
                    <h3 className="text-xl font-semibold mb-2">Selected Part:</h3>
                    <div className="p-4 border rounded-md">
                        <div className="flex items-center">
                            <img
                                src={`http://localhost:8080/${selectedPart.imageURL}`}
                                alt={selectedPart.name}
                                className="w-16 h-16 object-contain mr-4"
                            />
                            <div>
                                <h3 className="font-semibold">{selectedPart.name}</h3>
                                <p>Price: ${selectedPart.price}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Additional Details */}
            {selectedPart && (
                <div className="additional-details mb-6">
                    <h3 className="text-xl font-semibold mb-2">Additional Details:</h3>
                    <label className="block mb-2">
                        <input
                            type="checkbox"
                            checked={used}
                            onChange={(e) => setUsed(e.target.checked)}
                            className="mr-2"
                        />
                        Used
                    </label>
                    <label className="block mb-2">
                        <input
                            type="checkbox"
                            checked={boxed}
                            onChange={(e) => setBoxed(e.target.checked)}
                            className="mr-2"
                        />
                        Boxed
                    </label>
                    <label className="block mb-2">
                        Age in Months:
                        <input
                            type="number"
                            value={ageInMonths}
                            onChange={(e) => setAgeInMonths(Number(e.target.value))}
                            min="0"
                            className="ml-2 p-1 border border-gray-300 rounded-md w-20"
                        />
                    </label>
                    <label className="block mb-2">
                        Title:
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter ad title..."
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                        />
                    </label>

                    {/* Generate Ad Copy Button */}
                    <Button onClick={handleGenerateAdCopy} disabled={isGenerating}>
                        {isGenerating ? 'Generating...' : 'Generate Ad Copy'}
                    </Button>
                </div>
            )}

            {/* Display Generated Ad Copy */}
            {generatedAdCopy && generatedAdCopy.title && generatedAdCopy.content && (
                <div className="generated-ad-copy mt-6 p-4 border rounded-md bg-green-50">
                    <h3 className="text-xl font-semibold mb-2">Generated Ad Copy:</h3>
                    <h4 className="font-semibold mb-2">{generatedAdCopy.title}</h4>
                    <p>{generatedAdCopy.content}</p>

                    
                    {/* Save Ad Copy Button */}
                    <Button onClick={handleSaveAdCopy} disabled={isSaved}>
                        {isSaved ? 'Saved to Profile' : 'Save Ad Copy'}
                    </Button>                    
                </div>
            )}
        </div>
    );
};

export default GenerateAdCopyPage;
