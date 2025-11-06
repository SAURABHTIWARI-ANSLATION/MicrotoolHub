import React, { useState, useCallback } from 'react';

// --- Global Constants (Global Constants) ---
const API_KEY = ""; // Gemini API Key (Leave this empty, it will be automatically filled by Canvas)
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=";
const VEHICLE_LIST = [
    { id: 1, name: "Hyundai Creta (2024)", query: "Hyundai Creta 2024 latest ex-showroom price and mileage" },
    { id: 2, name: "Kia Seltos (2024)", query: "Kia Seltos 2024 latest ex-showroom price and features" },
    { id: 3, name: "Maruti Brezza (2024)", query: "Maruti Brezza 2024 latest specifications and safety rating" },
    { id: 4, name: "Mahindra Scorpio-N (2024)", query: "Mahindra Scorpio-N 2024 specs and price" },
    { id: 5, name: "Tata Nexon (2024)", query: "Tata Nexon 2024 updated features and price" },
    { id: 6, name: "Toyota Innova Hycross", query: "Toyota Innova Hycross latest hybrid mileage and power" },
];

// --- Helper Functions (Helper Functions) ---
const formatPrice = (price) => {
    // Display 10000000 as 100 Lakh or 1 Crore
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

const getNumericValue = (val) => {
    // Extracts numeric value from string
    if (typeof val !== 'string') return 0;
    const match = val.match(/(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 0;
};

const determineWinner = (specName, val1, val2) => {
    const num1 = getNumericValue(val1);
    const num2 = getNumericValue(val2);
    if (num1 === num2) return 0;
    // Price (Lower is better)
    if (specName.toLowerCase().includes('price')) return num1 < num2 ? 1 : 2; 
    // Mileage, Power, Safety (Higher is better)
    if (specName.toLowerCase().includes('mileage') || specName.toLowerCase().includes('power') || specName.toLowerCase().includes('safety')) return num1 > num2 ? 1 : 2;
    // Other (No comparison)
    return 0;
};

// --- API Calling Utility (API Calling Utility) ---
async function fetchVehicleDataFromGemini(query) {
    const systemPrompt = `Act as an expert automotive data extractor. Your goal is to analyze the provided search results for the vehicle described in the query and extract the following 4 key structured data points. Do not make up any data. If a specific data point is not found in the search results, return "N/A" for that field.

    1. Price (Ex-Showroom): Extract the lowest starting Ex-Showroom price. Return the number only (e.g., 1500000).
    2. Mileage: Extract the highest claimed mileage (e.g., 21.0 kmpl). Return the value and unit (e.g., "21.0 kmpl").
    3. Max Power: Extract the maximum power output (e.g., 160 HP or 118 bhp). Return the value and unit (e.g., "160 HP").
    4. Safety Rating: Extract the latest Global NCAP or equivalent safety rating (e.g., 5 Stars).

    Your response MUST ONLY be a single JSON object conforming to the schema.`;

    const payload = {
        contents: [{ parts: [{ text: `Find the real-time specifications for: ${query}` }] }],
        tools: [{ "google_search": {} }],
        systemInstruction: {
            parts: [{ text: systemPrompt }]
        },
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "OBJECT",
                properties: {
                    price: { type: "STRING", description: "The starting Ex-Showroom price in numbers (e.g., '1500000'). Use 'N/A' if not found." },
                    mileage: { type: "STRING", description: "The highest claimed mileage with unit (e.g., '21.0 kmpl'). Use 'N/A' if not found." },
                    maxPower: { type: "STRING", description: "The maximum power output with unit (e.g., '160 HP'). Use 'N/A' if not found." },
                    safetyRating: { type: "STRING", description: "The latest safety rating (e.g., '5 Stars'). Use 'N/A' if not found." }
                },
                required: ["price", "mileage", "maxPower", "safetyRating"]
            }
        }
    };

    const apiUrl = `${GEMINI_API_URL}${API_KEY}`;
    
    // Retry mechanism (Exponential backoff)
    for (let i = 0; i < 3; i++) {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                // Throw error to trigger retry
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            const jsonText = result.candidates?.[0]?.content?.parts?.[0]?.text;

            if (jsonText) {
                const parsedData = JSON.parse(jsonText);
                return {
                    price: parsedData.price,
                    mileage: parsedData.mileage,
                    maxPower: parsedData.maxPower,
                    safetyRating: parsedData.safetyRating,
                };
            }
        } catch (error) {
            console.error(`Attempt ${i + 1} failed for query "${query}":`, error);
            if (i < 2) {
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000)); // Exponential backoff
            }
        }
    }

    // Return default N/A structure if all retries fail
    return { price: "N/A", mileage: "N/A", maxPower: "N/A", safetyRating: "N/A" };
}

