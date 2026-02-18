const request = require("supertest");
const path = require("path");
require("dotenv").config({ path: path.resolve(process.cwd(), ".env.test") });

const app = require("../src/app");
const { prisma, cleanDb } = require("./helpers/testDb");

describe("Posts integration", () => {
  beforeEach(async () => {
    await cleanDb();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("GET /api/posts returns [] when empty", async () => {
    const res = await request(app).get("/api/posts").expect(200);
    expect(res.body).toEqual({
      meta: {
        page: 1,
        pageSize: 10,
        totalItems: 0,
        totalPages: 1
      },
      posts: []
    });
  });

});