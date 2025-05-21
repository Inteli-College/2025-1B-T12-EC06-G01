from app.Repositories.ImageBuildingRepository import ImageBuildingRepository


class ImageBuildingController:
    def __init__(self):
        self.image_repository = ImageBuildingRepository()

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