// --- INLINE SVG ICON COMPONENTS (Icons) ---
const Icon = ({ name, size = 18, color = 'var(--accent-blue)', style = {} }) => {
    // Lucide Icons (https://lucide.dev/icons/)
    const icons = {
        Truck: (<><path d="M5 18H3c-1 0-2-1-2-2v-5c0-1 1-2 2-2h3l2-3h7l2 3h3c1 0 2 1 2 2v5c0 1-1 2-2 2h-2"/><path d="M10 18H5"/><circle cx="7" cy="21" r="2"/><circle cx="17" cy="21" r="2"/></>),
        DollarSign: <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>,
        Cpu: (<><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M20 15h2"/><path d="M15 4h-2"/><path d="M15 20h-2"/><path d="M4 9v2"/><path d="M20 9v2"/></>),
        Gauge: (<><path d="M12 14v4"/><path d="M10 13.75a7 7 0 1 0 4 0"/><path d="m14 14 3-3"/><path d="m10 14-3-3"/><path d="M5 22h14"/><path d="M12 2v2"/></>),
        Zap: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>,
        XCircle: (<><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></>),
        Search: (<><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></>),
        BarChart: (<><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></>),
        ChevronDown: <path d="m6 9 6 6 6-6"/>,
        Repeat: (<><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></>),
        Star: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>,
        Loader: <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    };

    // Rotating style for the Loader icon
    const rotationStyle = name === 'Loader' ? { animation: 'spin 1s linear infinite' } : {};

    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ ...style, ...rotationStyle }}>
            {icons[name]}
        </svg>
    );
};

