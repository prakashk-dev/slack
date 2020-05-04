import { UserModel, GroupModel } from "../models";
const chalk = require("chalk");

let users = [];
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

for (let i = 0; i < 50; i++) {
  let j = Math.floor(Math.random() * 10 + 1);
  users.push({
    username: `user${i + 1}`,
    email: `user${i + 1}@bhetghat.com`,
    password: "bhetghat",
    gender: i % 2 === 0 ? "male" : i % 3 === 0 ? "female" : "na",
    ageGroup: i % 4 === 0 ? "4" : i % 3 === 0 ? "3" : i % 2 === 0 ? "2" : "1",
    location: {
      country: "Nepal",
      city: rooms[j].name,
    },
    friends: [],
  });
}

const fiveRandomUser = (users, index) => {
  const top = users.length - 2 - index;
  const startIndex = top > 4 ? top : users.length - 1;
  const lastIndex = startIndex > 9 ? startIndex - 5 : startIndex + 5;
  let friends = [];

  for (let i = startIndex; i > lastIndex; i--) {
    friends.push(users[i]._id);
  }
  return friends;
};

async function addFriends(query) {
  const users = await query.exec();
  let msg = "";
  try {
    for (let i = 0; i < users.length; i++) {
      const friends = fiveRandomUser(users, i);
      await UserModel.findByIdAndUpdate(
        users[i]["_id"],
        { friends },
        { multi: true }
      ).exec();
    }
    msg = "Successfully inserted friends in users.";
  } catch (e) {
    msg = e.message;
  }

  return { msg };
}

async function seedData() {
  const userQuery = UserModel.find({}, "username");
  const user = await userQuery.exec();
  const room = await GroupModel.findOne({ name: rooms[0].name }).exec();

  const insertUserData = async () => {
    let msg, friends;
    if (user.length) {
      msg = "User data already inserted.";
    } else {
      await UserModel.insertMany(users);
      friends = await addFriends(userQuery);
      msg = "User data successfully inserted.";
    }
    return { msg, friends };
  };

  const insertRoomData = async () => {
    let msg;
    if (room) {
      msg = "Room data already exists.";
    } else {
      // push some user ids to the dummy rooms data
      const user = await userQuery.exec();
      rooms.forEach((room, index) => {
        for (let i = 0; i < user.length; i++) {
          if (i % index === 0) {
            room.users.push(user[i]._id);
          }
        }
      });
      rooms.forEach((group) => {
        const groupModel = new GroupModel(group);
        groupModel.save(group);
      });

      msg = "Room data successfully inserted.";
    }
    return { msg };
  };

  let msg = [];

  try {
    let result = await insertUserData();
    msg.push(result);
    result = await insertRoomData();
    msg.push(result);
    return msg;
  } catch (err) {
    console.error("Error inserting data into the database", err.message);
    return { error: err.message };
  }
}

async function unSeedData() {
  try {
    await UserModel.deleteMany({});
    await GroupModel.deleteMany({});
    return { msg: "Successfully deleted all the documents." };
  } catch (e) {
    return { error: e.message };
  }
}

export { seedData, unSeedData };
