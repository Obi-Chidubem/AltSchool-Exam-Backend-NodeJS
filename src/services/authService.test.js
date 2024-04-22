const { authService } = require("./auth.service");


const mockRequest = ()=>{
    
}

describe("It returns a req.user", () => {
  test("it should login", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "testemail1@blog.com",
      password: "testpassword",
    });
    expect(res.body.message).toEqual("Login Successful");
    expect(res.body.data).toHaveProperty("accessToken");
  });
  test('It should return a req.user', async()=>{

  })
});
