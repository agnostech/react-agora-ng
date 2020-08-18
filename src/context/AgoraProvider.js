import React, {useState, useEffect} from "react";
import {AgoraContext} from './AgoraContext';

export const AgoraProvider = ({client, appId, rtmClient, children}) => {

    const [screenShareClient, setScreenShareClient] = useState(null);
    const [rtmChannel, setRTMChannel] = useState(null);
    const [localVideoDiv, setLocalVideoDiv] = useState('');

    return (
        <AgoraContext.Provider
            value={{
                client,
                setScreenShareClient: setScreenShareClient,
                screenShareClient,
                appId,
                rtmClient,
                rtmChannel,
                setRTMChannel,
                localVideoDiv,
                setLocalVideoDiv
            }}>
            {children}
        </AgoraContext.Provider>
    )
};

