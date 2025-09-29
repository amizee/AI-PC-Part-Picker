import React, { useState, useEffect } from 'react';
import { searchPCParts } from '../api/PCPartApi'; // API call function
import { PCPart } from '../types/PCPart';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './styling/SearchPartsPage.css';
import Button from '../components/Button';

const partTypesList = [
    'CPU', 'COOLER', 'MOTHERBOARD', 'MEMORY',
    'STORAGE', 'GPU', 'CASE', 'POWER_SUPPLY', 'OS'
];

const SearchPartsPage: React.FC = () => {
    const [query, setQuery] = useState('');
    const [partTypes, setPartTypes] = useState<string[]>([]);
    const [parts, setParts] = useState<PCPart[]>([]);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Load search query and filters from the URL on page load
    useEffect(() => {
        const currentQuery = searchParams.get('query') || '';
        const currentPartTypes = searchParams.getAll('partTypes');
        setQuery(currentQuery);
        setPartTypes(currentPartTypes.length ? currentPartTypes : partTypesList); // Load all types if none are selected
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

        navigate(`/search-parts?${urlParams.toString()}`); // Update the URL

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
            handleSearch(); // Trigger search on Enter
        }
    };
    return (
        <div className="search-parts-page">
            <h2>Search Parts</h2>
    
            <div className="flex flex-col items-center m-4">
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Enter part name..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <Button className='w-98' onClick={() => handleSearch()}>Search</Button>
                </div>
    
                <div className="filters">
                    {partTypesList.map((type) => (
                        <div key={type}>
                            <input
                                type="checkbox"
                                value={type}
                                checked={partTypes.includes(type)}
                                onChange={handlePartTypeChange}
                            />
                            <label>{type}</label>
                        </div>
                    ))}
                </div>
            </div>
    
            <div className="results">
                {parts.length === 0 ? (
                    <p>No parts found.</p>
                ) : (
                    <ul className="parts-list">
                        {parts.map((pcPart) => (
                        <li key={pcPart.id} className="part-item">
                            <div className="part-content">
                                <img
                                    src={`http://localhost:8080/${pcPart.imageURL}`}
                                    alt={pcPart.name}
                                    className="part-image"
                                />
                                <div className="part-details">
                                    <a
                                        href={`http://localhost:5173/pcparts/${pcPart.id}`}
                                        className="part-name-link"
                                    >
                                        <h3 className="part-name">{pcPart.name}</h3>
                                    </a>
                                    <p>Price: ${pcPart.price}</p>
                                </div>
                            </div>
                        </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}    

export default SearchPartsPage;
