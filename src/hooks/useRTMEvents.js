import {useState, useEffect, useContext} from 'react';
import {AgoraContext} from '../context/AgoraContext';
import {useCallControls} from "./useCallControls";

export const useRTMEvents = () => {

    const [events, setEvent] = useState({event: '', data: {}});
    const {rtmChannel, rtmClient} = useContext(AgoraContext);
    const {toggleVideo, toggleAudio, stopScreenShare, leaveCall} = useCallControls()

    useEffect(() => {

        if (rtmChannel) {
            rtmChannel.on('ChannelMessage', function (message, memberId) {
                setEvent({
                    event: 'ChannelMessage',
                    data: {
                        message,
                        memberId
                    }
                });
            });

            rtmChannel.on('MemberJoined', memberId => {
                setEvent({
                    event: 'MemberJoined',
                    data: {
                        memberId
                    }
                });
            });

            rtmChannel.on('MemberLeft', memberId => {
                setEvent({
                    event: 'MemberLeft',
                    data: {
                        memberId
                    }
                });
            });

            rtmChannel.on('AttributesUpdated', attributes => {
                setEvent({
                    event: 'AttributesUpdated',
                    data: {
                        attributes
                    }
                });
            });

            rtmChannel.on('MemberCountUpdated', memberCount => {
                setEvent({
                    event: 'MemberCountUpdated',
                    data: {
                        memberCount
                    }
                });
            });
        }

        if (rtmClient) {
            rtmClient.on('MessageFromPeer', (message, peerId) => {
                switch (message.text) {
                    case 'mute-audio-toggle':
                        toggleAudio();
                        break;
                    case 'mute-video-toggle':
                        toggleVideo();
                        break;
                    case 'remove-attendee':
                        leaveCall();
                        break;
                    case 'stop-screen-share':
                        stopScreenShare();
                        break;
                    default:
                        setEvent({
                            event: 'MessageFromPeer',
                            data: {
                                message,
                                peerId
                            }
                        });
                }
            });

            rtmClient.on('ConnectionStateChanged', (newState, reason) => {
                setEvent({
                    event: 'ConnectionStateChanged',
                    data: {
                        newState,
                        reason
                    }
                })
            });

            rtmClient.on('PeersOnlineStatusChanged', (status) => {
                setEvent({
                    event: 'PeersOnlineStatusChanged',
                    data: {
                        status
                    }
                })
            });

            rtmClient.on('TokenExpired', () => {
                setEvent({
                    event: 'TokenExpired',
                    data: null
                })
            });
        }

        return () => {
            if (rtmChannel)
                rtmChannel.removeAllListeners();

            if (rtmClient)
                rtmClient.removeAllListeners();
        }

    }, [setEvent, rtmClient, rtmChannel, toggleAudio, toggleVideo, leaveCall, stopScreenShare]);

    return {
        events
    }
}
