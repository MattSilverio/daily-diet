import Fastify from "fastify";
import { sequelize } from "./database.ts";
import { registerRoutes } from "./routes/index.ts";

const app = Fastify({
    logger: true
})

app.get('/', async (req: any, res: { send: (arg0: string) => any; }) => res.send("Hello world"))
registerRoutes(app);

try {
    await sequelize.authenticate()
    await sequelize.sync()
    app.listen({port: 3000})
}catch (err){
    app.log.error(err)
}