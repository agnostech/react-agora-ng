# react-agora-ng
![GitHub issues](https://img.shields.io/github/issues/agnostech/react-agora-ng)  ![GitHub forks](https://img.shields.io/github/forks/agnostech/react-agora-ng) ![GitHub stars](https://img.shields.io/github/stars/agnostech/react-agora-ng) ![GitHub license](https://img.shields.io/github/license/agnostech/react-agora-ng) [![Twitter](https://img.shields.io/twitter/url?style=social&url=https%3A%2F%2Ftwitter.com%2Fagnostechhq)](https://twitter.com/intent/tweet?text=Wow:&url=https%3A%2F%2Fgithub.com%2Fagnostech%2Freact-agora-ng)

Simple and generic React hooks for Agora NG SDK - [https://agoraio-community.github.io/AgoraWebSDK-NG/en/](https://agoraio-community.github.io/AgoraWebSDK-NG/en/)

## Installation
`npm install --save @agnostech/react-agora-ng agora-rtc-sdk-ng`

or

`yarn add @agnostech/react-agora-ng agora-rtc-sdk-ng`

## TL;DR
1. Create the `AgoraRTC` client and pass it to the `AgoraProvider`
2. Register for agora events by calling `useCallEvents()`
3. Call `useJoinCall()` to start a call
4. Call `useCallControls()` to start/stop audio/video, leave the call or share your screen. 

## Usage
**1. Initialize `AgoraRTC` client and pass it to `AgoraProvider`**
```jsx
import React from 'react';  
import ReactDOM from 'react-dom';
import App from './App';

import {AgoraProvider} from '@agnostech/react-agora-ng';  
import AgoraRTC from "agora-rtc-sdk-ng"

// mode can be rtc or live. Refer Agora NG SDK docs for more info
const client = AgoraRTC.createClient({mode: "rtc", codec: "vp8"});  

const Test = () => (  
  <AgoraProvider client={client}>  
	 <App/>  
  </AgoraProvider>  
);  
  
ReactDOM.render(  
  <Test/>,  
  document.getElementById('root')  
);
```
---
**2. Register for Agora Events**

It is important and recommended to register for events before interacting with Agora to avoid missing any events. This library will emit all the events mentioned [here](https://agoraio-community.github.io/AgoraWebSDK-NG/api/en/interfaces/iagorartcclient.html).
```jsx
import React, {useEffect, useState} from  'react';
import {useCallEvents} from '@agnostech/react-agora-ng';

const App = () => {

	//register event listeners
	const {events} = useCallEvents();
	
	//array of users in this call
	const [users, setUsers] = useState([]);
	
	useEffect(() => {  
	  switch (events.event) {  
		  case "user-joined": 
			  /* add the newly joined user to the array of users. 
			     here the event object is
			     {
			     	event: 'user-joined',
				data: {
					remoteUser: {...newly connected user object}
				      }
			     }
			  */
			  setUsers(users => [...users, events.data.remoteUser]);
			  break;  
		  case "user-published":
			  console.log("user published");
			  break;  
		  case "user-unpublished": 
			  console.log("user unpublished"); 
			  break;  
		  case "user-left":
			  //remove the user from the array on leaving the call.  
			  console.log('user left');
			  setUsers(users => {  
				  const user = events.data.remoteUser;  
				  return users.filter(oldUser => oldUser.uid !== user.uid);  
			  });  
			  break;
		  // check Agora docs for all the supported events.
		}  
   }, [events, setUsers])
}

return (
	<div className="App">
		<div style={{height: '40%'}}>  
		  {users.map(user => (  
			  <div key={user.uid.toString()} style={{height: '300px', width: '300px'}} id={user.uid.toString()}>  
				  {user.videoTrack && user.videoTrack.play(user.uid.toString())}  
			  </div>  
		  ))}  
	  </div>  
	</div>
);

export default App;
```

**`useCallEvents()`**

**Returns**

 - `events` - An object having event information
	 - `event` - The event that was fired from Agora. (For eg. `user-joined`, `user-left`, etc.)
	 - `data` - This consist of event specific data object . For eg. If the `user-joined` event is received, `data` will contain a `remoteUser` key which will have the user object connected to the call.

**These events should be used to control the UI for showing all the users in the call, volume levels, control video feed for each user, etc. Check the example mentioned above.**

---
**3. Join the channel to start the call**

```jsx
import React, {useEffect, useState} from  'react';
import {useCallEvents, useJoinCall} from '@agnostech/react-agora-ng';

const App = () => {
	
	//register event listeners
	const {events} = useCallEvents();
	
	//array of users in this call
	const [users, setUsers] = useState([]);
	
	// join the call
	const {loading, error, localUserId} = useJoinCall({
		appId: 'ec49e3726eb949b99822fd0e8413e648',  
		channel: 'lmpvc',  
		userId: null,  
		token: null,  
		localVideoDiv: 'test'
	});
	
	useEffect(() => {  
	  switch (events.event) {  
		  case "user-joined":  
			  console.log("user joined");
			  setUsers(users => [...users, events.data.remoteUser]);
			  break;  
		  case "user-published":
			  console.log("user published");
			  break;  
		  case "user-unpublished": 
			  console.log("user unpublished"); 
			  break;  
		  case "user-left":  
			  console.log('user left');  
			  setUsers(users => {  
				  const user = events.data.remoteUser;  
				  return users.filter(oldUser => oldUser.uid !== user.uid);  
			  });
			  break;
		  // check Agora docs for all the supported evebts.
		}  
   }, [events, setUsers])
}

return (  
  <div className="App">
	  // this div will be used by Agora to appent the local user video
	  <div style={{height: '60%'}} id={'test'}></div>  
		 <div style={{height: '40%'}}>  
		  {users.map(user => (  
			  <div key={user.uid.toString()} style={{height: '300px', width: '300px'}} id={user.uid.toString()}>  
				  {user.videoTrack && user.videoTrack.play(user.uid.toString())}  
			  </div>  
		  ))}  
	  </div>  
  </div>
);

export default App;
```
Calling `useJoinCall()` will 

 - connect the local user to the mentioned channel
 - ask the user for video and audio permissions
 - publish audio and video tracks on the channel
 - On successful connection, it returns the `uid` of the connected local user as `localUserId`, sets `loading` as `false` or returns an `error` if there was an issue in the process.
 
 **`useJoinCall({appId, channel, token, userId, localVideoDiv})`**
 
 **Parameters:**
 
 - `appId (required)` - you can find this in your agora dashboard. This is used to communicate with your account.
 - `channel (required)` -  channel name of the call
 - `token` - required if authentication is enabled.
 - `userId` - A unique id for the current user. If sent as `null`, Agora will generate a unique `uid` for this user.
 - `localVideoDiv (required)` - The `id` string of the local div to show the local user's video feed in the UI.

**Returns**

 - `loading` - This represents the connection status. It is `true` by default. Once the connection is established, it becomes `false`. You can use this parameter to show a different UI before the connection is established.
 - `localUserId` - The `uid` of the local user connected on the call.
 - `error` - If there is any error during the call joining process, it can be checked here.
---

**4. You can call `useCallControls` to toggle audio/video, leaving a meeting or start sharing your screen**

```jsx
import React, {useEffect} from  'react';
import {useCallEvents, useJoinCall, useCallControls} from '@agnostech/react-agora-ng';

const App = () => {
	
	//register event listeners
	const {events} = useCallEvents();
	
	// join the call
	const {loading, error, localUserId} = useJoinCall({
		appId: 'ec49e3726eb949b99822fd0e8413e648',  
		channel: 'lmpvc',  
		userId: null,  
		token: null,  
		localVideoDiv: 'test'
	});
	
	//get the call controlls
	const { toggleVideo, 
			toggleAudio, 
			leave, 
			startScreenShare, 
			stopScreenShare
		  } = useCallControls();
	
	useEffect(() => {  
	  switch (events.event) {  
		  case "user-joined":  
			  console.log("user joined");
			  break;  
		  case "user-published":
			  console.log("user published");
			  break;  
		  case "user-unpublished": 
			  console.log("user unpublished"); 
			  break;  
		  case "user-left":  
			  console.log('user left');  
			  break;
		  // check Agora docs for all the supported evebts.
		}  
   }, [events])
}

return (  
  <div className="App"> 
	  //call method inside any event handler 
	 <button onClick={() => toggleVideo('test')}>toggle video</button>  
	 <button onClick={() => toggleAudio()}>toggle audio</button>  
	 <button onClick={() => leave()}>leave meeting</button>  
	 <button onClick={() => startScreenShare({  
		 appId: 'ec49e3726eb949b99822fd0e8413e648',  
		 channel: 'lmpvc',  
		 token: null,  
	 })}>start screen share</button>  
	 <button onClick={() => stopScreenShare()}>stop screen share</button>  
	 <div style={{height: '60%'}} id={'test'}></div>  
	 <div style={{height: '40%'}}>  
		  {users.map(user => (  
			  <div key={user.uid.toString()} style={{height: '300px', width: '300px'}} id={user.uid.toString()}>  
				  {user.videoTrack && user.videoTrack.play(user.uid.toString())}  
			  </div>  
		  ))}  
	 </div>  
  </div>  
);

export default App;
```
**`useCallControls()`**

**Returns**

 - `toggleVideo(localVideoDivId)` - To start/stop your video stream. You need to pass the `id` of the div to play the local user's video stream.
 - `toggleAudio()` - To start/stop your microphone audio stream.
 - `leave()` - To leave the call.
 - `startScreenShare({appId, channel, token})` - To start screen sharing.
	 -  `appId (required)` - you can find this in your agora dashboard. This is used to communicate with your account.
	 - `channel (required)` -  channel name of the call
	 - `token` - required if authentication is enabled.
 - `stopScreeShare()` - To stop screen sharing.
---

**(Optional) You can access the `AgoraRTC` client using the `useAgoraClient()` hook.**

## TODO

 - [ ] Add example project
 - [ ] Write tests
 - [ ] CI/CD
 - [ ] Efficient error handling
 - [ ] Don't publish stream in live mode if the user role is not `host`
 - [ ] Implement RTM for sending messages during the calls
