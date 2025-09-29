// src/api/AdCopyApi.ts
import axios from 'axios';
import { AdCopy, AdCopyRequest } from '../types/AdCopyTypes';

const BASE_URL = 'http://localhost:8080/api/ad-copies';
const USER_CONTROLLER_BASE_URL = 'http://localhost:8080/api/users';

// Generate an ad copy
export const generateAdCopy = async (adCopyRequest: AdCopyRequest): Promise<AdCopy> => {
    try {
        const response = await axios.post(`${BASE_URL}/generate`, adCopyRequest);
        return response.data;
    } catch (error) {
        console.error("Error generating ad copy: ", error);
        console.error('API Error:', error);
        throw error;
    }
};

// Regenerate an existing ad copy
export const regenerateAdCopy = async (id: number): Promise<AdCopy> => {
    try {
        const response = await axios.post(`${BASE_URL}/${id}/regenerate`);
        return response.data;
    } catch (error) {
        console.error("Error regenerating ad copy: ", error);
        throw error;
    }
};

// Get all ad copies for a user
export const getAdCopiesByUser = async (userId: number): Promise<AdCopy[]> => {
    try {
        const response = await axios.get(`${USER_CONTROLLER_BASE_URL}/${userId}/ad-copies`);
        return response.data;
    } catch (error) {
        console.error("Error fetching ad copies: ", error);
        throw error;
    }
};

// Delete an ad copy
export const deleteAdCopy = async (id: number): Promise<void> => {
    try {
        await axios.delete(`${BASE_URL}/${id}`);
    } catch (error) {
        console.error("Error deleting ad copy: ", error);
        throw error;
    }
};