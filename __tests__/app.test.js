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
  it("200: GET - responds with an array of all the topic objects, with the correct data", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toEqual(data.topicData);
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
    it("200: GET - responds with an array of all the article objects, with the correct properties, including comment_count and ordered by date descending", () => {
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
    describe.skip("/api/articles/:article_id", () => {
      it("200: GET - responds with an array", () => {
        return request(app)
          .get("/api/articles/3")
          .expect(200)
          .then(({ body }) => {
            const { articles } = body;
            expect(articles).toMatchObject({
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
    describe("server errors", () => {
      it("404: responds with message when sent a valid but non-existent path", () => {
        return request(app)
          .get("/not-an-existsing-path")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("path not found");
          });
      });
    });
  });
});
