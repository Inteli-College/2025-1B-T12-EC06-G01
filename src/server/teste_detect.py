import base64
import os
from app import create_app
from app.Services.ImageDetectionService import ImageDetectionService

def teste_detect_facade_images():
    app = create_app()
    with app.app_context():
        service = ImageDetectionService()
        facade_id = 42
        start_date = "2025-01-01"
        end_date = "2025-06-25"

        resultados = service.detect_facade_images(facade_id, start_date, end_date)
        print(f"Total imagens: {len(resultados)}")

        output_dir = "imagens_anotadas"
        os.makedirs(output_dir, exist_ok=True)

        for i, (url, img_b64) in enumerate(resultados.items(), 1):
            print(f"URL: {url}")
            print(f"Base64 começo: {img_b64[:30]}")

            # Remove prefixo caso exista
            if img_b64.startswith("data:image"):
                header, img_b64 = img_b64.split(",", 1)
                if "png" in header:
                    ext = ".png"
                elif "jpeg" in header or "jpg" in header:
                    ext = ".jpg"
                else:
                    ext = ".jpg"
            else:
                ext = ".jpg"  # default

            try:
                img_data = base64.b64decode(img_b64)
            except Exception as e:
                print(f"Erro ao decodificar base64: {e}")
                continue

            filename = url.split('/')[-1] or f"imagem_{i}{ext}"
            if not filename.endswith(ext):
                filename += ext
            filepath = os.path.join(output_dir, filename)

            with open(filepath, 'wb') as f:
                f.write(img_data)

            print(f"Salvou: {filepath}")

if __name__ == "__main__":
    teste_detect_facade_images()
