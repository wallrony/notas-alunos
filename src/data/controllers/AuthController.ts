import { NextFunction, Request, Response } from 'express';
import { encriptPass } from '../../core/utils/CryptoUtils';
import { haveUserIdInPath, verifyMandatoryFields } from '../../core/utils/RequestUtils';
import { createToken, verifyToken } from '../../core/utils/TokenUtils';
import connection from '../connection';

const freePaths = [
  'login', 'register'
]

const mandatoryFields = [
  'email', 'password'
]

export default {
  async login(request: Request, response: Response) {
    const emptyFields = verifyMandatoryFields(request.body, mandatoryFields);

    if(emptyFields.length) {
      return response.status(400).json({
        message: `${emptyFields.join(',')} fields are empty`
      });
    }

    try {
      const { email, password } = request.body;

      const result = await connection('users')
        .select('id')
        .where('email', '=', email)
        .andWhere('password', '=', encriptPass(password))
        .first();
      
      if(result) {
        const auth_token = createToken(result['id']);

        return response.json({
          message: 'authenticated',
          auth_token
        });
      }

      return response.status(404).json({
        message: 'user not found'
      });
    }
    catch(error) {
      return response.status(500).json({
        message: 'Ocorreu um erro interno no servidor. Por favor, contate o suporte.',
        error
      });
    }
  },
  async authenticate(request: Request, response: Response, next: NextFunction) {
    if(freePaths.includes(request.path)) {
      return next();
    }

    const authHeader = request.headers['authorization'];

    if(authHeader) {
      const token: string = authHeader.replace('Token ', '');

      const result = verifyToken(token);

      if(typeof(result) === 'number') {
        const param_id = haveUserIdInPath(request.path);

        if(param_id > 0 && Number(param_id) !== result) {
          return response.status(403).json({
            message: 'you\'re not allowed to see data that not yours. that\'s not your id'
          });
        }

        return next();
      }

      return response.status(400).json({
        error: result
      });
    }

    return response.status(400).json({
      message: 'need auth token'
    });
  }
}