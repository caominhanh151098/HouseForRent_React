import React, { createContext, useContext, useState } from 'react';

const HouseContext = createContext();

export const HouseProvider = ({ children }) => {
    const [houseSearchByCity, setHouseSearchByCity] = useState([]);

    return (
        <HouseContext.Provider value={{ houseSearchByCity, setHouseSearchByCity }}>
            {children}
        </HouseContext.Provider>
    );
};

export const useHouse = () => {
    const context = useContext(HouseContext);
    if (context === undefined) {
        throw new Error('useHouse must be used within a HouseProvider');
    }
    return context;
};