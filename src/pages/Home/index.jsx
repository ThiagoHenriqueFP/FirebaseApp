import { useEffect, useMemo, useState } from "react";
import { TiEdit, TiDeleteOutline } from "react-icons/ti";
import { database as db } from "../../services/firebaseConfig";
import { set, ref, onValue } from "firebase/database";
import { v4 } from "uuid";

import "./style.css";

export default function Login() {
  const [parsedUser, setParsedUser] = useState({});
  const [music, setMusic] = useState([]);
  //gambiarra, favor nao ajeitar
  const [reload, setReload] = useState(0);
  // const [dropDown, setDropDown] = useState(false);

  let user = sessionStorage.getItem("@AuthFirebase::user");

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
