import {useAgoraClient} from "./useAgoraClient";
import {useEffect, useState} from "react";

export const useCallEvents = () => {

    const [events, setEvents] = useState({event: '', data: {}})
    const client = useAgoraClient();

    useEffect(() => {

        //connection state event
        client.on('connection-state-change', (currentState, previousState, reason) => {
            setEvents({
                event: 'connection-state-change', data: {
                    currentState,
                    previousState,
                    reason
                }
            });
        });

        // user events
        client.on("user-published", async (remoteUser, mediaType) => {
            await client.subscribe(remoteUser, mediaType);
            setEvents({
                event: 'user-published', data: {
                    remoteUser,
                    mediaType
                }
            });
        });

        client.on('user-unpublished', (remoteUser, mediaType) => {
            setEvents({
                event: 'user-unpublished', data: {
                    remoteUser,
                    mediaType
                }
            });
        });

        client.on('user-joined', (remoteUser) => {
            setEvents({
                event: 'user-joined',
                data: {
                    remoteUser,
                }
            });
        });

        client.on('user-left', (remoteUser, reason) => {
            setEvents({
                event: 'user-left',
                data: {
                    remoteUser,
                    reason
                }
            });
        });

        //channel media events
        client.on('channel-media-relay-event', (relayEvent) => {
            setEvents({
                event: 'channel-media-relay-event',
                data: {
                    relayEvent
                }
            });
        });

        client.on('channel-media-relay-state', (state, code) => {
            setEvents({
                event: 'channel-media-relay-state',
                data: {
                    state,
                    code
                }
            });
        });


        //crypt error event
        client.on('crypt-error', () => {
            setEvents({
                event: 'crypt-error',
                data: null
            });
        });


        //exception event
        client.on('exception', (event) => {
            setEvents({
                event: 'exception',
                data: {
                    event
                }
            })
        });


        //live stream events
        client.on('live-streaming-error', (url, error) => {
            setEvents({
                event: 'live-streaming-error',
                data: {
                    url,
                    error
                }
            })
        });

        client.on('live-streaming-warning', (url, warning) => {
            setEvents({
                event: 'live-streaming-warning',
                data: {
                    url,
                    warning
                }
            })
        });


        //media reconnect events
        client.on('media-reconnect-end', (uid) => {
            setEvents({
                event: 'media-reconnect-end',
                data: {
                    uid
                }
            })
        });

        client.on('media-reconnect-start', (uid) => {
            setEvents({
                event: 'media-reconnect-start',
                data: {
                    uid
                }
            })
        });


        //network quality event
        client.on('network-quality', (stats) => {
            setEvents({
                event: 'network-quality',
                data: {
                    stats
                }
            })
        });


        //stream events
        client.on('stream-fallback', (uid, isFallbackOrRecover) => {
            setEvents({
                event: 'stream-fallback',
                data: {
                    uid,
                    isFallbackOrRecover
                }
            })
        });

        client.on('stream-type-changed', (uid, streamType) => {
            setEvents({
                event: 'stream-type-changed',
                data: {
                    uid,
                    streamType
                }
            })
        });


        //token events
        client.on('token-privilege-did-expire', () => {
            setEvents({
                event: 'token-privilege-did-expire',
                data: null
            })
        });

        client.on('token-privilege-will-expire', () => {
            setEvents({
                event: 'token-privilege-will-expire',
                data: null
            })
        });


        //volume indicator event
        client.on('volume-indicator', (result) => {
            setEvents({
                event: 'volume-indicator',
                data: {
                    result
                }
            })
        });

        return () => {
            client.removeAllListeners();
        }
    }, [client, setEvents]);

    return {
        events
    };
}
