import { FastifyPluginAsync } from 'fastify';
import jwt from '@fastify/jwt';
import { env } from '../utils/env.js';

export type JwtUser = { id: string; role: 'farmer' | 'buyer' | 'admin'; email: string };

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: JwtUser;
    user: JwtUser;
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: () => Promise<void>;
  }
  interface FastifyRequest {
    user: JwtUser;
  }
}

export const authPlugin: FastifyPluginAsync = async (app) => {
  await app.register(jwt, {
    secret: env.JWT_SECRET,
    sign: {
      expiresIn: env.JWT_EXPIRES_IN,
    }
  });

  app.decorate('authenticate', async function (this: any) {
    await this.jwtVerify();
  });
};
