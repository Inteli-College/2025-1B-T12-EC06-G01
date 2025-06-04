import styled from "styled-components";

const PopupWrapper = styled.div`
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.4);
  display: flex; justify-content: center; align-items: center;
  z-index: 9999;

  .popup-inner {
      background: white;
      padding: 2rem;
      border-radius: 15px;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      min-width: 400px;
  }

  select {
      padding: .5rem;
      border-radius: 10px;
      border: 1px solid gray;
  }

  .popup-buttons {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
  }

  .popup-buttons button {
      flex: 1;
      padding: .5rem;
      border-radius: 10px;
      border: none;
      background-color: #629EBC;
      color: white;
      font-weight: bold;
      cursor: pointer;
  }

  .popup-buttons button:hover {
      background-color: #3D80A3;
  }
`

export default function AddFolderPopup({ predio, setPredio, onSend, onClose }) {

    return (
        <PopupWrapper>
            <div className="popup-inner">
                <h2>Criar uma nova pasta</h2>
                <input placeholder="Digite o nome da pasta" onChange={(e) => { setPredio(e.target.value) }} value={predio} />
                <div className="popup-buttons">
                    <button onClick={onSend}>Criar pasta</button>
                    <button onClick={onClose}>Cancelar</button>
                </div>
            </div>
        </PopupWrapper>
    )
}
