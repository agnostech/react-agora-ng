import React, {useState, useEffect} from "react";
import {AgoraContext} from './AgoraContext';
import AgoraRTM from 'agora-rtm-sdk';

export const AgoraProvider = ({client, appId, enableRTM, children}) => {

    const [screenShareClient, setScreenShareClient] = useState(null);
    const [rtmChannel, setRTMChannel] = useState(null);
    const [rtmClient, setRTMClient] = useState(null);
    const [localVideoDiv, setLocalVideoDiv] = useState('');

    useEffect(() => {
        if (enableRTM) {
            const rtmClient = AgoraRTM.createInstance(appId);
            setRTMClient(rtmClient);
        }
    }, [enableRTM, setRTMClient, appId]);

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

