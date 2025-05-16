from app.Models.Image import Image
from app import db

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