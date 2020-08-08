import {useContext} from "react";
import {AgoraContext} from '../context/AgoraContext';

export const useRTMClient = () => {
    const {rtmClient} = useContext(AgoraContext);

    return rtmClient;
}
