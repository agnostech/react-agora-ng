import {useAgoraClient} from "./useAgoraClient";
import {useCallback, useContext} from "react";
import AgoraRTC from 'agora-rtc-sdk-ng';
import {useScreenShareClient} from "./useScreenShareClient";
import {AgoraContext} from "../context/AgoraContext";

export const useCallControls = () => {

    const client = useAgoraClient();
    const [screenShareClient, setScreenShareClient] = useScreenShareClient();
    const {appId} = useContext(AgoraContext);

    const toggleVideo = useCallback(async (divId) => {
        const videoTrack = client.localTracks.filter(track => track.trackMediaType === "video");
        if (videoTrack.length <= 0) {
            try {
                const video = await AgoraRTC.createCameraVideoTrack();
                video.play(divId);
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
    }, [client])

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


    const leave = useCallback(async () => {
        try {
            await client.leave();
        } catch (error) {
            return error;
        }
    }, [client]);


    const startScreenShare = useCallback(async ({channel, token}) => {
        if (!screenShareClient) {
            try {
                const screenShareClient = AgoraRTC.createClient({mode: "rtc", codec: "vp8"});
                await screenShareClient.join(appId, channel, token);

                const screenTrack = await AgoraRTC.createScreenVideoTrack();
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

    return {
        toggleAudio,
        toggleVideo,
        leave,
        startScreenShare,
        stopScreenShare
    };
}
