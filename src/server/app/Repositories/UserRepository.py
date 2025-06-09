from app import db
from app.Models.user import User

class UserRepository:
    @staticmethod
    def get_user_by_id(user_id):
        return User.query.get(user_id)

    @staticmethod
    def get_user_by_name(name):
        return User.query.filter_by(name=name).first()

    # NOVO: Método para buscar usuário pelo email, essencial para o login e para evitar cadastros duplicados.
    @staticmethod
    def get_user_by_email(email):
        return User.query.filter_by(email=email).first()

    # ALTERADO: O método create_user agora aceita todos os dados necessários.
    @staticmethod
    def create_user(name, email, password):
        try:
            new_user = User(name=name, email=email)
            new_user.set_password(password) # Usa o método do modelo para hashear a senha
            db.session.add(new_user)
            db.session.commit()
            return new_user, 201
        except Exception as e:
            db.session.rollback()
            print(f"[UserRepository] Erro ao criar novo usuário: {e}")
            return f"{e}", 500

    @staticmethod
    def delete_user(user_id):
        try:
            user_to_delete = User.query.get(user_id)
            if not user_to_delete:
                return {"error": "User not found"}, 404

            db.session.delete(user_to_delete)
            db.session.commit()
            return {"message": f"Successfully deleted user {user_id}"}, 200
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500