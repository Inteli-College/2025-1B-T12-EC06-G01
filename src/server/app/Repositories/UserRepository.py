from app import db
from app.Models.user import User

class UserRepository:
    @staticmethod
    def get_user_by_id(user_id):
        try:
            user = User.query.get(user_id)
            return user
        except:
            print("[UserController] Erro ao achar user! 500")
    
    @staticmethod
    def get_user_by_name(name):
        try:
            user = User.query.filter_by(name=name).first()
            return user
        except:
            print("[UserController] Erro ao achar user! 500") 
    
    @staticmethod
    def create_user(nome):
        try:
            new = User(name=nome)
            db.session.add(new)
            db.session.commit()
            return new, 201
        except Exception as e:
            print("[UserController] Erro ao criar novo registro! 500")
            return f"{e}", 500
    @staticmethod
    def delete_user(user_id):
        try:
            if not user_id:
                return {"error": "No image IDs provided"}, 400
            
            user_to_delete = User.query.filter(User.id == user_id).first()
        
            db.session.delete(user_to_delete)
            db.session.commit()

            return {
                    "message": f"Successfully deleted {user_to_delete}"
                }, 200   
        except Exception as e:
            return {"error": str(e)}, 500

        

