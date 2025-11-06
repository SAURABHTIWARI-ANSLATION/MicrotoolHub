// src/App.jsx

import React, { useState, useEffect } from 'react';
import './index.css'; 
// Note: 'Poppins' font must be imported in your main index.html or index.css for full effect.

// --- 1. Panchang Data Lookup Table (Custom/Fixed Data) ---
const PanchangDataLookup = {
  // Data for 2025-10-24 (Fixed for Diwali Example)
  '2025-10-24': {
    displayDate: 'Fri Oct 24 2025',
    tithi: 'Amavasya', // Changed to Amavasya for Diwali
    nakshatra: 'Swati', 
    yoga: 'Ayushman',
    karan: 'Chatushpad',
    sunrise: '06:20 AM',
    sunset: '05:40 PM',
    rahu_kalam: '10:30 AM - 12:00 PM',
    abhijit_muhurat: '11:45 AM - 12:35 PM',
    festivals: [
      'Govardhan Puja (Previous Day)',
      'Lakshmi Puja (Major Festival)',
    ],
  },
  // Data for 2025-10-01 (Fixed for Prathama Example)
  '2025-10-01': {
    displayDate: 'Wed Oct 01 2025',
    tithi: 'Prathama',
    nakshatra: 'Bharani', 
    yoga: 'Shukla',
    karan: 'Gara',
    sunrise: '06:20 AM',
    sunset: '05:40 PM',
    rahu_kalam: '07:30 AM - 09:00 AM',
    abhijit_muhurat: '12:00 PM - 12:50 PM',
    festivals: [
      'Daily Puja/Vrat (General)',
      'Chandradarshan (New Moon Day)',
    ],
  },
};

// --- 2. Helper function to fetch data based on date (Enhanced Dynamic Logic) ---
const getDailyData = (dateISO) => {
    // 1. Check if the date is in the fixed Lookup Table
    if (PanchangDataLookup[dateISO]) {
        return PanchangDataLookup[dateISO];
    }
    
    // 2. Dynamic Calculation Logic for all other dates
    const dateObj = new Date(dateISO);
    const dayOfMonth = dateObj.getDate(); // 1 to 31
    const dayOfWeek = dateObj.getDay(); // 0 (Sun) to 6 (Sat)
    
    // --- Dynamic Panchang Data ---
    let data = {
        // Base timings (will be the same for all dates unless you add location logic)
        sunrise: '06:15 AM',
        sunset: '05:45 PM',
        rahu_kalam: (dayOfWeek === 1 || dayOfWeek === 6) ? '09:00 AM - 10:30 AM' : '07:30 AM - 09:00 AM',
        abhijit_muhurat: '11:45 AM - 12:35 PM',
        
        // Base Panchang details (rotate based on dayOfMonth)
        nakshatra: ['Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashirsha', 'Ardra', 'Punarvasu'][(dayOfMonth % 7)],
        yoga: ['Vishkambha', 'Priti', 'Ayushman', 'Saubhagya'][(dayOfMonth % 4)],
        karan: ['Balava', 'Kaulava', 'Gara', 'Vanija'][(dayOfMonth % 4)],
        tithi: 'Panchami', // Default Tithi
        festivals: ["Daily Puja/Vrat (General)"],
        displayDate: dateObj.toDateString(),
    };
    
    // --- Dynamic Tithi and Festival Logic (Simulating Phases) ---
    // Note: % 15 is used to simulate the 15-day Tithi cycle (Shukla/Krishna Paksha)
    const tithiCycle = dayOfMonth % 15;

    if (tithiCycle === 1) {
        data.tithi = "Prathama";
    } else if (tithiCycle === 4) {
        data.tithi = "Chaturthi";
        data.festivals.push("Sankashti Ganesha Chaturthi Vrat");
    } else if (tithiCycle === 8) {
        data.tithi = "Ashtami";
        data.festivals.push("Kalashtami Vrat");
    } else if (tithiCycle === 11) {
        data.tithi = "Ekadashi";
        data.nakshatra = "Pushya"; // Change Nakshatra for this important day
        data.festivals.push("Ekadashi Vrat (Major Fast)");
    } else if (tithiCycle === 14) {
        data.tithi = "Chaturdashi";
        data.festivals.push("Shivratri (Monthly)");
    } else if (dayOfMonth === 15) { 
        data.tithi = "Purnima (Full Moon)";
        data.festivals.push("Purnima Vrat / Satyanarayan Puja");
    } else if (dayOfMonth === 30) { 
        data.tithi = "Amavasya (New Moon)";
        data.festivals.push("Amavasya (Pitri Tarpan)");
    }

    // --- Dynamic Day of Week Vrat ---
    if (dayOfWeek === 1) { // Monday
        data.festivals.push("Somvar Vrat / Shiva Puja");
    } else if (dayOfWeek === 3) { // Wednesday
        data.festivals.push("Budhvar Vrat / Ganesha Puja");
    }

    // Filter duplicates and return
    data.festivals = [...new Set(data.festivals)];
    
    return data;
};

