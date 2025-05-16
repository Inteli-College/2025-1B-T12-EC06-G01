from datetime import datetime
from sqlalchemy import asc, desc
from app.Models import Image

class ImageFilterRepository:
    # Filtra as imagens com base em períodos de tempo ou ordena em ordem crescente ou decrescente de tempo
    def get_filtered(
        self,
        project_id: int,
        start_datetime: datetime = None,
        end_datetime:   datetime = None,
        order:          str       = "asc"
    ):
        query = Image.query.filter_by(project_id=project_id) # Filtra pelos elementos da tabela image com base no id do projeto

        if start_datetime:
            query = query.filter(Image.datetime >= start_datetime) # Caso o usuário selecione filtrar para imagens a partir de um período
        if end_datetime:
            query = query.filter(Image.datetime <= end_datetime) # Caso o usuário selecione filtrar para imagens até um período

        if order.lower() == "asc":
            query = query.order_by(asc(Image.datetime)) # Caso o usuário selecione filtrar em ordem crescente (ou não selecionar nada)
        elif order.lower() == "desc":
            query = query.order_by(desc(Image.datetime)) # Caso o usuário selecione filtrar em ordem decrescente 

        return query.all() # Retorna a lista de instâncias da tabela Image
