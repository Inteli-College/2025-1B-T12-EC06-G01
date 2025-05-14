from app.Models.Image import Image
from app import db

class ImageRepository:
    @staticmethod
    def delete_images_by_ids(image_ids):
        try:
            # First check if any of the images exist
            existing_images = Image.query.filter(Image.id.in_(image_ids)).all()
            if not existing_images:
                return 0  # Return 0 if no images found
            
            # Get the IDs of existing images
            existing_ids = [img.id for img in existing_images]
            
            # Delete only the existing images
            result = Image.query.filter(Image.id.in_(existing_ids)).delete(synchronize_session=False)
            db.session.commit()
            
            return result  # Return the number of deleted images
        except Exception as e:
            db.session.rollback()
            raise e 