
import React, {createContext, useContext, useReducer} from 'react';

// * Preparing the data layer
export const DataLayerContext = createContext();

export const DataLayer = ({ initialState, reducer, children}) => (

    <DataLayerContext.Provider value={useReducer(reducer, initialState)}>

        {/* console.log("initialState", initialState) */}
        {/* console.log("children", children) */}
        {children}
    </DataLayerContext.Provider>
    
);

export const useDataLayerValue = () => useContext(DataLayerContext);
