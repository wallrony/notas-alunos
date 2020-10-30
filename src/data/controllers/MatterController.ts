import { Request, Response } from 'express';
import connection from '../connection';

export default {
  async index(request: Request, response: Response) {
    try {
      const result = await connection('matters')
        .select('*');

      return response.status(201).json(result);
    }
    catch(error) {
      return response.status(500).json({
        message: 'Ocorreu um erro interno no servidor. Por favor, contate o suporte.',
        error
      });
    }
  }
}