import Koa from "koa"
import Router from "koa-router"
import axios from "axios"

const main = async () => {
  const app = new Koa()
  const router = new Router()
  router.use(async (ctx, next) => {
    ctx.set("Access-Control-Allow-Origin", "*")
    ctx.set("Access-Control-Allow-Methods", "OPTIONS, GET, POST")
    ctx.set("Access-Control-Allow-Headers", "*")
    await next()
  })
  router.options("(.*)", async (ctx) => {
    ctx.status = 204
    ctx.body = ""
  })
  router.get("/", async (ctx) => {
    ctx.set("Cache-Control", "s-maxage=600")
    const url = ctx.query.url
    if (typeof url !== "string") {
      ctx.body = {
        "redirect-resolver": {
          "/": {
            GET: {
              querystring: { url: "tatget url" },
            },
          },
        },
      }
      ctx.type = "json"
      return
    }
    const r = await axios(url, { maxRedirects: 0, validateStatus: () => true })
    ctx.body = { location: r.headers.location || null }
    ctx.type = "json"
  })
  app.use(router.routes())
  const port = process.env.port || 5000
  app.listen(port, () => console.log(`listen on http://localhost:${port}`))
}

main()
