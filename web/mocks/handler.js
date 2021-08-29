import { rest } from 'msw'
import { API_PREFIX } from '../config'

export const handlers = [
  rest.post('/api/v1/register', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        username: 'user1',
        email: 'user1@gmail.com',
        role: 'user',
      })
    )
  }),
  rest.post('/api/v1/login', (req, res, ctx) => {
    return res(
      ctx.json({
        access_token: '123456',
        refresh_token: '123456',
        token_type: 'bearer',
        expires_in: 86400,
        user: {
          username: 'user1',
          email: 'user1@gmail.com',
          role: 'user'
        }
      })
    )
  }),
  rest.get('/api/v1/categories', (req, res, ctx) => {
    return res(
      ctx.json({
        data: {
          categories: [
            { _id: '1', name: 'cat1' },
            { _id: '2', name: 'cat2' }
          ]
        }
      })
    )
  }),
  rest.post('/api/v1/category', (req, res, ctx) => {  
    const name = (req.body && req.body.name) ? req.body.name : 'cat1'
    const _id = (Math.random() + 1).toString(36).substring(7)

    return res(
      ctx.status(201),
      ctx.json({
        data: {
          category: {
            _id,
            name
          }
        }
      })
    )
  })
]