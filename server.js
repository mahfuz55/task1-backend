import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import * as socketio from "socket.io";
import http from "http";
import router from "./router.js";
import dataCollection from "./datatable.js";
// import { Db } from "mongodb";

// constants
const port = process.env.PORT || 7000;
const connection_link =
  "mongodb+srv://mahfuz:Z7Av06gFJBoHmNfH@cluster0.h2lrk.mongodb.net/dataCollectionRemote?retryWrites=true&w=majority";
const pass = "Z7Av06gFJBoHmNfH";
//  app init
// const io: socketio.Server = new socketio.Server();
// io.attach(server);

//  database connetion
mongoose.connect(
  connection_link,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  },
  err => {
    if (err) {
      console.log(`db error ${err}`);
    } else {
      console.log("db-connected");
    }
  }
);
// const db = mongoose.connection;
const app = express();
// middlewares
app.use(express.json());
app.use(cors());
app.use(router);

const server = http.createServer(app);
// const io = socketio(server);
const io = new socketio.Server({
  cors: {
    origin: "*"
  }
});
io.attach(server);

let count = null;
let dataArray = [];
console.log(count + "and" + dataArray.length);
// server side socket creation
io.on("connection", socket => {
  console.log(`new user is connected`);
  count = count + 1;

  // emit for client side
  socket.emit("newMessage", {
    data: "Hello world "
  });

  // listen to client message
  socket.on("newMessage", newMessage => {
    console.log("new-message -->", newMessage);
    count--;
    dataArray.push(newMessage);
    if (dataArray.length === count && count !== 0) {
      // some database stuffs here i.e saving to database
      dataCollection.create(dataArray, (err, data) => {
        if (err) {
          console.log("error is " + err);
        } else {
          console.log(data + "added");
          // db.dataList.save(dataArray);
        }
      });
      // clearing the dataArray
      count = 1;
      dataArray = [];
      // not re-assigning count
      // emits again
      // socket.emit("newMessage", {
      //   data: "Hello world"
      // });
      //  to save time the it has been left but the same database coonection is done for task2.
    }
    console.log("done");
    console.log("data-array", dataArray);
    console.log("count", count);
  });

  socket.on("disconnect", () => {
    console.log("diconnected from user");
    // count--;
    // socket.broadcast.emit("message", "done");
  });
});

server.listen(port, () => console.log(`server is running at port ${port}`));
