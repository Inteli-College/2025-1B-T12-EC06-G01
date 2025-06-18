from app import socketio
from threading import Thread
import os

root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))

def handle_training(train_model):
    print("TIPO DO SOCKETIO FROM WS:", type(socketio))
    socketio.start_background_task(train_model, socketio)
    send_message("Treinamento iniciado!", "training_progress_fe")



def send_message(message: str, event: str):
    msg = {"message": message}
    try:
        socketio.emit(event, msg)
        print(f"[websockets] Mensagem enviada com sucesso no evento: {event}")
    except Exception as e:
        print(f"[websockets] Erro inesperado ao enviar a mensagem: {e}")