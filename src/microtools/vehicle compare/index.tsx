import React, { useState, useCallback } from 'react';

// Vehicle data
const VEHICLE_LIST = [
    { id: 1, name: "Hyundai Creta (2024)", query: "Hyundai Creta 2024 latest ex-showroom price and mileage" },
    { id: 2, name: "Kia Seltos (2024)", query: "Kia Seltos 2024 latest ex-showroom price and features" },
    { id: 3, name: "Maruti Brezza (2024)", query: "Maruti Brezza 2024 latest specifications and safety rating" },
    { id: 4, name: "Mahindra Scorpio-N (2024)", query: "Mahindra Scorpio-N 2024 specs and price" },
    { id: 5, name: "Tata Nexon (2024)", query: "Tata Nexon 2024 updated features and price" },
    { id: 6, name: "Toyota Innova Hycross", query: "Toyota Innova Hycross latest hybrid mileage and power" },
];

// Helper functions
const formatPrice = (price: string) => {
    const num = parseFloat(price);
    if (isNaN(num)) return '-';
    
    if (num >= 10000000) {
        return (num / 10000000).toFixed(2) + ' Crore';
    } else if (num >= 100000) {
        return (num / 100000).toFixed(2) + ' Lakh';
    } else if (num > 0) {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
    }
    return '₹ N/A';
};

