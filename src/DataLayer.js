
import React, {createContext, useContext, useReducer} from 'react';

// * Preparing the data layer
export const DataLayerContext = createContext();

export const DataLayer = ({ initialState, reducer, children}) => (

    <DataLayerContext.Provider value={useReducer(reducer, initialState)}>
        {children}
    </DataLayerContext.Provider>
    
);

export const useDataLayerValue = () => useContext(DataLayerContext);
