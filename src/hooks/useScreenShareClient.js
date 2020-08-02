import React, {useContext} from 'react';
import {AgoraContext} from '../context/AgoraContext';

export const useScreenShareClient = () => {
    const {setScreenShareClient, screenShareClient} = useContext(AgoraContext);

    return [screenShareClient, setScreenShareClient];
};
