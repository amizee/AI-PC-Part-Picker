import {useParams} from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { getPCPartById } from "../api/PCPartApi.ts";
import {getSavedPartsForUser, savePCPartForUser, unsavePCPartForUser} from "../api/UserApi.ts";
import { PCPart, CPU, GPU, OS, Case, Storage, Memory, Motherboard, PowerSupply, Cooler } from '../types/PCPart.ts';
import './PCPartDetail.css';
import {useAuth} from "../contexts/AuthContext.tsx";

const PCPartDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [pcPart, setPCPart] = useState<PCPart | null>(null);
    const [isSaved, setIsSaved] = useState(false);
    const [loading, setLoading] = useState(true);

    const { getUserId } = useAuth();
    const userId = getUserId();

    // Type guard for narrowing to CPU etc.
    const isCPU = (pcPart: PCPart): pcPart is CPU => {
        return (pcPart as CPU).coreCount !== undefined;
    };

    const isGPU = (pcPart: PCPart): pcPart is GPU => {
        return (pcPart as GPU).chipset !== undefined;
    };

    const isOS = (pcPart: PCPart): pcPart is OS => {
        return (pcPart as OS).mode !== undefined;
    };

    const isCase = (pcPart: PCPart): pcPart is Case => {
        return (pcPart as Case).externalVolume !== undefined;
    };

    const isStorage = (pcPart: PCPart): pcPart is Storage => {
        return (pcPart as Storage).capacity !== undefined;
    };

    const isMemory = (pcPart: PCPart): pcPart is Memory => {
        return (pcPart as Memory).speed !== undefined;
    };

    const isMotherboard = (pcPart: PCPart): pcPart is Motherboard => {
        return (pcPart as Motherboard).socket !== undefined;
    };

    const isPowerSupply = (pcPart: PCPart): pcPart is PowerSupply => {
        return (pcPart as PowerSupply).wattage !== undefined;
    };

    const isCooler = (pcPart: PCPart): pcPart is Cooler => {
        return (pcPart as Cooler).fanRPM !== undefined;
    };

    useEffect(() => {
        const fetchPCPart = async () => {
            try {
                const part = await getPCPartById(Number(id));
                setPCPart(part);

                // Check if part is already saved
                const savedParts = await getSavedPartsForUser(userId);
                setIsSaved(savedParts.some((p) => p.id === part.id));
            } catch (error) {
                console.error("Error fetching PCPart:", error);
            } finally {
                setLoading(false)
            }
        };
        fetchPCPart();
    }, [id, userId]);

    const handleSave = async () => {
        if (!userId) {
            alert('Please login to save this part.');
            return;
        }

        try {
            if (pcPart) {
                console.log(`Saving part with ID ${pcPart.id} for user ID ${userId}`); // Log for debugging
                await savePCPartForUser(userId, pcPart.id);
                setIsSaved(true);
                alert('PC part saved successfully.');
            }
        } catch (error) {
            console.error('Error saving PC part:', error);
            alert('Failed to save PC part.');
        }
    };

    const handleUnsave = async () => {
        if (!userId) {
            alert('Please login to unsave this part.');
            return;
        }
        try {
            if (pcPart) {
                await unsavePCPartForUser(userId, pcPart.id);
                setIsSaved(false);
                alert("PC part unsaved successfully.");
            }
        } catch (error) {
            console.error('Error unsaving PC part:', error);
            alert("Failed to unsave PC part.");
        }
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!pcPart) {
        return <div>PCPart not found</div>;
    }

    return (
        <div className="pcpart-detail">
            <h1>{pcPart.name}</h1>
            <img
                src={`http://localhost:8080/${pcPart.imageURL}`}
                alt={pcPart.name}
            />
            <p>Price: ${pcPart.price}</p>

            {/* Save button */}
            {isSaved ? (
                <button onClick={handleUnsave}>Unsave</button>
            ) : (
                <button onClick={handleSave}>Save</button>
            )}

            {isCPU(pcPart) && (
                <div className="details-section">
                    <h3>CPU Details</h3>
                    <p>Core Count: {pcPart.coreCount}</p>
                    <p>Core Clock: {pcPart.performanceCoreClock} GHz</p>
                    <p>Boost Clock: {pcPart.performanceCoreBoostClock} GHz</p>
                    <p>Microarchitecture: {pcPart.microArchitecture}</p>
                    <p>TDP: {pcPart.tdp} W</p>
                    <p>Integrated Graphics: {pcPart.integratedGraphics}</p>
                </div>
            )}

            {isGPU(pcPart) && (
                <div className="details-section">
                    <h3>GPU Details</h3>
                    <p>Chipset: {pcPart.chipset}</p>
                    <p>Memory: {pcPart.memory} GB</p>
                    <p>Core Clock: {pcPart.coreClock} MHz</p>
                    <p>Boost Clock: {pcPart.boostClock} MHz</p>
                    <p>Colour: {pcPart.colour}</p>
                    <p>Length: {pcPart.length} mm</p>
                </div>
            )}

            {isOS(pcPart) && (
                <div className="details-section">
                    <h3>Operating System Details</h3>
                    <p>Mode: {pcPart.mode}</p>
                    <p>Maximum Supported Memory: {pcPart.maxSupportedMem} GB</p>
                </div>
            )}

            {isCase(pcPart) && (
                <div className="details-section">
                    <h3>Case Details</h3>
                    <p>Type: {pcPart.type}</p>
                    <p>Colour: {pcPart.colour}</p>
                    <p>Power Supply: {pcPart.powerSupply} W</p>
                    <p>Side Panel: {pcPart.sidePaneMaterial}</p>
                    <p>External Volume: {pcPart.externalVolume} L</p>
                    <p>Internal Bays: {pcPart.numInternalBays}</p>
                </div>
            )}

            {isStorage(pcPart) && (
                <div className="details-section">
                    <h3>Storage Details</h3>
                    <p>Capacity: {pcPart.capacity} GB</p>
                    <p>Type: {pcPart.type}</p>
                    <p>Cache: {pcPart.cache} MB</p>
                    <p>Form Factor: {pcPart.formFactor}</p>
                    <p>Interface: {pcPart.connectionInterface}</p>
                </div>
            )}

            {isMemory(pcPart) && (
                <div className="details-section">
                    <h3>Memory Details</h3>
                    <p>Speed: {pcPart.speed}</p>
                    <p>Modules: {pcPart.numModules} x {pcPart.moduleSize} GB</p>
                    <p>Colour: {pcPart.colour}</p>
                    <p>First Word Latency: {pcPart.firstWordLatency} ns</p>
                    <p>CAS Latency: {pcPart.CASLatency}</p>
                </div>
            )}

            {isMotherboard(pcPart) && (
                <div className="details-section">
                    <h3>Motherboard Details</h3>
                    <p>Socket: {pcPart.socket}</p>
                    <p>Form Factor: {pcPart.formFactor}</p>
                    <p>Memory Max: {pcPart.memoryMax} GB</p>
                    <p>Memory Slots: {pcPart.memorySlots}</p>
                    <p>Colour: {pcPart.colour}</p>
                </div>
            )}

            {isPowerSupply(pcPart) && (
                <div className="details-section">
                    <h3>Power Supply Details</h3>
                    <p>Type: {pcPart.type}</p>
                    <p>Efficiency Rating: {pcPart.efficiencyRating}</p>
                    <p>Wattage: {pcPart.wattage} W</p>
                    <p>Modular: {pcPart.modular}</p>
                    <p>Colour: {pcPart.colour}</p>
                </div>
            )}

            {isCooler(pcPart) && (
                <div className="details-section">
                    <h3>Cooler Details</h3>
                    <p>Fan RPM: {pcPart.fanRPM} RPM</p>
                    <p>Noise Level: {pcPart.noiseLevel} dB</p>
                    <p>Colour: {pcPart.colour}</p>
                    <p>Radiator Size: {pcPart.radiatorSize} mm</p>
                </div>
            )}

        </div>
    );

};

export default PCPartDetail;