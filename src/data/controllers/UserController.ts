import { Request, Response } from 'express';
import { encriptPass } from '../../core/utils/CryptoUtils';
import { verifyMandatoryFields } from '../../core/utils/RequestUtils';

import connection from './../connection';

const mandatoryFields = [
  'name', 'email', 'password'
];

export default {
  async index(request: Request, response: Response) {
    try {
      const result = await connection('users')
        .select('*');

      return response.json(result);
    }
    catch(error) {
      return response.status(500).json({
        message: 'Ocorreu um erro interno no servidor. Por favor, contate o suporte.',
        error
      });
    }
  },
  async show(request: Request, response: Response) {
    const { user_id } = request.params;

    if(!user_id) {
      return response.status(400).json({
        message: 'nenhum argumento passado para o parâmetro "user_id"'
      });
    }

    try {
      const result = await connection('users')
        .select('*')
        .where('id', '=', user_id)
        .first();

      if(result) {
        return response.json(result);
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
  async add(request: Request, response: Response) {
    const emptyFields = verifyMandatoryFields(request.body, mandatoryFields);

    if(emptyFields.length) {
      return response.status(400).json({
        message: `${emptyFields.join(',')} fields are empty`
      });
    }

    if(!request.body['email'].includes('@aluno.ifal.edu.br')) {
      return response.status(400).json({
        message: 'only institutional emails are valid'
      });
    }

    try {
      request.body['password'] = encriptPass(request.body['password'].toString());

      const result = await connection('users')
        .insert(request.body)
        .returning('id');
      
      if(result[0]) {
        return response.status(201).json({
          message: 'user created'
        });
      }

      throw('insert-not-realized');
    }
    catch(error) {
      return response.status(500).json({
        message: 'Ocorreu um erro interno no servidor. Por favor, contate o suporte.',
        error
      });
    }
  },
  async edit(request: Request, response: Response) {
    const { user_id } = request.params;

    if(!user_id) {
      return response.status(400).json({
        message: 'need argument to "user_id" param'
      });
    }

    const emptyFields = verifyMandatoryFields(request.body, mandatoryFields);

    if(emptyFields.length) {
      return response.status(400).json({
        message: `${emptyFields.join(',')} fields are empty`
      });
    }

    try {
      if(request.body['password']) {
        request.body['password'] = encriptPass(request.body['password'].toString());
      }

      const result = await connection('users')
        .update(request.body)
        .where('id', '=', user_id)
        .returning('id');
      
      if(result[0]) {
        return response.json({
          message: 'user edited'
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
}