import {useEffect, useState, useContext, useCallback} from 'react';
import {useAgoraClient} from "./useAgoraClient";
import AgoraRTC from "agora-rtc-sdk-ng";
import {AgoraContext} from "../context/AgoraContext";

export const useJoinCall = ({channel, token, userId, localVideoDiv, isHost, lazy}) => {

    const [loading, setLoading] = useState(true);
    const [localUserId, setLocalUserId] = useState(null)
    const [error, setError] = useState(null);
    const [retry, setRetry] = useState(false);
    const client = useAgoraClient()
    const {appId} = useContext(AgoraContext);

    const joinCall = useCallback(async () => {
        try {
            client.setClientRole(isHost ? 'host' : 'audience');
            const uid = await client.join(appId, channel, token, userId);
            setLocalUserId(uid);
            return true;
        } catch (error) {
            return error
        }
    }, [client, appId, channel, token, userId, isHost, setLocalUserId]);

    const publishTracks = useCallback(async () => {
            try {
                if (isHost) {
                    const audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
                    await client.publish(audioTrack);
                }
            } catch (error) {
                //TODO: Report error when audio permissions are denied
                return error;
            }

            try {
                const videoTrack = await AgoraRTC.createCameraVideoTrack();
                videoTrack.play(localVideoDiv);
                if (isHost) {
                    await client.publish(videoTrack);
                }
            } catch (error) {
                //TODO: Report error when video permissions are denied
                return error;
            }
    }, [isHost, client]);

    const startCallAndStream = useCallback(() => {
        joinCall()
            .then(() => publishTracks())
            .then(() => setLoading(false))
            .catch(error => {
                setLoading(false);
                setError(error)
            });
    }, [joinCall, publishTracks, setLoading, setError]);

    useEffect(() => {
        if (!lazy) {
            joinCall()
                .then(() => publishTracks())
                .then(() => setLoading(false))
                .catch(error => {
                    setLoading(false);
                    setError(error)
                });
        }

    }, [joinCall, publishTracks, setLoading, setError, lazy]);

    const retryConnect = () => {
        setRetry(retry => !retry);
    }

    return {
        loading,
        error,
        localUserId,
        retryConnect,
        startCallAndStream
    };
}
