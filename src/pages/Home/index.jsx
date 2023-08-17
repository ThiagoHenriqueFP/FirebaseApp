import { useMemo, useState } from "react";
import { TiEdit, TiDeleteOutline } from "react-icons/ti";
import { BiSolidImageAdd } from "react-icons/bi";
import { database as db, storage } from "../../services/firebaseConfig";
import { ref, onValue, remove } from "firebase/database";
import Popup from "reactjs-popup";
import FunctionalModal from "../../components/modal";
import Form from "../../components/Form";
import "./style.css";
import { useFilePicker } from "use-file-picker";
import {
  getDownloadURL,
  ref as refStorage,
  uploadBytes,
} from "firebase/storage";
import { parse } from "uuid";

export default function Login() {
  const [parsedUser, setParsedUser] = useState({});
  //gambiarra, favor nao ajeitar
  const [reload, setReload] = useState(0);
  const [music, setMusic] = useState([]);
  const [photo, setPhoto] = useState("");

  let user = sessionStorage.getItem("@AuthFirebase::user");
  const metadata = {
    contentType: "image/jpeg",
  };
  async function uploadPhoto(photo) {
    if (photo[0] !== undefined) {
      let path = `${parsedUser.uid}.jpeg`;
      console.log("Isso não importa porraaaa");
      const photoReference = refStorage(storage, path);
      await uploadBytes(photoReference, photo[0], metadata).then((snapshot) => {
        console.log("Uploaded a blob or file!");
      });
    }
  }

  const [openFileSelector, { filesContent, loading, errors }] = useFilePicker({
    readAs: "DataURL",
    accept: "image/*",
    onFilesSuccessfulySelected: ({ plainFiles, filesContent }) => {
      uploadPhoto(plainFiles);
      window.location.reload();
    },
  });

  async function getImage() {
    let result = null;
    try {
      result = await getDownloadURL(
        refStorage(storage, `${parsedUser.uid}.jpeg`)
      );
    } catch (err) {
      console.log(err);
    }

    result ? setPhoto(result) : setPhoto(parsedUser.photoURL);
  }

  function handleDelete(key) {
    let removeChild = ref(db, `users/${parsedUser.uid}/musics/${key}`);
    remove(removeChild);
    window.location.reload();
  }

  useMemo(() => {
    setParsedUser(JSON.parse(user));
    getImage();

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
      } else if (snapshot.val() == null && reload < 6) {
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
              <Form userId={parsedUser.uid} music={els} />
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
            <div className="photo-container">
              <img className="photo" src={photo}></img>
              <button
                onClick={() => {
                  openFileSelector();
                  uploadPhoto(filesContent);
                }}
              >
                <BiSolidImageAdd />
              </button>
            </div>
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
