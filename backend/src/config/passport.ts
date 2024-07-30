import prisma from '../client';
import { Strategy as JwtStrategy, ExtractJwt, VerifyCallback } from 'passport-jwt';
import config from './config';
// import { TokenType } from '@prisma/client';

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

const jwtVerify: VerifyCallback = async (payload, done) => {
  try {
    const user = await prisma.temp_student_data.findFirst({
      select: {
        computer_code: true,
        student_email: true,
        student_name: true
      },
      where: { computer_code: payload.computer_code }
    });
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

export const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);
