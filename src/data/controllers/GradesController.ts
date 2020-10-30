import { Request, Response } from 'express';
import connection from '../connection';

export default {
  async index(request: Request, response: Response) {
    const { user_id, matter_id } = request.params;

    if(!user_id) {
      return response.status(400).json({
        message: 'need argument to "user_id" param'
      });
    }

    try {
      const result = await connection('grades')
        .leftJoin('matters', 'matters.id', '=', 'grades.matter_id')
        .leftJoin('users', 'users.id', '=', 'grades.user_id')
        .select('grades.*', 'matters.name as matter')
        .where('grades.user_id', '=', user_id)
        .andWhere('grades.matter_id', '=', matter_id);

      if(result) {
        return response.json({
          notas: result
        });
      }

      return response.status(404).json({
        message: 'user or matter not found'
      })
    }
    catch(error) {
      return response.status(500).json({
        message: 'Ocorreu um erro interno no servidor. Por favor, contate o suporte.',
        error
      });
    }
  }
}