import { GroupModel } from "../models";
const rooms = [
  {
    name: "Kathmandu",
    image: "/api/static/images/kathmandu.png",
    timeStamp: new Date(),
    users: [],
  },
  {
    name: "Chitwan",
    image: "/api/static/images/kathmandu.png",
    timeStamp: new Date(),
    users: [],
  },
  {
    name: "Pokhara",
    image: "/api/static/images/kathmandu.png",
    timeStamp: new Date(),
    users: [],
  },
  {
    name: "Lumbini",
    image: "/api/static/images/kathmandu.png",
    timeStamp: new Date(),
    users: [],
  },
  {
    name: "Hetauda",
    image: "/api/static/images/kathmandu.png",
    timeStamp: new Date(),
    users: [],
  },
  {
    name: "Baglung",
    image: "/api/static/images/kathmandu.png",
    timeStamp: new Date(),
    users: [],
  },
  {
    name: "Biratnagar",
    image: "/api/static/images/kathmandu.png",
    timeStamp: new Date(),
    users: [],
  },
  {
    name: "Janakpur",
    image: "/api/static/images/kathmandu.png",
    timeStamp: new Date(),
    users: [],
  },
  {
    name: "Mechi",
    image: "/api/static/images/kathmandu.png",
    timeStamp: new Date(),
    users: [],
  },
  {
    name: "Mahakali",
    image: "/api/static/images/kathmandu.png",
    timeStamp: new Date(),
    users: [],
  },
  {
    name: "Bhaktapur",
    image: "/api/static/images/kathmandu.png",
    timeStamp: new Date(),
    users: [],
  },
];

async function seedData() {
  const room = await GroupModel.findOne({ name: rooms[0].name }).exec();

  const insertRoomData = async () => {
    let msg;
    if (room) {
      msg = "Room data already exists.";
    } else {
      // push some user ids to the dummy rooms data
      GroupModel.insertMany(rooms, (err, rooms) => {
        if (err) msg = err.message;
        msg = "Room data successfully inserted.";
      });
    }
    return { msg };
  };

  let result;

  try {
    result = await insertRoomData();
    return msg;
  } catch (err) {
    console.error("Error inserting data into the database", err.message);
    return { error: err.message };
  }
}

async function unSeedData() {
  try {
    await GroupModel.deleteMany({});
    return { msg: "Successfully deleted all the documents." };
  } catch (e) {
    return { error: e.message };
  }
}

export { seedData, unSeedData };
