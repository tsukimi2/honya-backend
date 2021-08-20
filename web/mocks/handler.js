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
  })
]