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
describe("app", () => {
  describe("/api", () => {
    it("200: GET - responds with server ok message", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then((response) => {
          expect(response.body.message).toBe("server ok");
        });
    });
  });
  describe("/api/topics", () => {
    it("200: GET - responds with an array", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          const { topics } = body;
          expect(topics).toBeInstanceOf(Array);
        });
    });
    it("200: GET - responds with an array of all the topic objects, with the correct properties", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          const { topics } = body;
          topics.forEach((topic) => {
            expect(topic).toMatchObject({
              description: expect.any(String),
              slug: expect.any(String),
            });
          });
        });
    });
  });
  describe("/api/articles", () => {
    it("200: GET - responds with an array", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toBeInstanceOf(Array);
          expect(articles.length).toBeGreaterThan(0);
        });
    });
    it("200: GET - responds with an array of all the article objects, with the correct properties, including comment_count", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          articles.forEach((article) => {
            expect(article).toMatchObject({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(String),
            });
          });
        });
    });
    it("200: GET - responds with an array of all the article objects, ordered by date descending", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toBeSorted("created_at");
        });
    });
  });
  describe("/api/articles/:article_id", () => {
    it("200: GET - responds with the requested article data", () => {
      const testArticle = [
        {
          article_id: 3,
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          created_at: "2020-11-03T09:12:00.000Z",
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        },
      ];

      return request(app)
        .get("/api/articles/3")
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
          expect(article).toBeInstanceOf(Array);
          expect(article.length).toBeGreaterThan(0);
          expect(article).toEqual(testArticle);
        });
    });
  });
  describe.skip("/api/articles/:article_id/comments", () => {
    it("201: responds with a single new comment object with the correct properties", () => {
      const testNewComment = {
        username: "butter_bridge",
        body: "New Comment",
      };

      return request(app)
        .post("/api/articles/4/comments")
        .send(testNewComment)
        .expect(201)
        .then(({ body }) => {
          const { comment } = body;
          expect(comment.length).toBeGreaterThan(0);
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            body: expect.any(String),
            votes: expect.any(Number),
            author: expect.any(String),
            article_id: expect.any(Number),
            created_at: expect.any(String),
          });
        });
    });
    it("201: responds with the new correct comment added to comments", () => {
      const testNewComment = {
        username: "butter_bridge",
        body: "New Comment",
      };

      return request(app)
        .post("/api/articles/4/comments")
        .send(testNewComment)
        .expect(201)
        .then(({ body }) => {
          const { comment } = body;
          expect(comment).toEqual({
            comment_id: 19,
            body: "New Comment",
            votes: 0,
            author: "butter_bridge",
            article_id: 4,
            created_at: expect.any(String),
          });
        });
    });
  });

  describe("server errors", () => {
    describe("404: /not-an-existing-path", () => {
      it("404: responds with message when sent a valid but non-existent path", () => {
        return request(app)
          .get("/not-an-existing-path")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("path not found");
          });
      });
    });
    describe("/api/articles/:articles", () => {
      it("400: responds with message when sent a invalid parametric endpoint", () => {
        return request(app)
          .get("/api/articles/not-a-valid-article-id")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad Request");
          });
      });
      it("404: responds with correct message for a valid but non-existent article", () => {
        return request(app)
          .get("/api/articles/1000")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Not Found");
          });
      });
    });
  });
  describe.skip("/api/articles/:article_id/comments", () => {
    it("404: responds with the correct message when sent an invalid user", () => {
      const testNewComment = {
        username: "Not-A-User",
        body: "New Comment",
      };

      return request(app)
        .post("/api/articles/4/comments")
        .send(testNewComment)
        .expect(404)
        .then(({ body }) => {
          const { comment } = body;
          expect(comment).toBe("User Does Not Exist");
        });
    });
  });
});
