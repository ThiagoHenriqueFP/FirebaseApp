import { useState } from "react";
import { ref, set } from "firebase/database";
import { v4 } from "uuid";
import { database as db } from "../../services/firebaseConfig";

import "./style.css";

export default function FunctionalModal(props) {
  // eslint-disable-next-line react/prop-types
  const { userId } = props;

  const [musicName, setMusicName] = useState("");
  const [author, setAuthor] = useState("");

  async function saveMusic(userId, musicName, author) {
    set(ref(db, `users/${userId}/musics/${v4()}`), {
      musicName,
      author,
    });
  }

  function handleMusicName(event) {
    setMusicName(event.target.value);
  }

  function handleAuthor(event) {
    setAuthor(event.target.value);
  }

  function handleSubmit() {
    saveMusic(userId, musicName, author);
    setAuthor("");
    setMusicName("");
  }

  return (
    <div className="modal">
      <form action="#">
        <input type="text" name="musicName" onChange={handleMusicName} />
        <label htmlFor="musicName">Nome da musica</label>
        <input type="text" name="author" onChange={handleAuthor} />
        <label htmlFor="author">Autor da musica</label>
        <button onClick={handleSubmit}>salvar</button>
      </form>
    </div>
  );
}
