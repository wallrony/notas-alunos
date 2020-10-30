import jwt from 'jsonwebtoken';
import { decript, encriptId } from './CryptoUtils';
require('dotenv-safe').config();

export function createToken(userId: number): string {
  const token = jwt.sign(
    {
      user_id: encriptId(userId)
    },
    process.env.SECRET || '',
    {
      expiresIn: 300
    }
  );

  return token;
}

export function verifyToken(token: string) {
  let result: number;

  try {
    let decoded = jwt.verify(
      token, process.env.SECRET || ''
    );

    // @ts-ignore
    const { user_id } = decoded;

    result = Number(decript(user_id).toString())
  }
  catch (error) {
    if(error.toString().includes('TokenExpiredError')) {
      return 'token expired. do login again'
    }
    else if(error.toString().includes('JsonWebTokenError')) {
      return 'invalid token'
    }
    else {
      return 'unexpected error. do login, take a valid token and try again'
    }
  }

  return result;
}