from app.Repositories.ImageRepository import ImageRepository

class ImageController:
    def __init__(self):
        self.image_repository = ImageRepository()

    def delete_images(self, image_ids):
        try:
            if not image_ids:
                return {"error": "No image IDs provided"}, 400
            
            # Convert to list if single ID is provided
            if not isinstance(image_ids, list):
                image_ids = [image_ids]
            
            deleted_count = self.image_repository.delete_images_by_ids(image_ids)
            
            if deleted_count == 0:
                return {"message": "No images found with the provided IDs"}, 404
            
            return {
                "message": f"Successfully deleted {deleted_count} image(s)",
                "deleted_count": deleted_count
            }, 200
        except Exception as e:
            return {"error": str(e)}, 500 
        
    def get_images_by_building(self, building_id):
        try:
            if building_id is None:
                return {"error": "building_id is required"}, 400

            # Chama o repositório para buscar as imagens
            images = self.image_repository.find_by_building_id(building_id)

            # Se não encontrou, devolve 404
            if not images:
                return {"message": "No images found for this building_id"}, 404

            # Serializa cada Image num dict
            image_list = [{
                'id': img.id,
                'raw_image': img.raw_image,
                'fresh_img': img.fresh_img,
                'datetime': img.datetime,
                'fissure_type': img.fissure_type,
                'veredict': img.veredict,
                'fachada': img.fachada,
                'building_id': img.building_id
            } for img in images]

            return {"images": image_list}, 200

        except Exception as e:
            return {"error": str(e)}, 500