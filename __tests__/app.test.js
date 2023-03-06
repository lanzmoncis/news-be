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
        .get("/anything/anything/123asd")
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
    it("Responds with an empty array of comments if article exist but has no comments", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({ body }) => {
          expect(body.commentsById).toEqual([]);
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

    it("Responds with an error if valid but not existing ID", () => {
      return request(app)
        .get("/api/articles/1000/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found");
        });
    });
  });
});

describe("POST/api/articles/:article_id/comments", () => {
  describe("200 Status", () => {
    it("Responds with the posted comment", () => {
      const testComment = {
        username: "butter_bridge",
        body: "test comment",
      };
      return request(app)
        .post("/api/articles/2/comments")
        .send(testComment)
        .expect(201)
        .then(({ body }) => {
          const { comment } = body;
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            author: "butter_bridge",
            body: "test comment",
            article_id: 2,
            created_at: expect.any(String),
            votes: 0,
          });
        });
    });
  });

  describe("Error Handling Test", () => {
    it("Responds with an error if given with an invalid username", () => {
      const testComment = {
        username: "butter_bridge1",
        body: "test comment",
      };
      return request(app)
        .post("/api/articles/2/comments")
        .send(testComment)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found");
        });
    });

    it("Responds with an error if given with an invalid article_id", () => {
      const testComment = {
        username: "butter_bridge",
        body: "test comment",
      };
      return request(app)
        .post("/api/articles/anything/comments")
        .send(testComment)
        .expect(400)
        .then(({ body }) => {
          const message = body.msg;
          expect(message).toBe("Bad Request");
        });
    });

    it("Responds with an error if given with a valid ID but non-existent", () => {
      const testComment = {
        username: "butter_bridge",
        body: "test comment",
      };
      return request(app)
        .post("/api/articles/1000/comments")
        .send(testComment)
        .expect(404)
        .then(({ body }) => {
          const message = body.msg;
          expect(message).toBe("Not Found");
        });
    });
    it("Responds with an error if send if missing a required fields", () => {
      const testComment = {
        username: "butter_bridge",
      };
      return request(app)
        .post("/api/articles/1/comments")
        .send(testComment)
        .expect(400)
        .then(({ body }) => {
          const message = body.msg;
          expect(message).toBe("Bad Request");
        });
    });
  });
});

describe("PATCH/api/articles/:article_id", () => {
  describe("200 Status", () => {
    it("Responds with an updated article", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: -99 })
        .expect(200)
        .then(({ body }) => {
          const article = body.result;
          expect(article.article_id).toBe(1);
          expect(article.votes).toBe(1);
        });
    });
  });

  describe("Error Handling Test", () => {
    it("Responds with an error if given a not valid ID", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: "anything" })
        .expect(400)
        .then(({ body }) => {
          const message = body.msg;
          expect(message).toBe("Bad Request");
        });
    });

    it("Responds with an error when given with non-existent article_id", () => {
      return request(app)
        .patch("/api/articles/1000")
        .send({ inc_votes: 1 })
        .expect(404)
        .then(({ body }) => {
          const message = body.msg;
          expect(message).toBe("Not Found");
        });
    });

    it("Responds with an error if missing a required fields", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({})
        .expect(400)
        .then(({ body }) => {
          const message = body.msg;
          expect(message).toBe("Bad Request");
        });
    });
  });
});

describe("GET/api/users", () => {
  it("Responds with an array of users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const users = body.users;
        expect(users).toBeInstanceOf(Array);
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe("DELETE/api/comments/:comment_id", () => {
  describe("204 Status", () => {
    it("Responds with an empty object if successfully deleted a comment", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204)
        .then(({ body }) => {
          expect(body).toEqual({});
        });
    });
  });

  describe("Error Handling Test", () => {
    it("Responds with an error if given a not valid comment_id", () => {
      return request(app)
        .delete("/api/comments/asdfesd")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Bad Request");
        });
    });

    it("Responds with an error if given a valid but non-existent comment_id", () => {
      return request(app)
        .delete("/api/comments/10000")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Not Found");
        });
    });

    it("Responds with an error if path is not found", () => {
      return request(app)
        .delete("/anything/anything/123asd")
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

// QUERY TESTS
describe("GET/api/articles", () => {
  describe("200 Status", () => {
    it("Responds with an array with a query of topic", () => {
      return request(app)
        .get("/api/articles?topic=cats")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toBeInstanceOf(Array);
          expect(articles.length).toBeGreaterThan(0);
          expect(
            articles.every(
              (article, i) => i === 0 || article.topic >= articles[i - 1].topic
            )
          ).toBe(true);
        });
    });

    it("Responds with an array with a query of sort_by ", () => {
      return request(app)
        .get("/api/articles?sort_by=title")
        .expect(200)
        .then(({ body }) => {
          console.log(body);
        });
    });

    it("Responds with an array with a query of order", () => {
      return request(app)
        .get("/api/articles?order=asc")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toBeInstanceOf(Array);
          expect(articles.length).toBeGreaterThan(0);
          expect(
            articles.every(
              (article, i) =>
                i === 0 || article.created_at <= articles[i - 1].created_at
            )
          ).toBe(false);
        });
    });
  });

  describe("Error Handling Test", () => {
    it("Responds with an error if given with an invalid topic", () => {
      return request(app)
        .get("/api/articles?topic=anything")
        .expect(404)
        .then(({ body }) => {
          const message = body.msg;
          expect(message).toBe("Not Found");
        });
    });

    it("Responds with an error if given with an invalid sort_by query", () => {
      return request(app)
        .get("/api/articles?sort_by=invalid")
        .expect(400)
        .then(({ body }) => {
          const message = body.msg;
          expect(message).toBe("Bad Request");
        });
    });

    it("Responds with an error if given with an invalid order query", () => {
      return request(app)
        .get("/api/articles?order=invalid")
        .expect(400)
        .then(({ body }) => {
          const message = body.msg;
          expect(message).toBe("Bad Request");
        });
    });
  });
});

// Comment Count Feature
describe("GET/api/articles/:article_id", () => {
  describe("200 Status", () => {
    it("Responds with an array with the corresponding comment counts", () => {
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
            comment_count: expect.any(String),
          });
        });
    });
  });
});
