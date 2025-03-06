"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { formatSpeed, formatPing } from '@/app/lib/speedTest';

interface ISPAverageSpeedData {
    provider: string;
    downloadAvg: number;
    uploadAvg: number;
    pingAvg: number;
    samples: number;
}

export default function ISPSpeedStats({
    provider,
    location
}: {
    provider: string;
    location: { city: string; region: string; country: string }
}) {
    const [averageSpeedData, setAverageSpeedData] = useState<ISPAverageSpeedData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAverageSpeedData = async () => {
            if (!provider || !location) return;

            try {
                const locationKey = `${location.city || 'unknown'}-${location.region || 'unknown'}-${location.country || 'unknown'}`;
                const response = await fetch(`/api/average-speeds?locationKey=${locationKey}&provider=${provider}`);

                if (response.ok) {
                    const data = await response.json();
                    setAverageSpeedData(data);
                }
            } catch (error) {
                console.error('Error fetching ISP average speed data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAverageSpeedData();
    }, [provider, location]);

    if (loading) {
        return (
            <div className="p-6 rounded-xl bg-black/20 backdrop-blur-sm border border-white/10">
                <div className="h-8 bg-white/5 rounded animate-pulse mb-4" />
                <div className="space-y-4">
                    <div className="h-6 bg-white/5 rounded animate-pulse" />
                    <div className="h-6 bg-white/5 rounded animate-pulse" />
                    <div className="h-6 bg-white/5 rounded animate-pulse" />
                </div>
            </div>
        );
    }

    if (!averageSpeedData) {
        return (
            <div className="p-6 rounded-xl bg-black/20 backdrop-blur-sm border border-white/10">
                <h2 className="text-2xl font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
                    ISP Speed Statistics
                </h2>
                <p className="text-gray-400">
                    No speed data available yet for {provider} in your area.
                </p>
            </div>
        );
    }

    return (
        <div className="p-6 rounded-xl bg-black/20 backdrop-blur-sm border border-white/10">
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-4">
                {provider} Speed Statistics
            </h2>
            <div className="space-y-6">
                <div className="p-4 rounded-lg bg-black/30">
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-400">Average Download</span>
                        <span className="font-medium">
                            {formatSpeed(averageSpeedData.downloadAvg)}
                        </span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{
                                width: `${(averageSpeedData.downloadAvg / 200) * 100}%`,
                            }}
                            className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                        />
                    </div>
                </div>
                <div className="p-4 rounded-lg bg-black/30">
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-400">Average Upload</span>
                        <span className="font-medium">
                            {formatSpeed(averageSpeedData.uploadAvg)}
                        </span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{
                                width: `${(averageSpeedData.uploadAvg / 100) * 100}%`,
                            }}
                            className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                        />
                    </div>
                </div>
                <div className="p-4 rounded-lg bg-black/30">
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-400">Average Ping</span>
                        <span className="font-medium">
                            {formatPing(averageSpeedData.pingAvg)}
                        </span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{
                                width: `${(averageSpeedData.pingAvg / 100) * 100}%`,
                            }}
                            className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                        />
                    </div>
                </div>
                <div className="text-xs text-gray-500 mt-2 text-center">
                    Based on {averageSpeedData.samples} {averageSpeedData.samples === 1 ? 'test' : 'tests'}
                </div>
            </div>
        </div>
    );
} 