# NC-News API

### Hosted Link: https://nc-backend.onrender.com/api/articles/

## Description

The NC-News backend API is a RESTful API that serves as the backend for the Nc News web application. It is built using Node.js and Express.js and uses PostgreSQL as its database. The API allows users to interact with the application by performing CRUD (Create, Read, Update, Delete) operations on articles, comments, and users.

## Prerequisite

Install Postman or Insomnia you can refer to this docs for installation

Postman: https://www.postman.com/downloads/

Insomnia: https://docs.insomnia.rest

## Usage

• Browse articles using Postman or Insomnia by querying this endpoint:

https://nc-backend.onrender.com/api/articles/

• Sort articles by votes, author, title or dates by querying this endpoint:

https://nc-backend.onrender.com/api/articles?sort_by=

• Change order to ascending or descending. by querying this endpoint:

https://nc-backend.onrender.com/api/articles?order=desc

• Get article by id by querying this endpoint:

https://nc-backend.onrender.com/api/articles/:id

• Get each article comments by querying this endpoint:

https://nc-backend.onrender.com/api/articles/:id/comments

• Post comment by querying this endpoint:

https://nc-backend.onrender.com/api/articles/:id/comments

valid usernames: tickle122, grumpy19, happyamy2016, cooljmessy, weegembump, jessjelly

post comment using POST method on Postman or Insomnia using this object:

```
  { "username": "tickle122",
  "body": "test comment" };
```

• Patch vote on an article by querying this endpoint:
https://nc-backend.onrender.com/api/articles/:id

patch vote using PATCH method on Postman or Insomnia using this object:

```
{"inc_votes": anynumber }
```

• Delete comment on an article by querying this endpoint:

https://nc-backend.onrender.com/api/comments/:comment_id

## Built With

• Node.js - an open-source, cross-platform JavaScript runtime environment that executes JavaScript code outside a web browser.

• Express.js - a minimal and flexible Node.js web application framework that provides robust features for web and mobile applications.

• Postgres - an open-source relational database management system that uses and extends the SQL language.

## Note

This is the backend side of the NC-News web app you can check out the client side of this application here: https://github.com/lanzmoncis/NC-News-BE
