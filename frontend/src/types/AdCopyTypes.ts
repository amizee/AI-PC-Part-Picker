// src/types/AdCopyTypes.ts
import { PCPart } from './PCPart';
import { User } from './User';

export interface AdCopy {
    id: number;
    pcPart: PCPart;
    user: User;
    title: string;
    content: string;
    used: boolean;
    boxed: boolean;
    ageInMonths: number;
}

export interface AdCopyRequest {
    pcPartId: number;
    used: boolean;
    boxed: boolean;
    ageInMonths: number;
    title: string;
    userId: number;
}
