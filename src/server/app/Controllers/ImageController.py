from app.Repositories.ImageRepository import ImageRepository
from datetime import datetime

# Controller para organização dos métodos definidos pelo Repository. Definindo resposta para erros para maior monitoramento e garantindo que o formato correto seja passado para a função no Repository

class ImageController:
    def __init__(self):
        self.image_repository = ImageRepository()

    def delete_images(self, image_ids):
        try:
            if not image_ids:
                return {"error": "No image IDs provided"}, 400
            
            # Converte para uma lista caso apenas um id seja fornecido
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
            fachada = data.get('facade_id')
            predio_id = data.get('building_id')
            date = data.get('datetime', str(datetime.now()))
            id_sucess = {}
            id_error = []

            if not fachada or not predio_id:
                raise ValueError("Parâmetros 'facade_id' ou 'building_id' ausentes")

        except Exception as e:
            print("[ImageController] Os conteúdos recebidos não são suficientes:", e)
            return {"code": 400, "message": str(e)}, 400

        for file in files:
            if file.filename != '':
                file_name = file.filename
                url = self.image_repository.update_image(file)

                if url:
                    new, code = self.image_repository.create_image(raw_image=str(url), fachada_id=fachada, date=date)

                    if code == 201:
                        id_sucess[new.id] = file_name
                    else:
                        print(f"[ImageController] Erro ao criar registro no banco para a imagem {file_name}")
                        id_error.append(file_name)
                else:
                    print(f"[ImageController] Erro ao enviar imagem para o Cloudinary: {file_name}")
                    id_error.append(file_name)

        if len(id_sucess) == 0:
            return {"code": 500, "message": "Nenhum arquivo foi processado com sucesso.", "id_error": id_error}, 500        

        return {"id_sucess": id_sucess, "id_error": id_error}, 200
    


    def get_images_per_fachada(self, data):
        try:
            id_fachada = data['facade_id']

        except Exception as e:
            print("[ImageController] Os conteúdos json não são suficientes...")
            return {"code": 400, "message": f"{e}"}, 400

        result, code = self.image_repository.read_images_per_fachada(id_fachada=id_fachada)
        return result, code
    
    def get_images_classified_per_building(self, data):
        try:
            id_predio = data['building_id']

        except Exception as e:
            print("[ImageController] Os conteúdos json não são suficientes...")
            return {"code": 400, "message": f"{e}"}, 400
        
        result, code = self.image_repository.read_images_classified_per_building(id_predio=id_predio)
        return result, code
    
    def put_veredict(self, data):
        try:
            veredito = data['veredict']
            id_imagem = int(data['image_id'])

        except Exception as e:
            print("[ImageController] Os conteúdos json não são suficientes...")
            return {"code": 400, "message": f"{e}"}, 400
        
        result, code = self.image_repository.update_veredict(image_id=id_imagem, veredict=veredito)
        
        if code == 200:
            return {"image_id": result.id, "veredict": result.veredict}, code
        else:
            return {"error": code, "message": result}, code
