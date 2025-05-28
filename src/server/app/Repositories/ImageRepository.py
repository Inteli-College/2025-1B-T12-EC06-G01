from app.Models import Image, Facade
from app import db, cloud
from collections import defaultdict
from sqlalchemy.orm import contains_eager
from sqlalchemy import and_

class ImageRepository:
    @staticmethod
    def delete_images_by_ids(image_ids):
        try:
            # Find the images
            existing_images = Image.query.filter(Image.id.in_(image_ids)).all()
            if not existing_images:
                return 0  # Return 0 if no images found
            
            count = len(existing_images)
            
            # Delete each image using session.delete() which will trigger cascade
            for image in existing_images:
                db.session.delete(image)
                
            db.session.commit()
            
            return count  # Return the number of deleted images
        except Exception as e:
            db.session.rollback()
            raise e
        
    @staticmethod
    def update_image(image):
        update = cloud.uploader.upload(image, folder='raw-images')
        url = update.get("secure_url")

        if url:
            return url
        else:
            return None


    @staticmethod
    def create_image(raw_image: str, fachada_id: str, date):
        try:
            new = Image(raw_image=raw_image, facade_id=fachada_id)
            db.session.add(new)
            db.session.commit()
            return new, 201
        except Exception as e:
            print("[ImageController] Erro ao criar novo registro! 500")
            return f"{e}", 500
    
    @staticmethod
    def read_images_per_fachada(id_predio: int, fachada: str):
        try:
            images = Image.query.filter_by(building_id=id_predio, fachada=fachada).all()
            return {
                image.id: image.raw_image
                for image in images
            }, 200

        except Exception as e:
            print("[ImageRepository] Nenhuma imagem encontrada...")
            return {"code": 404, "message": "Nenhuma imagem encontrada..."}, 404
        
    @staticmethod
    def read_images_classified_per_building(id_predio: int):
        try:
            facades = (
                db.session.query(Facade)
                .filter(Facade.building_id == id_predio)
                .outerjoin(Facade.images.and_(Image.fissure_type.isnot(None)))
                .options(contains_eager(Facade.images))
                .all()
            )

            facade_image_map = defaultdict(list)

            for facade in facades:
                if facade.images: 
                    facade_image_map[facade].extend(facade.images)

            return {
                facade.name: [img.raw_image for img in images]
                for facade, images in facade_image_map.items()
            }, 200

        except Exception as e:
            print("[ImageRepository] Nenhuma imagem encontrada...")
            return {"code": 404, "message": "Nenhuma imagem encontrada..."}, 404            



            

    
