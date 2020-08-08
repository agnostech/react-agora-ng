import {useCallback} from 'react';
import {useRTMClient} from "./useRTMClient";

export const useRTMControls = () => {

    const rtmClient = useRTMClient();

    const toggleAttendeeAudio = useCallback(async (userId) => {
        try {
            return await rtmClient.sendMessageToPeer({
                text: 'mute-audio-toggle',
                userId
            });
        } catch (error) {
            return error;
        }

    }, [rtmClient]);

    const toggleAttendeeVideo = useCallback(async (userId) => {
        try {
            return await rtmClient.sendMessageToPeer({
                text: 'mute-video-toggle',
                userId
            });
        } catch (error) {
            return error;
        }
    }, [rtmClient]);

    const removeAttendee = useCallback(async (userId) => {
        try {
            return await rtmClient.sendMessageToPeer({
                text: 'remove-attendee',
                userId
            });
        } catch (error) {
            return error;
        }
    }, [rtmClient]);

    const toggleAttendeeScreenShare = useCallback(async () => {
        try {
            return await rtmClient.sendMessageToPeer({
                text: 'toggle-screen-share',
                userId
            });
        } catch (error) {
            return error;
        }
    }, [rtmClient]);

    return {
        toggleAttendeeVideo,
        toggleAttendeeAudio,
        toggleAttendeeScreenShare,
        removeAttendee
    }

}
