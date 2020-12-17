const socket = io("/"); // Socket connects to root path
const videoGrid = document.getElementById("video-grid");

const myPeer = new Peer(undefined, {
    host: '/',
    port: '3001'
}); // Server generates the own user
const myVideo = document.createElement("video");
myVideo.muted = true; // Mute ourselves (not for others)
const peers = {};
// Stream our video to others
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    addVideoStream(myVideo, stream);

    myPeer.on("call", call => {
        call.answer(stream);
        const video = document.createElement("video");
        call.on("stream", userVideoStream => {
            addVideoStream(video, userVideoStream);
        });
    });

    socket.on("user-connected", userId => {
        connectToNewUser(userId, stream); // Send our current video stream to the new user
    });

    socket.on("user-disconnected", userId => {
        if (peers[userId]) peers[userId].close();
    })


})

myPeer.on("open", id => {
    socket.emit("join-room", ROOM_ID, 10);
});

function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
        video.play();
    }); 

    videoGrid.append(video);
}

function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream); // Calls the user we give a userId to
    const video = document.createElement("video");
    call.on("stream", userVideoStream => {
        addVideoStream(video, userVideoStream);
    }); // They send us back their video stream

    call.on("close", () => {
        video.remove(); // Remove their video after they disconnect from server
    })

    peers[userId] = call;
}