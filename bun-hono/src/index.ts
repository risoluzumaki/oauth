import { bootstrap } from "./bootstrap";

const app = bootstrap();

export default {
    port: process.env.PORT_APP || 3000,
    fetch: app.fetch,
}
