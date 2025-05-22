from app.Models import Image
from app import db, cloud

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
    def create_image(raw_image: str, fachada: str, predio_id: int, date):
        try:
            new = Image(raw_image=raw_image, fachada=fachada, building_id=predio_id)
            db.session.add(new)
            db.session.commit()
            return new, 201
        except Exception as e:
            print("[ImageController] Erro ao criar novo registro! 500")
            return f"{e}", 500
    
    @staticmethod
    def read_images(id_predio: int, fachada: str):
        try:
            images = Image.query.filter_by(building_id=id_predio, fachada=fachada).all()
            return {
                image.id: image.raw_image
                for image in images
            }, 200

        except Exception as e:
            print("[ImageRepository] Nenhuma imagem encontrada...")
            return {"code": 404, "message": "Nenhuma imagem encontrada..."}
        
    @staticmethod
    def read_fachadas(id_predio: int):
        try:
            fachadas = (
                Image.query
                .with_entities(Image.fachada)
                .filter_by(building_id=id_predio)
                .distinct()
                .all()
            )
            fachadas = [f[0] for f in fachadas]

            return {
                "building_id": id_predio,
                "fachadas": fachadas
            }
        
        except Exception as e:
            print("[ImageRepository] Nenhuma fachada encontrada...")
            return {"code": 404, "message": "Nenhuma imagem encontrada..."}            

    
