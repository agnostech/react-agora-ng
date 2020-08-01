import React from "react";
import AgoraContext from './AgoraContext';

export const AgoraProvider = ({client, children}) => (
    <AgoraContext.Provider value={{client}}>
        {children}
    </AgoraContext.Provider>
);

