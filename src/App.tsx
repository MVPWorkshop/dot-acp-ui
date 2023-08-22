import { FC, useState } from "react";
import { ReactComponent as Logo } from "./assets/img/logo.svg";
import { RouterProvider } from "react-router-dom";
import router from "./app/router";
import Modal from "./components/atom/Modal";

const App: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <div className="flex flex-col items-center gap-5 py-10">
      <Logo className="w-48" />
      <RouterProvider router={router} />
      <div className="flex h-screen items-center justify-center">
        <button className="rounded bg-yellow-500 px-4 py-2 font-bold text-white hover:bg-green-500" onClick={openModal}>
          Open Modal
        </button>
        <Modal isOpen={isModalOpen} onClose={closeModal} modalHeaderText="Select token">
          <h2 className="mb-4 text-xl font-semibold">Modal Content</h2>
          <p>This is the content of the modal. This is the content of the modal.</p>
          <p>This is the content of the modal. This is the content of the modal.</p>
          <p>This is the content of the modal. This is the content of the modal.</p>
          <p>This is the content of the modal. This is the content of the modal.</p>
          <p>This is the content of the modal. This is the content of the modal.</p>
          <p>This is the content of the modal. This is the content of the modal.</p>
          <p>This is the content of the modal. This is the content of the modal.</p>
        </Modal>
      </div>
    </div>
  );
};

export default App;
