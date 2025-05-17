from app import db
from app.Models.log import Log

class LogRepository:
        def __init__(self):
                pass
        
        @staticmethod
        def create_log(msg, img_id):
            try:
                new_log = Log(mensagem=msg, datetime=None, image_id=img_id, user_id=1) # Alterar para quando der para ver o usuário
                db.session.add(new_log)
                db.session.commit()

            except Exception as e:
                db.session.rollback()
                raise e                