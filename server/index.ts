/* eslint-disable no-console */
import next from 'next'
import express, { Request, Response } from 'express'

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
app.prepare().then(() => {
  const server = express()
  server.get('/apitest/side-menu', (_req: Request, res: Response) =>
    res.json({ testArray: [1, 2, 3] })
  )
  server.get('*', (req: Request, res: Response) => handle(req, res))
  const PORT = process.env.PORT || 3000
  server.listen(PORT, () => {
    console.log(`> Ready on port ${PORT}`)
  })
})
