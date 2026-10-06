import { app } from "./app.js";
import { env } from "./env/index.js";

app
  .listen({
    host: "0.0.0.0",
    port: env.PORT,
  })
  .then(() => {
    console.log("HTTP server running");
  });
