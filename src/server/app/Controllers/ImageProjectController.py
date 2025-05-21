from app.Repositories.ImageProjectRepository import ImageProjectRepository

class ImageProjectController:
    def __init__(self):
        self.image_repository = ImageProjectRepository()

    @staticmethod
    def get_images_by_project(project_id):
        return ImageProjectRepository.find_by_project_id(project_id)