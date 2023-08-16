import { useState } from "react";
import { ref, update } from "firebase/database";
import { database as db } from "../../services/firebaseConfig";
import "./style.css";

export default function Form(props) {
  // eslint-disable-next-line react/prop-types
  const { userId, musicKey } = props;
  const [musicName, setMusicName] = useState("");
  const [author, setAuthor] = useState("");

  function handleMusicName(event) {
    setMusicName(event.target.value);
  }
  function handleAuthor(event) {
    setAuthor(event.target.value);
  }

  async function updateMusic() {
    await update(ref(db, `users/${userId}/musics/${musicKey}`), {
      musicName: musicName,
      author: author,
    });
  }

  return (
    <div className="modal">
      <form action="#" className="update-form">
        <div>
          <label htmlFor="musicName">Nome da música: </label>
          <input
            onChange={handleMusicName}
            type="text"
            id="musicName"
            name="musicName"
          ></input>
        </div>
        <div>
          <label htmlFor="author">Nome do autor:</label>
          <input
            onChange={handleAuthor}
            type="text"
            id="author"
            name="author"
          ></input>
        </div>
        <div className="buttons">
          <button onClick={updateMusic}>Alterar</button>
        </div>
      </form>
    </div>
  );
}
