require('dotenv').config();
const express = require('express');
const cors = require('cors');
const socketIO = require('socket.io');
const { Server } = require('socket.io')
const UserRoute = require('./app/routes/Users');
const BranchRoute = require('./app/routes/Branch');
const HistoryRoute = require('./app/routes/History');
const SensorRoute = require('./app/routes/Sensor');
const AuthRoute = require('./app/routes/Auth');



const app = express();
const server = require('http').Server(app);
const io = new Server(server)

//bila dibutuhkan folder public untuk mengecek
// app.use(express.static("public"));
app.use(cors());
app.use(express.json());

app.use(AuthRoute)
app.use(UserRoute)
app.use(BranchRoute)
app.use(HistoryRoute)
app.use(SensorRoute)

io.on('connection', socket => {
    console.log('a user connected');

});

//join  with name and branch_id
socket.on('joinBranch', ({ name, branch_id }) => {
    const user = userJoin(socket.id, name, branch_id);

    console.log(user);

    socket.join(user.branch_id);

    const branchUsers = user.branch_id;

    io.to('user.branch_id').emit('message', "Selamat Datang di " + user.branch_id);

    socket.broadcast
    .to(user.branch_id)
    .emit('message', user.name + ' has joined the chat');

    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if(user){
            io.to(user.branch_id).emit(
                'message',
                user.name + ' has left the chat'
            );
        }
    });
});

socket.emit('message', 'Welcome to ChatCord!');

server.listen(3000, () => {
    console.log('Server on port 3000');
})
