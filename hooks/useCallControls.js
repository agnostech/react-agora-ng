import {useAgoraClient} from "./useAgoraClient";
import {useCallback} from "react";

export const useCallControls = () => {

    const client = useAgoraClient();

    const toggleVideo = useCallback((divId) => {
        const videoTrack = client.localTracks.filter(track => track.trackMediaType === "video");
        if (videoTrack.length <= 0) {
            return;
        }
        const video = videoTrack[0];
        if (video.isPlaying) {
            video.stop()
        } else video.play(divId);
    }, [client.localTracks])

    const toggleAudio = useCallback(() => {
        const audioTrack = client.localTracks.filter(track => track.trackMediaType === "audio");
        if (audioTrack.length <= 0) {
            return;
        }
        const video = audioTrack[0];
        if (video.isPlaying) {
            video.stop()
        } else video.play();
    }, [client.localTracks]);

    const leaveMeeting = async () => {
        return client.leave();
    }

    return {
        toggleAudio,
        toggleVideo,
        leaveMeeting
    };
}
