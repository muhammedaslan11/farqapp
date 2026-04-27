import { createRouteHandler } from "uploadthing/next"

import { UPLOADTHING_TOKEN } from "@/lib/config"
import { ourFileRouter } from "./core"

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    token: UPLOADTHING_TOKEN,
  },
})