const getNumericValue = (val: string) => {
    if (typeof val !== 'string') return 0;
    const match = val.match(/(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 0;
};

const determineWinner = (specName: string, val1: string, val2: string) => {
    const num1 = getNumericValue(val1);
    const num2 = getNumericValue(val2);
    if (num1 === num2) return 0;
    if (specName.toLowerCase().includes('price')) return num1 < num2 ? 1 : 2;
    if (specName.toLowerCase().includes('mileage') || specName.toLowerCase().includes('power') || specName.toLowerCase().includes('safety')) return num1 > num2 ? 1 : 2;
    return 0;
};

// Visual Bar Component
const VisualBar = ({ label, v1, v2, higherIsBetter }: { label: string; v1: string; v2: string; higherIsBetter: boolean }) => {
    const num1 = getNumericValue(v1);
    const num2 = getNumericValue(v2);
    const maxVal = Math.max(num1, num2);

    if (maxVal === 0 || num1 === 0 || num2 === 0) return null;

    const width1 = (num1 / maxVal) * 100;
    const width2 = (num2 / maxVal) * 100;

    let barColor1, barColor2;
    
    if (higherIsBetter) {
        barColor1 = num1 >= num2 ? 'rgb(59 130 246)' : 'rgba(239 68 68 / 0.5)';
        barColor2 = num2 > num1 ? 'rgb(59 130 246)' : 'rgba(239 68 68 / 0.5)';
    } else {
        barColor1 = num1 <= num2 ? 'rgb(34 197 94)' : 'rgba(239 68 68 / 0.5)';
        barColor2 = num2 < num1 ? 'rgb(34 197 94)' : 'rgba(239 68 68 / 0.5)';
    }
    
    const displayV1 = label.includes('Price') ? formatPrice(num1.toString()) : v1;
    const displayV2 = label.includes('Price') ? formatPrice(num2.toString()) : v2;
    
    return (
        <div className="mb-6">
            <p className="font-medium mb-2">{label}</p>
            <div className="flex h-8 rounded-lg overflow-hidden bg-gray-700 shadow-inner">
                <div 
                    className="text-center text-xs flex items-center justify-center text-gray-900 font-bold transition-all duration-1000 ease-out"
                    style={{ width: `${width1}%`, backgroundColor: barColor1 }}
                >
                    {width1 > 20 ? `${displayV1}` : ''}
                </div>
                <div 
                    className="text-center text-xs flex items-center justify-center text-gray-900 font-bold transition-all duration-1000 ease-out"
                    style={{ width: `${width2}%`, backgroundColor: barColor2 }}
                >
                    {width2 > 20 ? `${displayV2}` : ''}
                </div>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span className="px-2 py-1 bg-gray-800 rounded-md">{width1 <= 20 ? displayV1 : ''}</span>
                <span className="px-2 py-1 bg-gray-800 rounded-md">{width2 <= 20 ? displayV2 : ''}</span>
            </div>
        </div>
    );
};

const ComparisonResult = ({ vehicle1, vehicle2, loading }: { vehicle1: any; vehicle2: any; loading: boolean }) => {
    if (loading) {
        return (
            <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                <h2 className="text-xl font-bold mb-2">Searching for real-time data...</h2>
                <p className="text-gray-400">Please wait, we are confirming the latest specifications.</p>
            </div>
        );
    }
    if (!vehicle1 || !vehicle2) return null;

    const specsToCompare = [
        { label: "Price (Ex-Showroom)", key: 'price', format: (v: string) => formatPrice(getNumericValue(v).toString()) },
        { label: "Mileage (ARAI)", key: 'mileage', format: (v: string) => v },
        { label: "Maximum Power", key: 'maxPower', format: (v: string) => v },
        { label: "Safety Rating", key: 'safetyRating', format: (v: string) => v },
    ];

    return (
        <div className="space-y-8">
            {/* Visual Comparison */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-xl border border-gray-700">
                <div className="flex items-center gap-2 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>
                    </svg>
                    <h2 className="text-xl font-bold text-blue-400">Quick Performance Visualizer</h2>
                </div>
                <div className="space-y-4">
                    <VisualBar 
                        label="Price Comparison (INR)" 
                        v1={vehicle1.data.price} 
                        v2={vehicle2.data.price} 
                        higherIsBetter={false} 
                    />
                    <VisualBar 
                        label="Power Comparison (HP/BHP)" 
                        v1={vehicle1.data.maxPower} 
                        v2={vehicle2.data.maxPower} 
                        higherIsBetter={true} 
                    />
                    <VisualBar 
                        label="Mileage Comparison (kmpl)" 
                        v1={vehicle1.data.mileage} 
                        v2={vehicle2.data.mileage} 
                        higherIsBetter={true} 
                    />
                </div>
            </div>

            {/* Detailed Grid Comparison */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden shadow-xl border border-gray-700">
                <div className="grid grid-cols-3 bg-gradient-to-r from-gray-700 to-gray-800 font-bold border-b border-gray-600">
                    <div className="p-4">Specification</div>
                    <div className="p-4">{vehicle1.name}</div>
                    <div className="p-4">{vehicle2.name}</div>
                </div>
                
                {specsToCompare.map((spec, index) => {
                    const val1 = vehicle1.data[spec.key];
                    const val2 = vehicle2.data[spec.key];
                    
                    const displayVal1 = spec.format ? spec.format(val1) : val1;
                    const displayVal2 = spec.format ? spec.format(val2) : val2;

                    const winner = determineWinner(spec.label, getNumericValue(val1).toString(), getNumericValue(val2).toString());
                    
                    return (
                        <React.Fragment key={spec.key}>
                            <div className={`grid grid-cols-3 ${index % 2 === 0 ? 'bg-gray-800/50' : 'bg-gray-900/50'}`}>
                                <div className="p-4 font-medium flex items-center">
                                    <span>{spec.label}</span>
                                </div>
                                <div className={`p-4 flex items-center ${winner === 1 ? 'text-blue-400 font-bold' : ''}`}>
                                    {displayVal1 || 'N/A'}
                                </div>
                                <div className={`p-4 flex items-center ${winner === 2 ? 'text-blue-400 font-bold' : ''}`}>
                                    {displayVal2 || 'N/A'}
                                </div>
                            </div>
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

const VehicleCompare = () => {
    const [vehicle1Id, setVehicle1Id] = useState<number | null>(null);
    const [vehicle2Id, setVehicle2Id] = useState<number | null>(null);
    const [comparisonData, setComparisonData] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const vehicle1Info = VEHICLE_LIST.find(v => v.id === vehicle1Id);
    const vehicle2Info = VEHICLE_LIST.find(v => v.id === vehicle2Id);
    
    const displayVehicle1 = comparisonData ? { name: vehicle1Info?.name, data: comparisonData.v1 } : null;
    const displayVehicle2 = comparisonData ? { name: vehicle2Info?.name, data: comparisonData.v2 } : null;

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>, setVehicleId: React.Dispatch<React.SetStateAction<number | null>>) => {
        const id = parseInt(e.target.value);
        setVehicleId(id > 0 ? id : null);
        setComparisonData(null);
    };

    const resetComparison = () => {
        setVehicle1Id(null);
        setVehicle2Id(null);
        setComparisonData(null);
        setLoading(false);
    };

    const isReadyToCompare = vehicle1Info && vehicle2Info;

    const startComparison = useCallback(async () => {
        if (!isReadyToCompare || loading) return;

        setLoading(true);
        setComparisonData(null);

        // Mock data for demonstration
        const mockData1 = {
            price: "1200000",
            mileage: "21.0 kmpl",
            maxPower: "160 HP",
            safetyRating: "5 Stars"
        };
        
        const mockData2 = {
            price: "1500000",
            mileage: "18.5 kmpl",
            maxPower: "180 HP",
            safetyRating: "5 Stars"
        };

        // Simulate API delay
        setTimeout(() => {
            setComparisonData({ v1: mockData1, v2: mockData2 });
            setLoading(false);
        }, 1500);
    }, [vehicle1Info, vehicle2Info, isReadyToCompare, loading]);

    return (
        <div className="min-h-screen bg-gray-900 text-white rounded-2xl">
            <div className="container mx-auto px-4 py-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-blue-400 mb-2">Advanced Vehicle Comparison</h1>
                    <p className="text-gray-400">Select 2 Vehicles → Compare Real-Time Price and Specifications.</p>
                </div>

                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center mb-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">Select Vehicle 1</label>
                            <select 
                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md"
                                onChange={(e) => handleSelectChange(e, setVehicle1Id)} 
                                value={vehicle1Id || ''}
                                disabled={loading}
                            >
                                <option value="">Select Vehicle 1 (Base Line)</option>
                                {VEHICLE_LIST.map(v => (
                                    <option key={v.id} value={v.id} disabled={v.id === vehicle2Id}>
                                        {v.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="text-center text-gray-400 font-bold text-lg">VS</div>
                        
                        <div>
                            <label className="block text-sm font-medium mb-2">Select Vehicle 2</label>
                            <select 
                                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md"
                                onChange={(e) => handleSelectChange(e, setVehicle2Id)} 
                                value={vehicle2Id || ''}
                                disabled={loading}
                            >
                                <option value="">Select Vehicle 2 (Rival)</option>
                                {VEHICLE_LIST.map(v => (
                                    <option key={v.id} value={v.id} disabled={v.id === vehicle1Id}>
                                        {v.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        {(vehicle1Id !== null || vehicle2Id !== null) && (
                            <button 
                                className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium flex items-center justify-center gap-2"
                                onClick={resetComparison} 
                                disabled={loading}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>
                                </svg>
                                Reset
                            </button>
                        )}

                        <button 
                            className={`px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 ${isReadyToCompare && !loading ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 cursor-not-allowed'}`}
                            onClick={startComparison} 
                            disabled={!isReadyToCompare || loading}
                        >
                            {loading ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>
                                </svg>
                            )}
                            {loading ? 'Loading...' : 'Compare'}
                        </button>
                    </div>
                </div>

                {/* Comparison Results */}
                {comparisonData || loading ? (
                    <ComparisonResult 
                        vehicle1={displayVehicle1} 
                        vehicle2={displayVehicle2} 
                        loading={loading}
                    />
                ) : (
                    <div className="bg-gray-800 rounded-lg p-12 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-500 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                        </svg>
                        <h2 className="text-xl font-bold mb-2">Ready for Real-Time Data</h2>
                        <p className="text-gray-400">Select two vehicles using the dropdowns above and press the <strong>Compare</strong> button for the latest information.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VehicleCompare;