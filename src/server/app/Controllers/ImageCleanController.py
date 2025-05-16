from app.Repositories.ImageCleanRepository import ImageCleanRepository

class ImageCleanController:
    def __init__(self):
        self.image_clean_repository = ImageCleanRepository()
    
    def clean_image(self, image_id):
        """
        Controller para limpar os dados de imagem (raw_image e fresh_img)
        
        Args:
            image_id (int): ID da imagem a ser limpa
            
        Returns:
            tuple: (response_data, status_code)
        """
        try:
            if not image_id:
                return {"error": "ID da imagem é obrigatório"}, 400
            
            # Chama o repositório para limpar a imagem
            cleaned_image = self.image_clean_repository.clean_image_by_id(image_id)
            
            if not cleaned_image:
                return {"error": f"Imagem com ID {image_id} não encontrada"}, 404
            
            # Prepara a resposta
            return {
                "message": "Imagem limpa com sucesso",
                "image": {
                    "id": cleaned_image.id,
                    "project_id": cleaned_image.project_id,
                    "datetime": cleaned_image.datetime,
                    "latitude": str(cleaned_image.latitude) if cleaned_image.latitude else None,
                    "longitude": str(cleaned_image.longitude) if cleaned_image.longitude else None,
                    "fissure_type": cleaned_image.fissure_type,
                    "veredict": cleaned_image.veredict
                }
            }, 200
        except Exception as e:
            return {"error": str(e)}, 500