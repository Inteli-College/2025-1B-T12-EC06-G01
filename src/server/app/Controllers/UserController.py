import jwt
import datetime
from flask import current_app
from app.Repositories.UserRepository import UserRepository

# Defina cada função, dando maior cuidado para a criação de um novo usuário
class UserController:
    def __init__(self):
        self.user_repository = UserRepository()

    
    def get_user_by_id(self, user_id):
        return UserRepository.get_user_by_id(user_id)
    
    def get_user_by_name(self, name):
        return UserRepository.get_user_by_name(name)
    
    def register(self, data):
        try:
            name = data['name']
            email = data['email']
            password = data['password']
        except KeyError as e:
            return {"error": f"Campo obrigatório ausente: {e}"}, 400

        # Verifica se o email já existe
        if self.user_repository.get_user_by_email(email):
            return {"error": "Este email já está em uso"}, 409 # 409 Conflict

        new_user, code = self.user_repository.create_user(name, email, password)

        if code == 201:
            return {
                "id": new_user.id,
                "name": new_user.name,
                "email": new_user.email
            }, 201
        else:
            return {"error": "Não foi possível criar o usuário"}, 500

    # Método para autenticar o usuário e gerar um token JWT.
    def login(self, data):
        try:
            email = data['email']
            password = data['password']
        except KeyError as e:
            return {"error": f"Campo obrigatório ausente: {e}"}, 400

        user = self.user_repository.get_user_by_email(email)

        # Verifica se o usuário existe e se a senha está correta
        if not user or not user.check_password(password):
            return {"error": "Credenciais inválidas"}, 401 # 401 Unauthorized

        # Se as credenciais estiverem corretas, gera o token
        token = jwt.encode({
            'sub': user.id, # 'subject' do token é o ID do usuário
            'iat': datetime.datetime.utcnow(), # 'issued at' (quando foi criado)
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24) # 'expiration' (tempo de vida)
        }, current_app.config['SECRET_KEY'], algorithm="HS256")

        return {"token": token}, 200


    def delete_user_by_id(self, user_id):
        # ... (lógica de delete pode permanecer a mesma) ...
        return self.user_repository.delete_user(user_id)