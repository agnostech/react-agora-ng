import {useAgoraClient} from "./useAgoraClient";
import {useCallback} from "react";
import AgoraRTC from 'agora-rtc-sdk-ng';
import {useScreenShareClient} from "./useScreenShareClient";

export const useCallControls = () => {

    const client = useAgoraClient();
    const [screenShareClient, setScreenShareClient] = useScreenShareClient();

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
                audio.play();
                await client.publish(audio);
            } catch (error) {
                console.log(error);
            }
            return;
        }
        const audio = audioTrack[0];
        if (audio.isPlaying) {
            audio.stop();
            audio.close();
            try {
                await client.unpublish(audio);
            } catch (error) {
                console.log(error);
            }
        }
    }, [client]);


    const leaveMeeting = useCallback(async () => {
        try {
            await client.leave();
        } catch (error) {
            return error;
        }
    }, [client]);


    const startScreenShare = useCallback(async ({appId, channel, token}) => {
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
    }, [setScreenShareClient, screenShareClient]);

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
        leaveMeeting,
        startScreenShare,
        stopScreenShare
    };
}
