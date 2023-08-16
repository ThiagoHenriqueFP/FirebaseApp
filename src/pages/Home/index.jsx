import { useEffect, useState } from "react";
import { TiEdit, TiDeleteOutline } from "react-icons/ti";
import "./style.css";
import { set, ref, onValue } from "firebase/database";
import { database as db } from "../../services/firebaseConfig";
import { v4 } from "uuid";

export default function Login() {
  const [parsedUser, setParsedUser] = useState({});
  let user = sessionStorage.getItem("@AuthFirebase::user");

  const [music, setMusic] = useState([]);

  async function saveMusic(userId, musicName, author) {
    set(ref(db, `users/${userId}/musics/${v4()}`), {
      musicName,
      author,
    });
  }

  // saveMusic(parsedUser.uid, "robocop hay", "mamonas assassinas");
  useEffect(() => {
    setParsedUser(JSON.parse(user));

    let getMusics = ref(db, `users/${parsedUser.uid}`);
    onValue(getMusics, (snapshot) => {
      const { musics } = snapshot.val();
      setMusic((old) => [...old, musics]);
    });
  }, []);

  const musicList = music.map((el) => (
    <li key={Object.keys(el)}>
      <span>{el[Object.keys(el)].musicName}</span>
      <br />
      <span>{el[Object.keys(el)].author}</span>
      <button className="update-music">
        <TiEdit />
      </button>
      <button className="remove-music">
        <TiDeleteOutline />
      </button>
    </li>
  ));

  return (
    <>
      <div className="user-container">
        <header className="header">
          <h1 className="tiny-300 secondary margin-top-0">
            <span className="italic bold-800 primary" color="#3D246C">
              My
            </span>
            Tracks
          </h1>
          <div className="separator">
            <div className="photo"></div>
            <div className="infos">Musicas de Nome vindo do firebase</div>
          </div>
        </header>
        <div className="list">
          <ul>{musicList}</ul>
        </div>

        <button className="add-music">Inserir musica</button>
      </div>
      <button className="detached">logout</button>
    </>
  );
}
