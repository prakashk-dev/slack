let users = [];
const cities = [
  {
    name: "Kathmandu",
    image: "/api/static/images/kathmandu.png",
    timeStamp: new Date(),
  },
  {
    name: "Chitwan",
    image: "/api/static/images/kathmandu.png",
    timeStamp: new Date(),
  },
  {
    name: "Pokhara",
    image: "/api/static/images/kathmandu.png",
    timeStamp: new Date(),
  },
  {
    name: "Lumbini",
    image: "/api/static/images/kathmandu.png",
    timeStamp: new Date(),
  },
  {
    name: "Hetauda",
    image: "/api/static/images/kathmandu.png",
    timeStamp: new Date(),
  },
  {
    name: "Baglung",
    image: "/api/static/images/kathmandu.png",
    timeStamp: new Date(),
  },
  {
    name: "Biratnagar",
    image: "/api/static/images/kathmandu.png",
    timeStamp: new Date(),
  },
  {
    name: "Janakpur",
    image: "/api/static/images/kathmandu.png",
    timeStamp: new Date(),
  },
  {
    name: "Mechi",
    image: "/api/static/images/kathmandu.png",
    timeStamp: new Date(),
  },
  {
    name: "Mahakali",
    image: "/api/static/images/kathmandu.png",
    timeStamp: new Date(),
  },
  {
    name: "Bhaktapur",
    image: "/api/static/images/kathmandu.png",
    timeStamp: new Date(),
  },
];

for (let i = 0; i < 50; i++) {
  let j =
    i > 40 ? i - 41 : i > 30 ? i - 31 : i > 20 ? i - 21 : i > 10 ? i - 11 : i;
  users.push({
    username: `user${i + 1}`,
    email: `user${i + 1}@email.com`,
    password: "bhetghat",
    gender: i % 2 === 0 ? "m" : i % 3 === 0 ? "f" : "na",
    ageGroup: i % 4 === 0 ? "4" : i % 3 === 0 ? "3" : i % 2 === 0 ? "2" : "1",
    location: {
      country: "Nepal",
      city: cities[j].name,
    },
  });
}

export { users, cities };
