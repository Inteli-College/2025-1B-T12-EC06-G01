from functools import wraps
from flask import request, jsonify, g, current_app
import jwt
from app.Models.user import User

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(" ")[1]

        if not token:
            return jsonify({'message': 'Token de acesso está faltando!'}), 401

        try:
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=["HS256"])

            user_id = data['sub']
            current_user = User.query.get(user_id)

            if not current_user:
                return jsonify({'error': 'TOKEN_INVALID', 'message': 'Token inválido ou usuário não encontrado.'}), 401
                
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'TOKEN_EXPIRED', 'message': 'Sua sessão expirou. Por favor, faça o login novamente.'}), 401
        except Exception as e:
            return jsonify({'error': 'TOKEN_INVALID', 'message': 'Token de autenticação inválido.'}), 401

        g.current_user = current_user
        return f(*args, **kwargs)

    return decorated

