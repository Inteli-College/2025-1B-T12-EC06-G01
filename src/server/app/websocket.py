from app import socketio
from threading import Thread
import os

socketio.start_background_task

root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))

@socketio.on('start_training')
def handle_training(train_model):
    thread = Thread(target=train_model, args=(socketio,))
    thread.start()
    send_message("Treinamento iniciado!", "training_progress_fe")


def send_message(message: str, event: str):
    msg = {"message": message}
    try:
        # Emissão segura mesmo fora de contexto HTTP
        socketio.emit(event, msg)
        print(f"[websockets] Mensagem enviada com sucesso no evento: {event}")
    except RuntimeError as e:
        print(f"[websockets] RuntimeError ao enviar a mensagem (talvez fora do contexto?): {e}")
    except Exception as e:
        print(f"[websockets] Erro inesperado ao enviar a mensagem: {e}")