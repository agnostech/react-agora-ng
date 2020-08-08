import React, {useState} from "react";
import {AgoraContext} from './AgoraContext';

export const AgoraProvider = ({client, appId, children}) => {

    const [screenShareClient, setScreenShareClient] = useState(null);

    return (
        <AgoraContext.Provider value={{client, setScreenShareClient: setScreenShareClient, screenShareClient, appId}}>
            {children}
        </AgoraContext.Provider>
    )
};

