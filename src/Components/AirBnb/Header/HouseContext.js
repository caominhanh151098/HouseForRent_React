import React, { createContext, useContext, useState } from 'react';

export const HouseContext = createContext();

export const HouseProvider = ({ children }) => {
    const [houseSearchByCity, setHouseSearchByCity] = useState([]);
    const [comfortableSelected, setComfortableSelected] = useState(null);
    const [houseFilterByComfortable, setHouseFilterByComfortable] = useState([]);
    const [loadingSearchByCity, setLoadingSearchByCity] = useState(false)

    return (
        <HouseContext.Provider value={{ 
            houseSearchByCity, 
            setHouseSearchByCity,
            comfortableSelected,
            setComfortableSelected,
            houseFilterByComfortable, 
            setHouseFilterByComfortable,
            loadingSearchByCity,
            setLoadingSearchByCity }}>
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