// --- CRITICAL CSS STYLES FOR MOBILE OPTIMIZATION (CRITICAL CSS STYLES FOR MOBILE OPTIMIZATION) ---
const AppStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;500;700;900&display=swap');

    :root {
        --primary-dark: #1a1a2e;
        --secondary-dark: #272740;
        --accent-blue: #00e0ff;
        --accent-blue-dark: #00b3cc;
        --text-light: #f0f4f8;
        --text-subtle: #99aab5;
        --success-color: #4CAF50;
        --danger-color: #ff4c4c;
        --border-color: #3f4a66;
        --shadow-elevated: 0 15px 35px rgba(0, 0, 0, 0.4);
    }

    /* FIX 1: Ensure root elements take full height and width */
    html, body, #root {
        height: 100%;
        width: 100%;
        margin: 0;
        padding: 0;
        overflow-x: hidden; 
    }

    /* Base Styling */
    .app-container {
        font-family: 'Inter', sans-serif;
        background-color: var(--primary-dark);
        color: var(--text-light);
        min-height: 100vh;
        width: 100%; 
        display: flex;
        flex-direction: column;
    }

    /* Navbar */
    .navbar {
        background-color: var(--secondary-dark);
        padding: 1.2rem 1.5rem;
        box-shadow: var(--shadow-elevated);
        border-bottom: 2px solid var(--accent-blue);
    }
    .navbar-brand {
        font-size: 1.8rem;
        font-weight: 900;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--text-light);
    }
    
    /* Main Layout Container */
    .comparison-container {
        flex-grow: 1;
        padding: 2rem 0.5rem; /* Mobile padding */
        max-width: 1400px; 
        width: 100%;
        margin: 0 auto; 
    }
    .empty-state {
        text-align: center;
        padding: 3rem 1rem;
        background: var(--secondary-dark);
        border-radius: 12px;
        box-shadow: var(--shadow-elevated);
        margin-top: 2rem;
    }
    .empty-state h2 {
        font-size: 1.5rem;
        color: var(--accent-blue);
        margin-top: 0;
    }
    .empty-state p {
        color: var(--text-subtle);
    }

    /* Selection Area */
    .selection-area {
        margin-bottom: 2rem;
        display: flex;
        flex-direction: column; 
        gap: 1.5rem; 
        align-items: center;
        background: var(--secondary-dark);
        padding: 1.5rem;
        border-radius: 12px;
        box-shadow: var(--shadow-elevated);
    }
    .selection-row {
        display: flex;
        gap: 1rem;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap; 
        width: 100%;
    }
    .selection-box {
        position: relative;
        flex: 1 1 100%; 
        min-width: 0; 
        width: 100%; 
    }
    .vs-icon {
        display: none; 
    }
    .select-dropdown {
        width: 100%;
        padding: 1rem 3rem 1rem 1rem;
        font-size: 1rem;
        border: 2px solid var(--border-color);
        border-radius: 8px;
        background-color: var(--primary-dark);
        color: var(--text-light);
        appearance: none;
        cursor: pointer;
        font-weight: 600;
        transition: border-color 0.2s, box-shadow 0.2s;
    }
    .select-dropdown:hover { border-color: var(--accent-blue-dark); }
    .select-dropdown:focus { 
        outline: none;
        border-color: var(--accent-blue);
        box-shadow: 0 0 0 4px rgba(0, 224, 255, 0.3);
    }
    .dropdown-icon {
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        pointer-events: none;
    }
    .reset-btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.8rem 1.8rem;
        border: 1px solid var(--danger-color);
        border-radius: 8px;
        background-color: transparent;
        color: var(--danger-color);
        font-weight: 700;
        cursor: pointer;
        transition: all 0.3s ease;
        text-transform: uppercase;
    }
    .reset-btn:hover {
        background-color: var(--danger-color);
        color: var(--primary-dark);
        box-shadow: 0 0 10px rgba(255, 76, 76, 0.5);
    }

    /* Compare Button */
    .compare-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 1rem 2rem;
        background-color: var(--accent-blue);
        color: var(--primary-dark);
        font-weight: 900;
        border-radius: 8px;
        cursor: pointer;
        border: none;
        box-shadow: 0 5px 15px rgba(0, 224, 255, 0.4);
        transition: all 0.3s ease;
        text-transform: uppercase;
        width: 100%;
    }
    .compare-btn:disabled {
        background-color: var(--text-subtle);
        color: #555;
        cursor: not-allowed;
        box-shadow: none;
    }
    .compare-btn:not(:disabled):hover {
        background-color: var(--accent-blue-dark);
        transform: translateY(-2px);
    }
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    /* Visualizer Bars */
    .visual-comparison {
        padding: 1rem; 
        background: var(--secondary-dark);
        border-radius: 12px;
        box-shadow: var(--shadow-elevated);
        margin-bottom: 3rem;
    }
    .visual-comparison h2 {
        font-size: 1.3rem; 
        color: var(--accent-blue);
        border-bottom: 2px solid var(--border-color);
        padding-bottom: 0.5rem;
        margin-bottom: 1.5rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    .bar-chart-row { margin-bottom: 1.5rem; }
    .bar-chart-row p {
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: var(--text-light);
    }
    .bar-container {
        display: flex;
        height: 25px;
        border-radius: 4px;
        overflow: hidden;
        background: var(--primary-dark);
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.5);
    }
    .bar {
        text-align: center;
        line-height: 25px;
        color: var(--primary-dark);
        font-size: 0.8rem; 
        font-weight: 700;
        transition: width 0.8s ease-out;
        white-space: nowrap;
        overflow: hidden;
        min-width: 10px;
    }

    /* Comparison Grid */
    .comparison-grid {
        display: grid;
        grid-template-columns: 1.5fr 1fr 1fr; 
        background-color: var(--secondary-dark);
        border-radius: 12px;
        box-shadow: var(--shadow-elevated);
        overflow: hidden;
        border: 1px solid var(--border-color);
    }
    .grid-header {
        background-color: #3f4a66;
        padding: 0.8rem 0.5rem; 
        font-size: 0.85rem;
        text-align: center;
        border-bottom: 1px solid var(--border-color);
        font-weight: 700;
        word-break: break-word; /* Long vehicle names on mobile */
    }
    .grid-header:nth-child(2) { border-right: 1px solid var(--border-color); }
    
    .spec-label {
        padding: 0.8rem 0.5rem; 
        font-weight: 600;
        border-right: 1px solid var(--border-color);
        border-bottom: 1px solid var(--border-color);
        display: flex;
        align-items: center;
        gap: 0.3rem; 
        font-size: 0.85rem;
        line-height: 1.2;
    }
    .spec-value {
        padding: 0.8rem 0.5rem; 
        border-bottom: 1px solid var(--border-color);
        text-align: center;
        font-size: 0.85rem;
        line-height: 1.2;
    }
    .spec-value:nth-child(3n + 2) { border-right: 1px solid var(--border-color); }
    .spec-value:nth-child(3n + 3) { border-right: none; }


    .winner { color: var(--accent-blue); font-weight: 700; }
    .loser { color: var(--text-subtle); }
    .advantage { color: var(--success-color); }
    .disadvantage { color: var(--danger-color); }
    .diff-row { background-color: #1a1a2e; font-style: italic; }
    .diff-label { font-weight: 500; font-size: 0.75rem; color: var(--text-subtle); justify-content: center; border-right: 1px solid var(--border-color); border-bottom: 1px dashed var(--border-color); }
    .diff-value { font-weight: 700; font-size: 0.75rem; border-bottom: 1px dashed var(--border-color); text-align: center; }
    .diff-value:nth-child(3n + 2) { border-right: 1px dashed var(--border-color); }
    .diff-value:nth-child(3n + 3) { border-right: none; }


    /* Footer */
    .footer {
        background-color: var(--primary-dark);
        color: var(--text-subtle);
        padding: 1rem 1rem;
        text-align: center;
        font-size: 0.8rem;
        margin-top: 2rem;
        flex-shrink: 0;
        border-top: 1px solid var(--border-color);
    }
    
    /* Desktop Responsiveness (min-width: 768px) */
    @media (min-width: 768px) {
        .comparison-container {
            padding: 3rem 2rem;
        }

        /* Selection Area - Desktop Layout */
        .selection-area {
            flex-direction: row;
            justify-content: center; 
            gap: 5rem; 
            padding: 2rem;
        }
        .selection-row {
            flex-wrap: nowrap;
            width: auto; 
        }
        .selection-box {
            flex: 1 1 300px; 
            width: auto; 
        }
        .vs-icon {
            display: block; 
        }
        .compare-btn {
            width: auto;
            min-width: 250px;
        }
        
        /* Grid - Desktop Layout */
        .comparison-grid {
            grid-template-columns: 1.5fr 2fr 2fr; 
        }
        .grid-header {
            padding: 1.2rem;
            font-size: 1rem;
        }
        .spec-label {
            padding: 1rem;
            font-size: 1rem;
            gap: 0.5rem;
        }
        .spec-value {
            padding: 1rem;
            font-size: 1rem;
        }
        .visual-comparison h2 {
            font-size: 1.5rem;
        }
        .bar {
            font-size: 0.85rem;
        }
        .diff-label, .diff-value {
            font-size: 0.9rem;
        }
    }
`;


// --- Visual Bar Component (Visual Bar) ---
const VisualBar = ({ label, iconName, v1, v2, higherIsBetter }) => {
    // Get numeric values
    const num1 = getNumericValue(v1);
    const num2 = getNumericValue(v2);

    const maxVal = Math.max(num1, num2);

    if (maxVal === 0 || num1 === 0 || num2 === 0) return null; // If data is invalid

    const width1 = (num1 / maxVal) * 100;
    const width2 = (num2 / maxVal) * 100;

    let barColor1, barColor2;
    
    // Determine winner's color
    if (higherIsBetter) { // Power, Mileage (Higher is better)
        barColor1 = num1 >= num2 ? 'var(--accent-blue)' : 'rgba(255, 76, 76, 0.5)';
        barColor2 = num2 > num1 ? 'var(--accent-blue)' : 'rgba(255, 76, 76, 0.5)';
    } else { // Price (Lower is better)
        barColor1 = num1 <= num2 ? 'var(--success-color)' : 'rgba(255, 76, 76, 0.5)';
        barColor2 = num2 < num1 ? 'var(--success-color)' : 'rgba(255, 76, 76, 0.5)';
    }
    
    // Determine display values
    const displayV1 = iconName === 'DollarSign' ? formatPrice(num1) : v1;
    const displayV2 = iconName === 'DollarSign' ? formatPrice(num2) : v2;
    
    // Inline CSS
    const winnerTextStyle = `.winner-text { color: ${higherIsBetter ? 'var(--accent-blue)' : 'var(--success-color)'}; }`;

    return (
        <div className="bar-chart-row">
            <style>{winnerTextStyle}</style>
            <p style={{ display: 'flex', alignItems: 'center' }}>
                <Icon name={iconName} size={16} color="var(--accent-blue)" style={{ marginRight: '5px' }} /> 
                {label}
            </p>
            <div className="bar-container">
                <div 
                    className="bar" 
                    style={{ width: `${width1}%`, backgroundColor: barColor1 }}
                >
                    {/* Show value if bar is wide enough */}
                    {width1 > 20 ? `${displayV1}` : ''}
                </div>
                <div 
                    className="bar" 
                    style={{ width: `${width2}%`, backgroundColor: barColor2 }}
                >
                    {/* Show value if bar is wide enough */}
                    {width2 > 20 ? `${displayV2}` : ''}
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-subtle)', marginTop: '5px' }}>
                {/* Show value below if bar is too narrow */}
                <span className={num1 === num2 ? '' : (num1 > num2 === higherIsBetter ? 'winner-text' : '')}>Vehicle 1: {width1 <= 20 ? displayV1 : ''}</span>
                <span className={num1 === num2 ? '' : (num2 > num1 === higherIsBetter ? 'winner-text' : '')}>Vehicle 2: {width2 <= 20 ? displayV2 : ''}</span>
            </div>
        </div>
    );
};


const ComparisonResult = ({ vehicle1, vehicle2, loading }) => {
    if (loading) {
        return (
            <div className="empty-state">
                <Icon name="Loader" size={48} color="var(--accent-blue)" style={{ margin: '0 auto 1rem', display: 'block' }} />
                <h2>Searching for real-time data...</h2>
                <p>Please wait, we are confirming the latest specifications using Google Search.</p>
            </div>
        );
    }
    if (!vehicle1 || !vehicle2) return null;

    const calculableKeys = ['price', 'mileage', 'maxPower'];
    
    // Use key-name obtained from API
    const specsToCompare = [
        { label: "Price (Ex-Showroom)", key: 'price', icon: 'DollarSign', format: (v) => formatPrice(getNumericValue(v)) },
        { label: "Mileage (ARAI)", key: 'mileage', icon: 'Gauge', format: (v) => v },
        { label: "Maximum Power", key: 'maxPower', icon: 'Zap', format: (v) => v },
        { label: "Safety Rating", key: 'safetyRating', icon: 'Star', format: (v) => v },
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            
            {/* Advanced Feature: Visualizer */}
            <div className="visual-comparison">
                <h2><Icon name="BarChart" size={20} color="var(--accent-blue)" /> Quick Performance Visualizer</h2>
                
                <VisualBar 
                    label="Price Comparison (INR)" 
                    iconName="DollarSign" 
                    v1={vehicle1.price} 
                    v2={vehicle2.price} 
                    higherIsBetter={false} 
                />
                <VisualBar 
                    label="Power Comparison (HP/BHP)" 
                    iconName="Zap" 
                    v1={vehicle1.maxPower} 
                    v2={vehicle2.maxPower} 
                    higherIsBetter={true} 
                />
                <VisualBar 
                    label="Mileage Comparison (kmpl)" 
                    iconName="Gauge" 
                    v1={vehicle1.mileage} 
                    v2={vehicle2.mileage} 
                    higherIsBetter={true} 
                />
            </div>

            {/* Detailed Grid Comparison */}
            <div className="comparison-grid">
                {/* Headers */}
                <div className="grid-header">Specification</div>
                <div className="grid-header">{vehicle1.name}</div>
                <div className="grid-header">{vehicle2.name}</div>

                {/* Rows */}
                {specsToCompare.map((spec) => {
                    const isCalculable = calculableKeys.includes(spec.key);
                    const val1 = vehicle1.data[spec.key];
                    const val2 = vehicle2.data[spec.key];
                    
                    const displayVal1 = spec.format ? spec.format(val1) : val1;
                    const displayVal2 = spec.format ? spec.format(val2) : val2;

                    const winner = determineWinner(spec.key, getNumericValue(val1), getNumericValue(val2));
                    const diffData = isCalculable && getNumericValue(val1) !== getNumericValue(val2) 
                        ? { diff: formatPrice(Math.abs(getNumericValue(val1) - getNumericValue(val2))) } 
                        : null;
                    const isPrice = spec.key === 'price';
                    
                    return (
                        <React.Fragment key={spec.key}>
                            {/* Spec Row */}
                            <div className="spec-label">
                                <Icon name={spec.icon} size={18} color="var(--text-subtle)" />
                                {spec.label}
                            </div>
                            <div 
                                className={`spec-value ${winner === 1 ? 'winner' : winner === 2 ? 'loser' : ''}`}
                            >
                                {displayVal1 || 'N/A'}
                            </div>
                            <div 
                                className={`spec-value ${winner === 2 ? 'winner' : winner === 1 ? 'loser' : ''}`}
                            >
                                {displayVal2 || 'N/A'}
                            </div>

                            {/* Difference Row */}
                            {isCalculable && diffData && (
                                <div className="diff-row" style={{ display: 'contents' }}>
                                    <div className="spec-label diff-label">Difference</div>
                                    <div className={`diff-value ${
                                        // Winner (with better value) always shows a +ve difference
                                        (isPrice && winner === 1) || (!isPrice && winner === 2) ? 'disadvantage' : 'advantage'
                                    }`}>
                                        {((isPrice && winner === 1) || (!isPrice && winner === 2)) ? '-' : '+'}
                                        {diffData.diff}
                                    </div>
                                    <div className={`diff-value ${
                                        (isPrice && winner === 2) || (!isPrice && winner === 1) ? 'disadvantage' : 'advantage'
                                    }`}>
                                        {((isPrice && winner === 2) || (!isPrice && winner === 1)) ? '-' : '+'}
                                        {diffData.diff}
                                    </div>
                                </div>
                            )}
                            {/* Handling Equal Difference case for completeness */}
                            {isCalculable && getNumericValue(val1) === getNumericValue(val2) && (
                                <div className="diff-row" style={{ display: 'contents' }}>
                                    <div className="spec-label diff-label">Difference</div>
                                    <div className="diff-value" style={{ gridColumn: 'span 2' }}>Equal</div>
                                </div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};


// --- Main App Component ---
const App = () => {
    const [vehicle1Id, setVehicle1Id] = useState(null);
    const [vehicle2Id, setVehicle2Id] = useState(null);
    const [comparisonData, setComparisonData] = useState(null); // To store data fetched from API
    const [loading, setLoading] = useState(false);

    // Get selected vehicle info
    const vehicle1Info = VEHICLE_LIST.find(v => v.id === vehicle1Id);
    const vehicle2Info = VEHICLE_LIST.find(v => v.id === vehicle2Id);
    
    // Prepare data for display if data is loaded
    const displayVehicle1 = comparisonData ? { name: vehicle1Info?.name, data: comparisonData.v1 } : null;
    const displayVehicle2 = comparisonData ? { name: vehicle2Info?.name, data: comparisonData.v2 } : null;

    const handleSelectChange = (e, setVehicleId) => {
        const id = parseInt(e.target.value);
        setVehicleId(id > 0 ? id : null);
        setComparisonData(null); // Reset data upon changing selection
    };

    const resetComparison = () => {
        setVehicle1Id(null);
        setVehicle2Id(null);
        setComparisonData(null);
        setLoading(false);
    };

    const isReadyToCompare = vehicle1Info && vehicle2Info;

    // Async function to start comparison
    const startComparison = useCallback(async () => {
        if (!isReadyToCompare || loading) return;

        setLoading(true);
        setComparisonData(null);

        // Make two API calls simultaneously
        const [data1, data2] = await Promise.all([
            fetchVehicleDataFromGemini(vehicle1Info.query),
            fetchVehicleDataFromGemini(vehicle2Info.query),
        ]);

        setComparisonData({ v1: data1, v2: data2 });
        setLoading(false);
    }, [vehicle1Info, vehicle2Info, isReadyToCompare, loading]);


    return (
        <div className="app-container">
            {/* Inject Custom CSS Styles */}
            <style>{AppStyles}</style>

            {/* Navigation Bar */}
            <nav className="navbar">
                <a href="#" className="navbar-brand">
                    <Icon name="Truck" size={28} color="var(--accent-blue)" />
                    TurboCompare (Real-Time Data)
                </a>
            </nav>
            
            <main className="comparison-container">
                <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--accent-blue)', marginBottom: '0.5rem', textShadow: '0 0 10px rgba(0, 224, 255, 0.5)' }}>Advanced Vehicle Comparison</h1>
                    <p style={{ color: 'var(--text-subtle)', fontSize: '1rem', fontWeight: 500 }}>Select 2 Vehicles → Compare Real-Time Price and Specifications.</p>
                </header>

                <div className="selection-area">
                    {/* Vehicle Selection Row */}
                    <div className="selection-row">
                        
                        {/* Select Vehicle 1 */}
                        <div className="selection-box">
                            <select 
                                className="select-dropdown" 
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
                            <div className="dropdown-icon"><Icon name="ChevronDown" size={20} color="var(--accent-blue)" /></div>
                        </div>

                        <div className="vs-icon" style={{ color: 'var(--text-subtle)', width: '2rem', height: '2rem', flexShrink: 0 }}>
                            <Icon name="Repeat" size={28} color="var(--text-subtle)" />
                        </div>

                        {/* Select Vehicle 2 */}
                        <div className="selection-box">
                            <select 
                                className="select-dropdown" 
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
                            <div className="dropdown-icon"><Icon name="ChevronDown" size={20} color="var(--accent-blue)" /></div>
                        </div>
                    </div>

                    {/* Compare/Reset Buttons */}
                    <div className="selection-row" style={{ gap: '1.5rem' }}>
                        
                        {(vehicle1Id !== null || vehicle2Id !== null) && (
                            <button className="reset-btn" onClick={resetComparison} disabled={loading} style={{ flex: '1 1 auto', minWidth: '120px' }}>
                                <Icon name="XCircle" size={18} color="var(--danger-color)" style={{ stroke: 'currentColor' }}/>
                                Reset
                            </button>
                        )}

                        <button 
                            className="compare-btn" 
                            onClick={startComparison} 
                            disabled={!isReadyToCompare || loading}
                            style={{ flex: '1 1 auto', minWidth: '150px' }}
                        >
                            {loading ? (
                                <Icon name="Loader" size={20} color="var(--primary-dark)" />
                            ) : (
                                <Icon name="BarChart" size={20} color="var(--primary-dark)" />
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
                    <div className="empty-state">
                        <Icon name="Search" size={48} color="var(--text-subtle)" style={{ margin: '0 auto 1rem', display: 'block' }} />
                        <h2>Ready for Real-Time Data</h2>
                        <p>Select two vehicles using the dropdowns above and press the **Compare** button for the latest information.</p>
                    </div>
                )}

            </main>

            {/* Footer */}
            <footer className="footer">
                &copy; {new Date().getFullYear()} TurboCompare Inc. | Advanced Data Analysis.
            </footer>
        </div>
    );
};

export default App;
