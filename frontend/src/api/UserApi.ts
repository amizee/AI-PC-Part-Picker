import axios from 'axios';
import { User } from '../types/User';
import {PCPart} from "../types/PCPart.ts";

const BASE_URL = 'http://localhost:8080/api/users';

// Function to create a new user
export const createUser = async (user: User): Promise<User> => {
    try {
        const response = await axios.post(`${BASE_URL}/create`, user);
        return response.data;
    } catch (error) {
        console.error("Error creating user: ", error);
        throw error;
    }
};

export const savePCPartForUser = async (userId: number, pcPartId: number) : Promise<void> => {
    const url = `${BASE_URL}/${userId}/save/${pcPartId}`;
    await axios.post(url); // Make POST request
}

export const unsavePCPartForUser = async (userId: number, pcPartId: number) : Promise<void> => {
    const url = `${BASE_URL}/${userId}/unsave/${pcPartId}`;
    await axios.delete(url);
}

export const getSavedPartsForUser = async (userId: number | null): Promise<PCPart[]> => {
    const url = `${BASE_URL}/${userId}/saved-parts`;
    const response = await axios.get(url);
    return response.data;
}

// Get all ad copies for a user
export const getAdCopiesByUser = async (userId: number): Promise<AdCopy[]> => {
    try {
        const response = await axios.get(`${BASE_URL}/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching ad copies: ", error);
        throw error;
    }
};