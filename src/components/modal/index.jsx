import "./style.css";

export default function FunctionalModal(props) {
  const { listKey, action, modalRef } = props;

  return (
    <div ref={modalRef} className="modal">
      <p>form aleatorio</p>
    </div>
  );
}
