import { useMemo, useState } from "react";
import { TiEdit, TiDeleteOutline } from "react-icons/ti";
import { database as db } from "../../services/firebaseConfig";
import { ref, onValue, remove } from "firebase/database";
import Popup from "reactjs-popup";
import FunctionalModal from "../../components/modal";

import "./style.css";

export default function Login() {
  const [parsedUser, setParsedUser] = useState({});
  //gambiarra, favor nao ajeitar
  const [reload, setReload] = useState(0);
  const [music, setMusic] = useState([]);
  let user = sessionStorage.getItem("@AuthFirebase::user");

  function handleDelete(key) {
    let removeChild = ref(db, `users/${parsedUser.uid}/musics/${key}`);

    remove(removeChild);
    window.location.reload();
  }

  async function updateMusic(musicKey, author) {
    // users/useruuid/musics/musicuid
    console.log(author);
    //set(ref(db, `users/${parsedUser.uid}/musics/${musicKey}`), {
    //  musicName: "xabalau",
    //  author: "xuxuxu",
    //});
  }

  useMemo(() => {
    setParsedUser(JSON.parse(user));

    let getMusics = ref(db, `users/${parsedUser.uid}`);
    onValue(getMusics, (snapshot) => {
      if (snapshot.val()) {
        const { musics } = snapshot.val();

        let parsedMusics = [];
        for (const [key, value] of Object.entries(musics)) {
          parsedMusics.push({
            key,
            ...value,
          });
        }

        setMusic((old) => [...old, parsedMusics]);
      } else {
        setReload(reload + 1);
      }
    });
  }, [reload]);

  const logOut = () => {
    sessionStorage.clear();
    window.location.reload();
  };

  const musicList = music.map((el) =>
    el.map((els) => {
      return (
        <li key={els.key}>
          <div>
            <span>{els.musicName}</span>
            <br />
            <span>{els.author}</span>
          </div>
          <div>
            <Popup
              trigger={
                <button className="update-music">
                  <TiEdit />
                </button>
              }
              modal
            >
              {(close) => (
                <div>
                  <form className="update-form">
                    <div>
                      <label htmlFor="author">Author: </label>
                      <input type="text" id="author" name="author"></input>
                    </div>
                    <div>
                      <label htmlFor="musicName">Music name:</label>
                      <input
                        type="text"
                        id="musicName"
                        name="musicName"
                      ></input>
                    </div>
                    <div className="buttons">
                      <button onClick={close}>Cancel</button>
                      <button
                        onClick={updateMusic(
                          els.key,
                          document.getElementById("author")
                        )}
                      ></button>
                    </div>
                  </form>
                </div>
              )}
            </Popup>
            <button
              className="remove-music"
              onClick={() => handleDelete(els.key)}
            >
              <TiDeleteOutline />
            </button>
          </div>
        </li>
      );
    })
  );

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
            <img className="photo" src={parsedUser.photoURL}></img>
            <div className="infos">Musicas de {parsedUser.displayName} </div>
          </div>
        </header>
        <div className="list">
          <ul>{musicList}</ul>
        </div>
        <Popup
          trigger={<button className="add-music">Inserir musica</button>}
          modal
        >
          <FunctionalModal userId={parsedUser.uid} />
        </Popup>
      </div>
      <button onClick={logOut} className="detached">
        logout
      </button>
    </>
  );
}
