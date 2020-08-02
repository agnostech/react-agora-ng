import React, {useState} from "react";
import {AgoraContext} from './AgoraContext';

export const AgoraProvider = ({client, children}) => {

    const [screenShareClient, setScreenShareClient] = useState(null);

    return (
        <AgoraContext.Provider value={{client, setScreenShareClient: setScreenShareClient, screenShareClient}}>
            {children}
        </AgoraContext.Provider>
    )
};

