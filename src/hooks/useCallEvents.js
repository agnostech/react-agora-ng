import {useAgoraClient} from "./useAgoraClient";
import {useEffect, useState} from "react";

export const useCallEvents = () => {

    const [events, setEvents] = useState({event: '', data: null})
    const client = useAgoraClient();

    useEffect(() => {

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
                    remoteUser
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

        return () => {
            client.removeAllListeners();
        }
    }, [client, setEvents]);

    return {
        events
    };
}
