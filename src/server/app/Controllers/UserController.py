from app.Repositories.UserRepository import UserRepository

class UserController:
    def __init__(self):
        self.user_repository = UserRepository()

    
    def get_user_by_id(self, user_id):
        return UserRepository.get_user_by_id(user_id)
    
    def get_user_by_name(self, name):
        return UserRepository.get_user_by_name(name)
    
    def post_user(self, data):

        try:
            nome = data['name']           

        except Exception as e:
            print("[UserController] Os conteúdos json não são suficientes...")
            return {"code": 400, "message": f"{e}"}, 400

        new, code = self.user_repository.create_user(nome=nome)

        if code != 500:
            return {
                "id": new.id,
                "nome": new.name,
            }, code
        
        else:
            return {"code": code, "message": new}, code
        
    def delete_user_by_id(self, user_id):
        return UserRepository.delete_user(user_id)
        

        