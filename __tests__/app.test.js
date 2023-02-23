const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const toBeSorted = require("jest-sorted");
const data = require("../db/data/test-data/index");

afterAll(() => {
  db.end();
});

beforeEach(() => {
  return seed(data);
});

describe("GET/api/topics", () => {
  describe("200 Status", () => {
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
  describe("Error Handling Test", () => {
    it("Responds with an error if path is not found", () => {
      return request(app)
        .get("/api/anything")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Path not found");
        });
    });
  });
});

describe("GET/api/articles", () => {
  describe("200 Status", () => {
    it("Responds with an array from the articles data", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toBeInstanceOf(Array);
          expect(articles.length).toBe(12);
          articles.forEach((article) => {
            expect(article).toMatchObject({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(String),
            });
          });
        });
    });

    it("Array should be sorted in a descending order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const articles = body.articles;
          articles.map((article) => article.created_at);
          expect(articles).toBeSorted({ descending: true });
        });
    });
  });
  describe("Error Handling Test", () => {
    it("Responds with an error if path is not found", () => {
      return request(app)
        .get("/api/anything")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Path not found");
        });
    });
  });
});

describe("GET/api/articles/:article_id", () => {
  describe("200 Status", () => {
    it("Responds with an object with the particular article_id", () => {
      return request(app)
        .get("/api/articles/2")
        .expect(200)
        .then(({ body }) => {
          const { articleById } = body;
          expect(articleById).toBeInstanceOf(Object);
          expect(articleById).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
          });
        });
    });
  });

  describe("Error Handling Test", () => {
    it("Responds with an error 404 ID not found", () => {
      return request(app)
        .get("/api/articles/100")
        .expect(404)
        .then(({ body }) => {
          const message = body.msg;
          expect(message).toBe("Not Found");
        });
    });

    it("Responds with an error 400 if given with an invalid ID", () => {
      return request(app)
        .get("/api/articles/anything")
        .expect(400)
        .then(({ body }) => {
          const message = body.msg;
          expect(message).toBe("Bad Request");
        });
    });

    it("Responds with an error if path is not found", () => {
      return request(app)
        .get("/anything")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Path not found");
        });
    });
  });
});

describe("GET/api/articles/:article_id/comments", () => {
  describe("200 Status", () => {
    it("Responds with the relative comments from the given article_id", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          const { commentsById } = body;
          expect(commentsById).toBeInstanceOf(Array);
          commentsById.forEach((comment) => {
            expect(comment).toMatchObject({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              article_id: expect.any(Number),
            });
          });
        });
    });
  });

  describe("Error Handling Test", () => {
    it("Responds with an error given with a valid id but have no comments", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(404)
        .then(({ body }) => {
          const message = body.msg;
          expect(message).toBe("Not Found");
        });
    });

    it("Responds with an error if given with an invalid article_id", () => {
      return request(app)
        .get("/api/articles/anything/comments")
        .expect(400)
        .then(({ body }) => {
          const message = body.msg;
          expect(message).toBe("Bad Request");
        });
    });

    it("Responds with an error if path is not found", () => {
      return request(app)
        .get("/articles/anything/commentst")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Path not found");
        });
    });
  });
});

describe("Error Endpoint not found", () => {
  it("Responds with an error if path is not found", () => {
    return request(app)
      .get("/anything")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
});
