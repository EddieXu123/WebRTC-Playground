# WebRTC-Playground
Playground repo to test some things with WebRTC (Video chatting)

# To run:
Installations:
1) npm i express ejs socket.io // Communicates with the server
2) npm uuid // Creates the dynammic url for each chat room
3) npm i --save-dev nodemon // Nodemon runs the server everytime a change is saved (saving time)
4) npm run devStart // Runs the server

While running devStart, open another terminal in the same window
1) npm i -g peer // Globally installs peerjs library to run the peer server
2) peerjs --port 3001 // Connects the users and gives userId that can be later used
