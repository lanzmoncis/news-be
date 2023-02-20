const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");

const data = require("../db/data/test-data/index");

afterAll(() => {
  db.end();
});

beforeEach(() => {
  return seed(data);
});

describe("200: GET/api/topics", () => {
  it("Responds with an array of objects with the key slug and description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toBeInstanceOf(Array);
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});
