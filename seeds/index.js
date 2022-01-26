if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

const connectionURL = process.env.URL || "mongodb://localhost:27017/yelp-camp";

mongoose.connect(connectionURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  // const c = new Campground({ title: 'purple field' });
  // await c.save();
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * cities.length);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: "618ca6ce1bd87077a3891596",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      // image: 'https://images.unsplash.com/photo-1518602164578-cd0074062767?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      description:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Expedita eum aliquid amet cupiditate ea voluptates sint nemo velit iusto, distinctio quaerat, ipsam non aperiam eius quasi ratione quam! Facilis, nobis?",
      price,
      images: [
        {
          url: "https://res.cloudinary.com/dg1n29dqo/image/upload/v1636821759/YelpCamp/sijwqrjdju0psygt3w8s.jpg",
          filename: "YelpCamp/sijwqrjdju0psygt3w8s",
        },
        {
          url: "https://res.cloudinary.com/dg1n29dqo/image/upload/v1636821759/YelpCamp/wisnmbiul57pncizam59.jpg",
          filename: "YelpCamp/wisnmbiul57pncizam59",
        },
        {
          url: "https://res.cloudinary.com/dg1n29dqo/image/upload/v1636821760/YelpCamp/oofeuem1kuugzhkflnwk.jpg",
          filename: "YelpCamp/oofeuem1kuugzhkflnwk",
        },
        {
          url: "https://res.cloudinary.com/dg1n29dqo/image/upload/v1636821759/YelpCamp/wn8tlkx8s8vr5ms716ja.jpg",
          filename: "YelpCamp/wn8tlkx8s8vr5ms716ja",
        },
        {
          url: "https://res.cloudinary.com/dg1n29dqo/image/upload/v1636821759/YelpCamp/kc0i5xeuwx1rkhrj07nb.jpg",
          filename: "YelpCamp/kc0i5xeuwx1rkhrj07nb",
        },
        {
          url: "https://res.cloudinary.com/dg1n29dqo/image/upload/v1636821760/YelpCamp/nxajmt1wi5ordehlnbou.jpg",
          filename: "YelpCamp/nxajmt1wi5ordehlnbou",
        },
        {
          url: "https://res.cloudinary.com/dg1n29dqo/image/upload/v1636821763/YelpCamp/zqoqfwzzhsvomnygvi4l.png",
          filename: "YelpCamp/zqoqfwzzhsvomnygvi4l",
        },
        {
          url: "https://res.cloudinary.com/dg1n29dqo/image/upload/v1636821774/YelpCamp/sifieycmrjr4vcsfe6qt.png",
          filename: "YelpCamp/sifieycmrjr4vcsfe6qt",
        },
      ],
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
