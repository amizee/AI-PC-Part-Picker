import axios from 'axios';
import { PCPart } from '../types/PCPart.ts';

const BASE_URL = 'http://localhost:8080/api/pcparts';

export const getPCPartById = async (id: number): Promise<PCPart> => {
    try {
        const response = await axios.get(`${BASE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching PCPart by ID: ", error);
        throw error;
    }
};

export const searchPCParts = async (query: string, partTypes: string[]): Promise<PCPart[]> => {
    try {
        const response = await axios.get(`${BASE_URL}/search-parts`, {
            params: {
                query: query || '', // Ensure empty query is passed as an empty string
                partTypes: partTypes.length > 0 ? partTypes : undefined, // Only pass if non-empty
            },
            paramsSerializer: params => new URLSearchParams(params).toString(),
        });
        return response.data;
    } catch (error) {
        console.error('Error searching PC parts:', error);
        throw error;
    }
};