// ... Rest of the App component code (App = () => { ... }) follows below ...
// src/App.jsx (Remaining code: App component)

// --- 3. React App Component ---
const App = () => {
    // State for the selected date 
    const todayISO = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState(todayISO); 
    
    // State for the actual panchang data displayed
    const [panchangData, setPanchangData] = useState(getDailyData(todayISO));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // useEffect to run whenever selectedDate changes
    useEffect(() => {
        const fetchPanchangData = async () => {
            if (!selectedDate) return;

            setLoading(true);
            setError(null);
            
            try {
                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 500)); 
                
                // Use the new, dynamic Lookup Table function
                const data = getDailyData(selectedDate);
                
                setPanchangData(data);

            } catch (err) {
                console.error("Error fetching data:", err);
                setError("❌ Could not fetch data. Displaying dynamic placeholder data.");
                setPanchangData(getDailyData(selectedDate)); 
            } finally {
                setLoading(false);
            }
        };

        fetchPanchangData();
    }, [selectedDate]); 

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    // Logic to identify the major occasion for the small card
    const majorOccasionDisplay = panchangData.festivals.find(f => f.includes('Major') || f.includes('Ekadashi')) || panchangData.festivals[panchangData.festivals.length - 1] || "N/A";


    // --- JSX Rendering ---
    return (
        <div className="panchang-app">
            <header className="header">
                <div className="logo">🌌 Cosmic Panchang</div>
               
            </header>

            <div className="container">
                <h1>Indian Panchang - Date Wise Lookup</h1>
                
                <div className="controls">
                    <label htmlFor="panchangDate">Select Date:</label>
                    <input 
                        type="date" 
                        id="panchangDate"
                        value={selectedDate}
                        onChange={handleDateChange}
                    />
                </div>

                <div className="panchang-grid" id="panchangGrid">
                    
                    {/* Loading/Error State */}
                    {loading && (
                        <div className="loading-message">
                            Fetching Panchang for {selectedDate}... ⏳
                        </div>
                    )}

                    {error && (
                        <div className="loading-message error-message">
                            {error}
                        </div>
                    )}

                    {/* Show Cards only if not loading and data is available */}
                    {!loading && panchangData && (
                        <>
                            {/* 1. Tithi, Nakshatra & Yoga Card (Main Card) */}
                            <div className="card panchang-card-main">
                                <h3>Tithi, Nakshatra & Yoga</h3>
                                <div className="panchang-detail"><strong>Date:</strong> <span>{panchangData.displayDate}</span></div>
                                <div className="panchang-detail"><strong>Tithi:</strong> <span>{panchangData.tithi}</span></div>
                                <div className="panchang-detail"><strong>Nakshatra:</strong> <span>{panchangData.nakshatra}</span></div>
                                <div className="panchang-detail"><strong>Yoga:</strong> <span>{panchangData.yoga}</span></div>
                                <div className="panchang-detail"><strong>Karan:</strong> <span>{panchangData.karan}</span></div>
                            </div>

                            {/* 2. Muhurat & Timings Card */}
                            <div className="card time-card">
                                <h3>Muhurat & Timings</h3>
                                <div className="panchang-detail"><strong>Sunrise:</strong> <span>{panchangData.sunrise}</span></div>
                                <div className="panchang-detail"><strong>Sunset:</strong> <span>{panchangData.sunset}</span></div>
                                <div className="panchang-detail"><strong>Rahu Kalam:</strong> <span>{panchangData.rahu_kalam}</span></div>
                                <div className="panchang-detail"><strong>Abhijit:</strong> <span>{panchangData.abhijit_muhurat}</span></div>
                            </div>

                            {/* 3. Festivals Today Card */}
                            <div className="card festival-card">
                                <h3>Festivals Today</h3>
                                <ul id="festivalList">
                                    {panchangData.festivals.map((festival, index) => (
                                        <li 
                                            key={index}
                                            // Apply class for visual emphasis on major festivals
                                            className={festival.includes('Major') || festival.includes('Ekadashi') || festival.includes('Moon') ? 'major-festival-item' : ''}
                                        >
                                            {festival}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    )}
                    
                </div>
                
                <p style={{textAlign:'center', fontStyle: 'italic', color:'var(--text-muted)', marginTop:'20px'}}>Disclaimer: Data accuracy depends on the API and location settings. (Default: UTC/Generic)</p>

            </div>

            <footer className="footer">
                <p>&copy; 2025 Cosmic Panchang Tool. Crafted with care.</p>
                <p>Follow us on <span style={{color:'var(--accent-color)'}}>Social Media</span></p>
            </footer>
        </div>
    );
};

export default App;