import requests
from datetime import datetime
from typing import List, Optional
from app.Repositories.ImageFilterRepository import ImageFilterRepository

class ImageFilterService:
    def __init__(self):
        self.repo = ImageFilterRepository()

    def filter_images(
        self,
        facade_id: int,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
        order: str = "asc"
    ) -> List[dict]:
        start_dt = datetime.fromisoformat(start_date) if start_date else None # Converte as datas de string (formato ISO 8601, ex: "2024-01-20T10:00:00") para objetos datetime.
        end_dt   = datetime.fromisoformat(end_date)   if end_date   else None # Se uma data não for fornecida (for None), a variável correspondente também será None.

        # Chama o método get_filtered do repositório para buscar as imagens no banco de dados.
        # Esta busca inicial já aplica os filtros de ID, data e ordem.
        imgs = self.repo.get_filtered(facade_id, start_dt, end_dt, order) # Retorna a lista de imagens com os filtros aplicados (de tempo e ordem)

        valid = []  # Inicia uma lista vazia para armazenar apenas as imagens com URLs que funcionam.
        
        for img in imgs:
            url = img.raw_image
            if not url: # Se o campo 'raw_image' estiver vazio ou nulo, pula para a próxima imagem.
                continue
            
            try:
                # Faz uma requisição do tipo HEAD para a URL. 
                # HEAD é mais eficiente que GET, pois verifica apenas os cabeçalhos da resposta,
                # confirmando se o recurso existe, sem baixar o conteúdo da imagem.
                # O timeout=2 define um limite de 2 segundos para evitar que o programa fique travado em uma URL lenta.
                resp = requests.head(url, timeout=2)
                if resp.status_code == 200:
                    valid.append(img) # Adiciona o objeto da imagem à lista de imagens válidas.
            except requests.RequestException:
                continue  # Se ocorrer um erro, simplesmente ignora esta imagem e continua para a próxima.


        # Retorna uma lista de dicionários, formatando os dados das imagens válidas.
        # Esta estrutura de dados é ideal para ser convertida em JSON e enviada como resposta de uma API.
        return [
            {
                "id":           img.id,
                "raw_image":    img.raw_image,
                "datetime":     img.datetime.isoformat(),  # Converte o objeto datetime para string no formato ISO.
                "latitude":     float(img.latitude)  if img.latitude  is not None else None,
                "longitude":    float(img.longitude) if img.longitude is not None else None,
                "fissure_type": img.fissure_type,
                "veredict":     img.veredict
            }
            for img in valid  # A iteração ocorre apenas na lista 'valid', que contém somente imagens com URL funcional.
        ]
