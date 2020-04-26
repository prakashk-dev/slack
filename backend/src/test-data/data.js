let users = [];
const cities = [
  { name: "Kathmandu" },
  { name: "Chitwan" },
  { name: "Pokhara" },
  { name: "Lumbini" },
  { name: "Hetauda" },
  { name: "Baglung" },
  { name: "Biratnagar" },
  { name: "Janakpur" },
  { name: "Mechi" },
  { name: "Mahakali" },
  { name: "Bhaktapur" },
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
