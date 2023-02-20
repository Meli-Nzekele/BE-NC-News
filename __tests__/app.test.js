const request = require("supertest");
const app = require("../db/app");
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
  it("404: should return a status 404 if path is invalid", () => {
    return request(app)
      .get("/api/invalid-input")
      .expect(404)
      .then((res) => {
        expect(res.statusCode).toEqual(404);
      });
  });
  describe.skip("/api/articles", () => {
    it("200: GET - responds with an array", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toBeInstanceOf(Array);
        });
    });
    it("200: GET - responds with an array of all the topic objects, with the correct properties", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          articles.forEach((article) => {
            expect(article).toMatchObject({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(Number),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            });
          });
        });
    });
  });
});

// an articles array of article objects, each of which should have the following properties:
// author
// title
// article_id
// topic
// created_at
// votes
// article_img_url
// comment_count which is the total count of all the comments with this article_id - you should make use of queries to the database in order to achieve this.
// the articles should be sorted by date in descending order.
