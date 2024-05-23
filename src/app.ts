import express from "express";
import Database from "./common/database";
import bodyParser from "body-parser";
import session from "express-session";
import UserRouter from "./user/router";
import OAuthRouter from "./OAuth/router";
const cors = require("cors");
const passport = require("passport");
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');


const app = express();
const port = process.env.PORT;

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'My API',
    version: '1.0.0',
    description: 'My API Information',
  },
  servers: [
    {
      url: process.env.SERVER,
      description: process.env.SERVER_DESCRIPTION,
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/user/router.ts', './src/OAuth/github/router.ts'], 
};
const swaggerSpec = swaggerJsdoc(options);

function init() {
  try {
    app.use(
      cors({
        methods: "GET,POST,PUT,DELETE",
        credentials: true,
        origin: true,
      })
    );
    app.use(bodyParser.json({ limit: "50mb" }));
    app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    app.get("/", (req: any, res: any) => {
      return res.status(200).send({
        status: 1,
        message: "Server Running...",
      });
    });

    app.use(
      session({
        resave: false,
        saveUninitialized: true,
        secret: process.env.SESSION_SECRET,
      })
    );

    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function (user, cb) {
      cb(null, user);
    });
    passport.deserializeUser(function (obj, cb) {
      cb(null, obj);
    });

    app.use("/auth", OAuthRouter);
    app.use("/user", UserRouter);

    app.listen(port, async () => {
      await Database.init();
      console.log("Starting Server");
      return console.log(`Server is listening at http://localhost:${port}`);
    });
  } catch (err) {
    console.log("error", err);
  }
}

init();
