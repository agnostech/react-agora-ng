import {useAgoraClient} from "./useAgoraClient";
import {useCallback, useContext} from "react";
import AgoraRTC from 'agora-rtc-sdk-ng';
import {useScreenShareClient} from "./useScreenShareClient";
import {AgoraContext} from "../context/AgoraContext";
import {useRTMControls} from "./useRTMControls";
import {useRTMClient} from "./useRTMClient";

export const useCallControls = () => {

    const client = useAgoraClient();
    const rtmClient = useRTMClient();
    const [screenShareClient, setScreenShareClient] = useScreenShareClient();
    const {appId, localVideoDiv, setLocalVideoDiv} = useContext(AgoraContext);

    const {leave: leaveRTM} = useRTMControls();

    const toggleVideo = useCallback(async () => {
        const videoTrack = client.localTracks.filter(track => track.trackMediaType === "video");
        if (videoTrack.length <= 0) {
            try {
                const video = await AgoraRTC.createCameraVideoTrack();
                video.play(localVideoDiv);
                await client.publish(video);
            } catch (error) {
                console.log(error);
            }
            return;
        }
        const video = videoTrack[0];
        if (video.isPlaying) {
            video.stop();
            video.close();
            try {
                await client.unpublish(video);
            } catch (error) {
                console.log(error);
            }
        }
    }, [client, localVideoDiv])

    const toggleAudio = useCallback(async () => {
        const audioTrack = client.localTracks.filter(track => track.trackMediaType === "audio");
        if (audioTrack.length <= 0) {
            try {
                const audio = await AgoraRTC.createMicrophoneAudioTrack();
                await client.publish(audio);
            } catch (error) {
                console.log(error);
            }
            return;
        }
        const audio = audioTrack[0];
        audio.stop();
        audio.close();
        try {
            await client.unpublish(audio);
        } catch (error) {
            console.log(error);
        }
    }, [client]);


    const leaveCall = useCallback(async () => {
        try {
            if (rtmClient)
                await leaveRTM();
            const audioTrack = client.localTracks.filter(track => track.trackMediaType === "audio");
            const audio = audioTrack[0];
            audio.stop();
            audio.close();
            const videoTrack = client.localTracks.filter(track => track.trackMediaType === "video");
            const video = videoTrack[0];
            video.stop();
            video.close();
            await client.leave();
        } catch (error) {
            console.log(error);
            return error;
        }
    }, [client, rtmClient, leaveRTM]);


    const startScreenShare = useCallback(async ({channel, token}) => {
        if (!screenShareClient) {
            try {
                const screenShareClient = AgoraRTC.createClient({mode: "rtc", codec: "vp8"});
                await screenShareClient.join(appId, channel, token);

                const screenTrack = await AgoraRTC.createScreenVideoTrack({
                    encoderConfig: {
                        height: 1080,
                        width: 1920
                    }
                });
                await screenShareClient.publish(screenTrack);

                setScreenShareClient(screenShareClient);

            } catch (error) {
                console.log(error);
                return error;
            }
        }
    }, [setScreenShareClient, screenShareClient, appId]);

    const stopScreenShare = useCallback(async () => {
        try {
            if (screenShareClient) {
                const videoTrack = screenShareClient.localTracks;
                if (videoTrack.length > 0) {
                    videoTrack[0].stop();
                    videoTrack[0].close();
                }
                await screenShareClient.leave();
                setScreenShareClient(null);
            }
        } catch (error) {
            console.log(error);
            return error;
        }
    }, [screenShareClient]);

    const setLocalDivId = useCallback((id) => {
        setLocalVideoDiv(id)
    }, [setLocalVideoDiv]);

    return {
        toggleAudio,
        toggleVideo,
        leaveCall,
        startScreenShare,
        stopScreenShare,
        setLocalDivId
    };
}
