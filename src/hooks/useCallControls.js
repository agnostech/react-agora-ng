import {useAgoraClient} from "./useAgoraClient";
import {useCallback} from "react";
import AgoraRTC from 'agora-rtc-sdk-ng';

export const useCallControls = () => {

    const client = useAgoraClient();

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

    const leaveMeeting = async () => {
        return client.leave();
    }

    return {
        toggleAudio,
        toggleVideo,
        leaveMeeting
    };
}
