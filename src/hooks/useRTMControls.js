import {useCallback, useContext} from 'react';
import {useRTMClient} from "./useRTMClient";
import {AgoraContext} from "../context/AgoraContext";

export const useRTMControls = () => {

    const rtmClient = useRTMClient();
    const {rtmChannel} = useContext(AgoraContext);

    const toggleAttendeeAudio = useCallback(async (userId) => {
        try {
            return await rtmClient.sendMessageToPeer({
                text: 'mute-audio-toggle',
            },  userId);
        } catch (error) {
            console.log(error);
            return error;
        }

    }, [rtmClient]);

    const toggleAttendeeVideo = useCallback(async (userId) => {
        try {
            return await rtmClient.sendMessageToPeer({
                text: 'mute-video-toggle',
            }, userId);
        } catch (error) {
            return error;
        }
    }, [rtmClient]);

    const removeAttendee = useCallback(async (userId) => {
        try {
            return await rtmClient.sendMessageToPeer({
                text: 'remove-attendee',
            }, userId);
        } catch (error) {
            console.log(error);
            return error;
        }
    }, [rtmClient]);

    const stopAttendeeScreenShare = useCallback(async (userId) => {
        try {
            return await rtmClient.sendMessageToPeer({
                text: 'stop-screen-share',
            }, userId);
        } catch (error) {
            return error;
        }
    }, [rtmClient]);

    const leave = useCallback(async () => {
        await rtmChannel.leave();
        await rtmClient.logout();
    }, [rtmChannel, rtmClient]);

    return {
        toggleAttendeeVideo,
        toggleAttendeeAudio,
        stopAttendeeScreenShare,
        removeAttendee,
        leave
    }

}
