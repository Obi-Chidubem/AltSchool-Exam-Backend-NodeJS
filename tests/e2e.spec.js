import bcrypt from "bcrypt";
import request from "supertest";
import { connect } from "../src/database/databaseConnection.js";
import app from "../src/app.js";

const TEST_DB = "mongodb://localhost:27017/AltBlog";

describe("E2E tests", () => {
  let mongodb;

  const clearDB = async () => {
    const collections = await mongodb.connection.db.collections();
    for (let collection of collections) {
      await collection.deleteMany();
    }
  };

  beforeAll(async () => {
    mongodb = await connect(TEST_DB);
  });

  beforeEach(async () => {
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await mongodb.connection.close();
  });

  it("Should not be able to login", async () => {
    await clearDB();
    const res = await request(app).post("/auth/login").send({
      email: "testemail@gmail.com",
      password: "password",
    });
    console.log(res.body);
    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toEqual("User not found");
  });
  it("Should be able to register", async () => {
    await clearDB();
    const res = await request(app).post("/auth/signup").send({
      firstname: "RandomName",
      lastname: "AnotherRandomName",
      email: "testemail1@blog.com",
      password: "testpassword",
    });
    console.log(res.body);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual("User created successfully");
    expect(res.body.data.user).toHaveProperty("_id");
    expect(res.body.data.user.firstname).toEqual("RandomName");
    expect(res.body.data).toHaveProperty("user");
  });
  it("Should not be able to register", async () => {
    const res = await request(app).post("/auth/signup").send({
      firstname: "RandomName",
      lastname: "AnotherRandomName",
      email: "testemail1@blog.com",
      password: "testpassword",
    });
    console.log(res.body);
    expect(res.body.message).toEqual("User already exists.");
    expect(res.statusCode).toEqual(404);
  });
  it("Should be able to login", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "testemail1@blog.com",
      password: "testpassword",
    });
    console.log(res.body);
    expect(res.body.message).toEqual("Login Successful");
    expect(res.body.data).toHaveProperty("accessToken");
  });
});
