import { useEffect, useMemo, useState } from "react";
import { TiEdit, TiDeleteOutline } from "react-icons/ti";
import { database as db } from "../../services/firebaseConfig";
import { set, ref, onValue, update } from "firebase/database";
import { v4 } from "uuid";
import "./style.css";
import Popup from "reactjs-popup";
export default function Login() {
  const [parsedUser, setParsedUser] = useState({});
  //gambiarra, favor nao ajeitar
  const [reload, setReload] = useState(0);
  // const [dropDown, setDropDown] = useState(false);

  let user = sessionStorage.getItem("@AuthFirebase::user");

  const [music, setMusic] = useState([]);

  async function saveMusic(userId, musicName, author) {
    set(ref(db, `users/${userId}/musics/${v4()}`), {
      musicName,
      author,
    });
  }

  useMemo(() => {
    setParsedUser(JSON.parse(user));

    let getMusics = ref(db, `users/${parsedUser.uid}`);
    onValue(getMusics, (snapshot) => {
      console.log(snapshot.val());
      if (snapshot.val()) {
        console.log(snapshot.val());
        const { musics } = snapshot.val();
        setMusic((old) => [...old, musics]);
      } else {
        setReload(reload + 1);
      }
    });
  }, [reload]);

  const logOut = () => {
    sessionStorage.clear();
    window.location.reload();
  };

  async function updateMusic(musicKey, author) {
    // users/useruuid/musics/musicuid
    console.log(author);
    //set(ref(db, `users/${parsedUser.uid}/musics/${musicKey}`), {
    //  musicName: "xabalau",
    //  author: "xuxuxu",
    //});
  }

  const musicList = music.map((el) => (
    <li key={Object.keys(el)}>
      <span>{el[Object.keys(el)].musicName}</span>
      <br />
      <span>{el[Object.keys(el)].author}</span>
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
                <label for="author">Author: </label>
                <input type="text" id="author" name="author"></input>
              </div>
              <div>
                <label for="musicName">Music name:</label>
                <input type="text" id="musicName" name="musicName"></input>
              </div>
              <div className="buttons">
                <button onClick={close}>Cancel</button>
                <button
                  onClick={updateMusic(
                    Object.keys(el),
                    document.getElementById("author")
                  )}
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        )}
      </Popup>
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
            <img className="photo" src={parsedUser.photoURL}></img>
            <div className="infos">Musicas de {parsedUser.displayName} </div>
          </div>
        </header>
        <div className="list">
          <ul>{musicList}</ul>
        </div>
        <button className="add-music">Inserir musica</button>
      </div>
      <button onClick={logOut} className="detached">
        logout
      </button>
    </>
  );
}
