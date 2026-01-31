import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { badRequest, unauthorized } from '../../../utils/errors.js';

const registerSchema = z.object({
  name: z.string().min(2).max(60),
  email: z.string().email(),
  phone: z.string().min(8).max(20).optional(),
  password: z.string().min(8).max(72),
  role: z.enum(['farmer', 'buyer']).default('farmer'),
  location: z.string().max(80).optional(),
  farmSize: z.string().max(40).optional(),
  preferredLanguage: z.string().max(5).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(72),
});

function publicUser(u: any) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    role: u.role,
    location: u.location,
    farmSize: u.farmSize,
    preferredLanguage: u.preferredLanguage,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
  };
}

export const authRoutes: FastifyPluginAsync = async (app) => {
  app.post('/register', {
    config: { rateLimit: { max: 10, timeWindow: '1 minute' } },
  }, async (req, reply) => {
    const body = registerSchema.parse(req.body);

    const existing = await app.prisma.user.findFirst({
      where: {
        OR: [
          { email: body.email },
          body.phone ? { phone: body.phone } : undefined,
        ].filter(Boolean) as any,
      },
    });

    if (existing) {
      throw badRequest('User already exists with same email/phone');
    }

    const passwordHash = await bcrypt.hash(body.password, 10);

    const user = await app.prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        passwordHash,
        role: body.role,
        location: body.location,
        farmSize: body.farmSize,
        preferredLanguage: body.preferredLanguage,
      },
    });

    const token = await reply.jwtSign({ id: user.id, role: user.role, email: user.email });
    return reply.send({ user: publicUser(user), token });
  });

  app.post('/login', {
    config: { rateLimit: { max: 20, timeWindow: '1 minute' } },
  }, async (req, reply) => {
    const body = loginSchema.parse(req.body);

    const user = await app.prisma.user.findUnique({ where: { email: body.email } });
    if (!user) throw unauthorized('Invalid credentials');

    const ok = await bcrypt.compare(body.password, user.passwordHash);
    if (!ok) throw unauthorized('Invalid credentials');

    const token = await reply.jwtSign({ id: user.id, role: user.role, email: user.email });
    return reply.send({ user: publicUser(user), token });
  });

  app.get('/me', { preHandler: [app.authenticate] }, async (req) => {
    const u = await app.prisma.user.findUnique({ where: { id: req.user.id } });
    if (!u) throw unauthorized('User not found');
    return { user: publicUser(u) };
  });
};
