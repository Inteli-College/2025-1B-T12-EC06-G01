from app.Repositories.ImageRepository import ImageRepository
from datetime import datetime

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



    def post_images(self, data, files):
        try:
            fachada = data['fachada']
            predio_id = data['building_id']
            date = data['datetime'] if data['datetime'] else str(datetime.now())
            id_sucess = {}
            id_error = []

        except Exception as e:
            print("[ImageController] Os conteúdos json não são suficientes...")
            return {"code": 400, "message": e}, 400

        for file in files:
            if file.filename != '':
                file_name = file.filename
                url = self.image_repository.update_image(file)

                if url:
                    new, code = self.image_repository.create_image(fachada=fachada, raw_image=url, predio_id=predio_id, date=date)

                    if code == 201:
                        id_sucess[new.id] = file_name

                    else:
                        print(f"[ImageController] A criação do novo registro da imagem deu erro...")
                        id_error.append(file_name)

                else:
                    print("[ImageController] Erro ao fazer o upload de uma das imagens...")
                    id_error.append(file_name)
        
        if len(id_sucess) < 0:
            return {"code": 500, "message": "Nenhum arquivo foi bem sucedido...", "id_error": id_error}, 500        

        return {"id_sucess": id_sucess, "id_error": id_error}, 200
    


    def get_images_per_fachada(self, data):
        try:
            id_predio = data['building_id']
            fachada = data['fachada']

        except Exception as e:
            print("[ImageController] Os conteúdos json não são suficientes...")
            return {"code": 400, "message": f"{e}"}, 400

        result, code = self.image_repository.read_images_per_fachada(id_predio=id_predio, fachada=fachada)
        return result, code
    
    def get_images_classified_per_building(self, data):
        try:
            id_predio = data['building_id']

        except Exception as e:
            print("[ImageController] Os conteúdos json não são suficientes...")
            return {"code": 400, "message": f"{e}"}, 400
        
        result, code = self.image_repository.read_images_classified_per_building(id_predio=id_predio)
        return result, code


                



            




        