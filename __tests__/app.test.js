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
  describe("GET /api", () => {
    it("200: GET - responds with server ok message", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then((response) => {
          expect(response.body.message).toBe("server ok");
        });
    });
  });
  describe("GET /api/topics", () => {
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
  describe("GET /api/articles", () => {
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
              comment_count: expect.any(Number),
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
          expect(articles).toBeSorted("created_at", { descending: true });
        });
    });
  });
  describe("GET /api/articles?queries", () => {
    it("200: GET - responds with correct topic articles", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toBeInstanceOf(Array);
          expect(articles.length).toBeGreaterThan(0);

          articles.forEach((article) => {
            expect(article).toMatchObject({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: "mitch",
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            });
          });
          expect(articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
    it("200: GET - responds with a valid column sorted, descending by default", () => {
      return request(app)
        .get("/api/articles?sort_by=votes")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toBeSorted("votes", { descending: true });
        });
    });
    it("200: GET - responds with a valid column sorted in ascending order", () => {
      return request(app)
        .get("/api/articles?sort_by=author&order=asc")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toBeSorted("author", { ascending: true });
        });
    });
    it("200: GET - responds with correct articles with more than one query", () => {
      return request(app)
        .get("/api/articles?topic=mitch&sort_by=author&order=asc")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toBeSorted("author", { ascending: true });
        });
    });
    it("200: responds with correct message when passed topic with no related articles", () => {
      return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toBe("Article Not Found");
        });
    });
  });
  describe.skip("GET /api/articles/:article_id", () => {
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
          console.log(article);
          expect(article).toBeInstanceOf(Array);
          expect(article.length).toBeGreaterThan(0);
          expect(article).toEqual(testArticle);
        });
    });
  });
  describe("GET /api/articles/:article_id?comment_count", () => {
    it("200: responds with the comment count for the correct given article with votes", () => {
      return request(app)
        .get("/api/articles/1?comment_count=true")
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
          expect(article).toMatchObject({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: expect.any(String),
            votes: 100,
            comment_count: 11,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
        });
    });
    it("200: responds with the comment count for the correct given article without any votes", () => {
      return request(app)
        .get("/api/articles/1?comment_count=true")
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
          expect(article).toMatchObject({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: expect.any(String),
            votes: 100,
            comment_count: 11,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
        });
    });
  });
  describe("PATCH /api/articles/:article_id", () => {
    it("200: responds with article object correctly updated, and ignores additional key/value pairs", () => {
      const testvote = { inc_votes: 1, key: "value" };

      return request(app)
        .patch("/api/articles/1")
        .send(testvote)
        .expect(200)
        .then(({ body }) => {
          const { article } = body;
          expect(article).toMatchObject({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: expect.any(String),
            votes: 101,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
        });
    });
    it("200: responds with article object correctly updated, when passed a number to decrement the number votes", () => {
      const testvote = { inc_votes: -101 };

      return request(app)
        .patch("/api/articles/1")
        .send(testvote)
        .expect(200)
        .then(({ body }) => {
          const { article } = body;

          expect(article).toMatchObject({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: expect.any(String),
            votes: -1,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          });
        });
    });
  });
  describe("GET /api/articles/:article_id/comments", () => {
    it("200: GET - responds with an array of comments for the correct article", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(comments).toBeInstanceOf(Array);
          expect(comments.length).toBeGreaterThan(0);
          comments.forEach((comment) => {
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
    });
    it("200: GET - responds with an array of comments for the correct article, ordered by date descending", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body }) => {
          const { comments } = body;
          expect(comments).toBeSorted("created_at", { descending: true });
        });
    });
  });
  describe("POST /api/articles/:article_id/comments", () => {
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
    it("201: responds with the new correct comment added to comments and ignores any invalid properties", () => {
      const testNewComment = {
        username: "butter_bridge",
        body: "New Comment",
        location: "Unknown",
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
  describe("GET /api/users", () => {
    it("200: responds with an array of user objects", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          const { users } = body;
          expect(users).toBeInstanceOf(Array);
          expect(users.length).toBeGreaterThan(0);

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
  describe("server errors", () => {
    describe("GET /not-an-existing-path", () => {
      it("404: responds with message when sent a valid but non-existent path", () => {
        return request(app)
          .get("/not-an-existing-path")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Path Not Found");
          });
      });
    });
    describe("GET /api/articles?queries", () => {
      describe("status: 404", () => {
        it("404: responds with correct message when passed a invalid topic", () => {
          return request(app)
            .get("/api/articles?topic=not-a-topic")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe("Topic Not found");
            });
        });
      });
      describe("status: 400", () => {
        it("400: responds with correct message when passed a invalid column", () => {
          return request(app)
            .get("/api/articles?sort_by=not-a-valid-column")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("Bad Request");
            });
        });
        it("400: responds with correct message when passed a invalid order", () => {
          return request(app)
            .get("/api/articles?order_by=not-a-valid-order")
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("Bad Request");
            });
        });
      });
    });
    describe("GET /api/articles/:article_id", () => {
      it("400: respondswith correct message when sent a invalid parametric endpoint", () => {
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
            expect(body.msg).toBe("Article Not Found");
          });
      });
    });
    describe.skip("GET /api/articles/:article_id?comment_count", () => {
      describe("status: 404", () => {
        it("404: responds with correct message when passed a query", () => {
          return request(app)
            .get("/api/articles/1?comment_count=false")
            .expect(404)
            .then(({ body }) => {
              expect(body.message).toBe("Not Found");
            });
        });
      });
    });
    describe("PATCH /api/articles/:article_id", () => {
      describe("status: 404", () => {
        it("404: responds with correct message when sent a invalid parametric endpoint", () => {
          const testVotePatch = { inc_votes: 1 };

          return request(app)
            .patch("/api/articles/1000")
            .send(testVotePatch)
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe("Not Found");
            });
        });
        describe("status: 400", () => {
          it("400: responds with correct message when sent a invalid parametric endpoint", () => {
            const testVotePatch = { inc_votes: 1 };

            return request(app)
              .patch("/api/articles/four")
              .send(testVotePatch)
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).toBe("Bad Request");
              });
          });
          it("400: responds with correct message when passed an empty object", () => {
            const testVotePatch = {};

            return request(app)
              .patch("/api/articles/1")
              .send(testVotePatch)
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).toBe("Bad Request");
              });
          });

          it("400: responds with correct message when passed an object with the wrong data type", () => {
            const testVotePatch = { inc_votes: "six" };

            return request(app)
              .patch("/api/articles/1")
              .send(testVotePatch)
              .expect(400)
              .then(({ body }) => {
                expect(body.msg).toBe("Bad Request");
              });
          });
        });
      });
    });
    describe("GET /api/articles/:article_id/comments", () => {
      it("400: responds with correct message when sent a invalid parametric endpoint", () => {
        return request(app)
          .get("/api/articles/not-a-valid-article-id/comments")
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("Bad Request");
          });
      });
      it("404: responds with correct message for valid but non-existent comments", () => {
        return request(app)
          .get("/api/articles/1234/comments")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Comment Not Found");
          });
      });
      it("404: responds with correct message when sent a valid but non-existent path", () => {
        return request(app)
          .get("/api/articles/1/comets")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Path Not Found");
          });
      });
    });
    describe("POST /api/articles/:article_id/comments", () => {
      describe("status: 404", () => {
        it("404: responds with correct message when sent an invalid user", () => {
          const testNewComment = {
            username: "",
            body: "New Comment",
          };

          return request(app)
            .post("/api/articles/4/comments")
            .send(testNewComment)
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe("Author Not Found");
            });
        });
        it("404: responds with correct message for valid but non-existent article_id", () => {
          const testNewComment = {
            username: "butter_bridge",
            body: "New Comment",
          };

          return request(app)
            .post("/api/articles/4321/comments")
            .send(testNewComment)
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe("Article ID Does Not Exist");
            });
        });
      });
      describe("status: 400", () => {
        it("400: responds with correct message when sent a invalid parametric endpoint", () => {
          const testNewComment = {
            username: "butter_bridge",
            body: "New Comment",
          };

          return request(app)
            .post("/api/articles/four/comments")
            .send(testNewComment)
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("Bad Request");
            });
        });
        it("400: responds with correct message when sent an object without a comment", () => {
          const testNewComment = {
            username: "butter_bridge",
            body: "",
          };

          return request(app)
            .post("/api/articles/4/comments")
            .send(testNewComment)
            .expect(400)
            .then(({ body }) => {
              expect(body.msg).toBe("Invalid Comment Format");
            });
        });
      });
    });
  });
});
