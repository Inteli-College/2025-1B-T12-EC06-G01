from app.Models.image import Image
from app import db

class ImageCleanRepository:
    @staticmethod
    def clean_image_by_id(image_id):
        """
        Limpa os campos raw_image e fresh_img de uma imagem específica
        
        Args:
            image_id (int): ID da imagem a ser limpa
            
        Returns:
            Image: O objeto da imagem atualizado ou None se não encontrado
        """
        try:
            # Encontra a imagem pelo ID
            image = Image.query.get(image_id)
            if not image:
                return None
            
            # Limpa os campos de imagem
            image.raw_image = None
            image.fresh_img = ""
            
            # Commit das alterações
            db.session.commit()
            
            return image
        except Exception as e:
            db.session.rollback()
            raise e
