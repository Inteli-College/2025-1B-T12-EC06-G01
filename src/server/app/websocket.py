from app import socketio
from threading import Thread
from machineLearning.train import train_model

@socketio.on('start_training')
def handle_training():
    thread = Thread(target=train_model)
    thread.start()
    send_message("Treinamento iniciado!", "model_train")

def send_message(message: str, event: str):
    msg = {"message": message}
    try: 
        socketio.emit(args=msg, event=event)
        print(f"[websockets] Mensagem enviada com sucesso no evento: {event}")
    except Exception as e:
        print(f"[websockets] Erro ao enviar a mensagem: {e}")