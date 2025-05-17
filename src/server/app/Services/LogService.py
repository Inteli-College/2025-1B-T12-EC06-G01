from app.Repositories.LogRepository import LogRepository  


def log_service(self, msg: str, img_id: int):
    log_repository = LogRepository()

    if isinstance(str, msg) and img_id:
        try:
            log_repository.create_log(msg, img_id)
            return "[LogController] Novo registro criado com sucesso na tabela Logs!", 200
        
        except Exception as e:              
            return "[LogController] Algo deu errado ao criar novo registro na tabela Logs...", 500
    else:
        return "[LogController] Os dados não são suficientes para conseguir criar um Log...", 400