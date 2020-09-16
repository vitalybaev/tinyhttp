import supertest from 'supertest'
import { createServer, IncomingMessage as Request, ServerResponse as Response } from 'http'
import { json, send } from '../../packages/send/src'

const runServer = (func: (req: Request, res: Response) => any) => {
  const s = createServer((req, res) => {
    func(req, res)
  })

  return s
}

describe('Testing @tinyhttp/send', () => {
  describe('Testing json()', () => {
    it('should send a json-stringified reply when an object is passed', async () => {
      const app = runServer((req, res) => json(req, res)({ hello: 'world' }))

      const res = await supertest(app).get('/')

      expect(res.body).toStrictEqual({ hello: 'world' })
    })
    it('should set a content-type header properly', async () => {
      const app = runServer((req, res) => json(req, res)({ hello: 'world' }))

      const res = await supertest(app).get('/')

      expect(res.header['content-type']).toBe('application/json')
    })
  })
  describe('Testing send()', () => {
    it('should send a plain text', async () => {
      const app = runServer((req, res) => send(req, res)('Hello World'))

      const res = await supertest(app).get('/')

      expect(res.text).toBe('Hello World')
    })
    it('should set HTML content-type header when sending plain text', async () => {
      const app = runServer((req, res) => send(req, res)('Hello World'))

      const res = await supertest(app).get('/')

      expect(res.headers['content-type']).toContain('text/html')
    })
    it('should generate an eTag on a plain text response', async () => {
      const app = runServer((req, res) => send(req, res)('Hello World'))

      const res = await supertest(app).get('/')

      expect(res.header['etag']).not.toBeUndefined()
    })
  })
})
