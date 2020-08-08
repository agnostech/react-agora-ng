import {useEffect, useState, useContext} from 'react';
import {useAgoraClient} from "./useAgoraClient";
import AgoraRTC from "agora-rtc-sdk-ng";
import {AgoraContext} from "../context/AgoraContext";

export const useJoinCall = ({channel, token, userId, localVideoDiv}) => {

    const [loading, setLoading] = useState(true);
    const [localUserId, setLocalUserId] = useState(null)
    const [error, setError] = useState(null);
    const [retry, setRetry] = useState(false);
    const client = useAgoraClient()
    const {appId} = useContext(AgoraContext);

    useEffect(() => {

        async function joinCall() {
            try {
                const uid = await client.join(appId, channel, token, userId);
                setLocalUserId(uid);
                return true;
            } catch (error) {
                return error
            }
        }

        async function publishTracks() {
            try {
                const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
                await client.publish(audioTrack);
            } catch (error) {
                //TODO: Report error when audio permissions are denied
                return error;
            }

            try {
                const videoTrack = await AgoraRTC.createCameraVideoTrack();
                videoTrack.play(localVideoDiv);
                await client.publish(videoTrack);
            } catch (error) {
                //TODO: Report error when video permissions are denied
                return error;
            }
        }

        joinCall()
            .then(() => publishTracks())
            .then(() => setLoading(false))
            .catch(error => {
                setLoading(false);
                setError(error)
            });

    }, [client, appId, channel, token, userId, localVideoDiv, setLoading, setLocalUserId, setError, retry])

    const retryConnect = () => {
        setRetry(retry => !retry);
    }

    return {
        loading,
        error,
        localUserId,
        retryConnect
    };
}
