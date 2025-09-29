export interface PCPart {
    id: number;
    name: string;
    price: number;
    imageURL: string;
}

export interface CPU extends PCPart {
    coreCount: number;
    performanceCoreClock: number;
    performanceCoreBoostClock: number;
    microArchitecture: string;
    tdp: number;
    integratedGraphics: string;
}

export interface Cooler extends PCPart {
    fanRPM: number;
    noiseLevel: number;
    colour: string;
    radiatorSize: number;
}

export interface Motherboard extends PCPart {
    socket: string;
    formFactor: string;
    memoryMax: number;
    memorySlots: number;
    colour: string;
}

export interface Memory extends PCPart {
    speed: string;
    numModules: number;
    moduleSize: number;
    colour: string;
    firstWordLatency: number;
    CASLatency: number;
}

export interface Storage extends PCPart {
    capacity: number;
    type: string;
    cache: number;
    formFactor: string;
    connectionInterface: string;
}

export interface GPU extends PCPart {
    chipset: string;
    memory: number;
    coreClock: number;
    boostClock: number;
    colour: string;
    length: number;
}

export interface Case extends PCPart {
    type: string;
    colour: string;
    powerSupply: number;
    sidePaneMaterial: string;
    externalVolume: number;
    numInternalBays: number;
}

export interface PowerSupply extends PCPart {
    type: string;
    efficiencyRating: string;
    wattage: number;
    modular: string;
    colour: string;
}

export interface OS extends PCPart {
    mode: string;
    maxSupportedMem: number;
}