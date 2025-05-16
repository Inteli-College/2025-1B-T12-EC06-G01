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