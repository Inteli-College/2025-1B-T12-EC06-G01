from app.Models import Image
from app import db
import cloudinary
import cloudinary.uploader
from flask import current_app
import os
import re

class ImageCleanRepository:
    @staticmethod
    def _extract_public_id(cloudinary_url):
        """
        Extrai o public_id de uma URL do Cloudinary
        
        Args:
            cloudinary_url (str): URL completa do Cloudinary
            
        Returns:
            str: public_id extraído ou None se não for possível extrair
        """
        if not cloudinary_url:
            return None
            
        # Padrão para extrair o public_id da URL do Cloudinary
        # Exemplo de URL: https://res.cloudinary.com/cloud-name/image/upload/v1234567890/folder/image.jpg
        # O public_id seria: folder/image
        pattern = r'\/v\d+\/(.+?)(\.[^.]+)?$'
        match = re.search(pattern, cloudinary_url)
        
        if match:
            return match.group(1)
        return None

    @staticmethod
    def _delete_from_cloudinary(url):
        """
        Deleta uma imagem do Cloudinary usando sua URL
        
        Args:
            url (str): URL da imagem no Cloudinary
            
        Returns:
            dict: Resultado da operação de exclusão do Cloudinary
        """
        if not url:
            return {'result': 'skipped', 'reason': 'no_url'}
            
        try:
            # Configurar o Cloudinary (pode ser movido para inicialização do aplicativo)
            cloudinary.config(
                cloud_name=current_app.config.get('CLOUDINARY_CLOUD_NAME'),
                api_key=current_app.config.get('CLOUDINARY_API_KEY'),
                api_secret=current_app.config.get('CLOUDINARY_API_SECRET')
            )
            
            # Extrair o public_id da URL
            public_id = ImageCleanRepository._extract_public_id(url)
            if not public_id:
                return {'result': 'error', 'reason': 'invalid_url'}
                
            # Deletar a imagem do Cloudinary
            result = cloudinary.uploader.destroy(public_id)
            return result
        except Exception as e:
            current_app.logger.error(f"Erro ao deletar imagem do Cloudinary: {str(e)}")
            return {'result': 'error', 'reason': str(e)}

    @staticmethod
    def clean_image_by_id(image_id):
        """
        Limpa os campos raw_image e fresh_img de uma imagem específica
        e deleta as imagens correspondentes do Cloudinary
        
        Args:
            image_id (int): ID da imagem a ser limpa
            
        Returns:
            tuple: (Image, dict) - O objeto da imagem atualizado e os resultados das operações Cloudinary
        """
        try:
            # Encontra a imagem pelo ID
            image = Image.query.get(image_id)
            if not image:
                return None, {}
            
            # Armazena as URLs atuais para deletar do Cloudinary
            raw_image_url = image.raw_image
            fresh_img_url = image.fresh_img
            
            # Resultados das operações de exclusão do Cloudinary
            cloudinary_results = {
                'raw_image': None,
                'fresh_img': None
            }
            
            # Deleta as imagens do Cloudinary
            if raw_image_url:
                cloudinary_results['raw_image'] = ImageCleanRepository._delete_from_cloudinary(raw_image_url)
                
            if fresh_img_url:
                cloudinary_results['fresh_img'] = ImageCleanRepository._delete_from_cloudinary(fresh_img_url)
            
            # Limpa os campos de imagem no banco de dados
            image.raw_image = None
            image.fresh_img = ""
            
            # Commit das alterações
            db.session.commit()
            
            return image, cloudinary_results
        except Exception as e:
            db.session.rollback()
            current_app.logger.error(f"Erro ao limpar imagem: {str(e)}")
            raise e
