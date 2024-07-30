import jwt from 'jsonwebtoken';
import moment, { Moment } from 'moment';
import config from '../config/config';
import { AuthTokensResponse } from '../types/response';
import { NextFunction, Request, Response } from 'express';
import ApiError from '../utils/ApiError';
import httpStatus from 'http-status';

/**
 * Generate token
 * @param {string} userId
 * @param {Moment} expires
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (uid: string, expires: Moment, secret = config.jwt.secret): string => {
  const payload = {
    sub: uid,
    iat: moment().unix(),
    exp: expires.unix()
  };
  return jwt.sign(payload, secret);
};

const verifyToken = async (token: string): Promise<string | null | undefined> => {
  try {
    const payload = jwt.verify(token.replace('Bearer ', ''), config.jwt.secret);
    return JSON.stringify(payload.sub); // Return the subject (user id) from the payload
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden'); // Throw the error instance
  }
};


/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<AuthTokensResponse>}
 */
const generateAuthTokens = async (user: { uid: string }): Promise<AuthTokensResponse> => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = generateToken(user.uid, accessTokenExpires);

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate()
    }
  };
};
const auth = () => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({
        message: 'Unauthorized'
      });
    }
    try {
      const data = await verifyToken(token); // Wait for token verification
      if (!data) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden'); // Throw the error instance
      } else {
        next(); // Proceed if verification succeeds
      }
    } catch (error) {
      next(error); // Pass the error to Express's error handling middleware
    }
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Token');
  }
};


export default {
  generateAuthTokens,
  auth
};
