from app import socketio
from threading import Thread
import os
from .queue_manager import QueueManager

root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
progress_queue = QueueManager("progress")

def handle_training(train_model):
    print("TIPO DO SOCKETIO FROM WS:", type(socketio))
    socketio.start_background_task(train_model, socketio)
    send_message("Treinamento iniciado!", "training_progress_fe", "progress")

@socketio.on('backup_progress')
def handle_progress(_):
    msg = progress_queue.get_message()
    socketio.emit("backup_progress_fe", msg)



def send_message(message: str, event: str, queue: str):
    msg = {"message": message}
    try:
        socketio.emit(event, msg)
        progress_queue.add_message(message=msg)
        print(f"[websockets] Mensagem enviada com sucesso no evento: {event}")
    except Exception as e:
        print(f"[websockets] Erro inesperado ao enviar a mensagem: {e}")