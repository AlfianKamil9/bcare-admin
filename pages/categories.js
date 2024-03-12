import React, { useEffect, useState } from 'react';
import LayoutsAdmin from '@/component/LayoutsAdmin';
import Modal from 'react-bootstrap/Modal';
import { Icon } from '@iconify/react';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function Categories() {
  const [alert, setAlert] = useState(false);
  const handleClose = () => setAlert(false);
  const [alertFor, setAlertFor] = useState('');

  const [showDelete, setShowDelete] = useState(false);
  const closeDelete = () => setShowDelete(false);
  const [konfirmasi, setKonfirmasi] = useState('');
  // set get category
  const [getCategories, setGetCategories] = useState([]);
  // set body kiriman
  const [dataCategories, setDataCategories] = useState({
    category_name: '',
  });
  // set tokens
  const [tokens, setTokens] = useState('');
  const [id, setId] = useState('');
  const [modalFor, setModalFor] = useState('');
  const [show, setShow] = useState(false);
  const closeModal = () => setShow(false);
  // lauch modal add
  const launchAddModal = () => {
    setShow(true);
    setModalFor('ADD');
  };
  // launch modal edit
  const launchEditModal = (id) => {
    const editId = getCategories.find((item) => item.id === id);
    setDataCategories(editId);
    setShow(true);
    setId(editId.id);
    setModalFor('EDIT');
  };
  // lauch modal delete
  const launchDelete = (id, name) => {
    setKonfirmasi(`Are you sure to delete '${name}' categrories ?`);
    setShowDelete(true);
    setId(id);
  };

  const fetchCategories = async (token) => {
    try {
      const res = await axios.get('https://backend-hwy6vx3s6a-uc.a.run.app/api/v1/category', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGetCategories(res.data.data);
    } catch (error) {}
  };

  const deleteCategories = async (token, id) => {
    try {
      const res = await axios.delete('https://backend-hwy6vx3s6a-uc.a.run.app/api/admin-only/v1/category/' + id, {
        headers: {
          Authorization: `Bearer ${tokens}`,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const editCategories = async (tokens, body, id) => {
    try {
      const res = await axios.put('https://backend-hwy6vx3s6a-uc.a.run.app/api/admin-only/v1/category/' + id, body, {
        headers: {
          Authorization: `Bearer ${tokens}`,
        },
      });
      return res.data.code;
    } catch (error) {
      console.log(error);
      return 500;
    }
  };

  const addCategories = async (tokens, body) => {
    try {
      const res = await axios.post('https://backend-hwy6vx3s6a-uc.a.run.app/api/admin-only/v1/category', body, {
        headers: {
          Authorization: `Bearer ${tokens}`,
        },
      });
      return res.data.code;
    } catch (error) {
      console.log(error);
      return 500;
    }
  };

  // set onChange for add
  const onChangeInputValue = (e) => {
    setDataCategories({ dataCategories, [e.target.name]: e.target.value });
  };

  // handling add categories
  const handleAddCategories = async (e) => {
    e.preventDefault();
    const code = await addCategories(tokens, dataCategories);
    setShow(false);
    setDataCategories('');
    await fetchCategories(tokens);
    if (code == 201) {
      setAlertFor('success');
    } else {
      setAlertFor('failed');
    }
    setAlert(true);
  };
  // handling edit categories
  const handleEditCategories = async (e) => {
    e.preventDefault();
    const code = await editCategories(tokens, dataCategories, id);
    console.log(dataCategories);
    setShow(false);
    await fetchCategories(tokens);
    if (code == 200) {
      setAlertFor('success');
    } else {
      setAlertFor('failed');
    }
    setAlert(true);
  };
  // handling delete categories
  const handleDeleteCategories = async (e) => {
    await deleteCategories(tokens, id);
    setShowDelete(false);
    await fetchCategories(tokens);
  };

  useEffect(() => {
    const token = Cookies.get('token');
    fetchCategories(token);
    setTokens(token);
  }, []);

  return (
    <>
      <LayoutsAdmin title="Categories">
        <div className="m-3">
          <div className="card shadow-lg border-0">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <h5 className="fw-bold text-primary mt-2">
                  CATEGORIES <span className="badge bg-info"> {getCategories.length}</span>
                </h5>
                <Button
                  className="btn btn-primary ms-2 mt-2 "
                  data-bs-toggle="modal"
                  onClick={launchAddModal}
                >
                  Tambah +{' '}
                </Button>
              </div>
            </div>
          </div>

          <div
            className="card shadow-lg border-0 mt-3"
            style={{ height: '100vh', overflow: 'auto' }}
          >
            <div className="card-body content-list">
              <div className="content-profile table-responsive m-2">
                {/* ALERT */}
                {alert ? (
                  <>
                    {alertFor == 'success' ? (
                      <>
                        <div
                          className="alert alert-success alert-dismissible fade show"
                          role="alert"
                        >
                          <strong>Sukses</strong> Data berhasil diproses!
                          <button
                            onClick={handleClose}
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="alert"
                            aria-label="Close"
                          ></button>
                        </div>
                        {/*  */}
                      </>
                    ) : (
                      <>
                        <div
                          className="alert alert-danger alert-dismissible fade show"
                          role="alert"
                        >
                          <strong>Gagal</strong> Data tidak dapat diproses!
                          <button
                            onClick={handleClose}
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="alert"
                            aria-label="Close"
                          ></button>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <></>
                )}
                {/* ALERT */}
                <br />
                <table className="table table-bordered border-primary">
                  <thead className="bg-info">
                    <tr>
                      <th>KATEGORI</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getCategories.map((categories) => (
                      <>
                        <tr>
                          <td>{categories.category_name}</td>
                          <td>
                            <div className="d-flex justify-content-center">
                              <button
                                className="btn btn-light m-1"
                                onClick={() => launchEditModal(categories.id)}
                              >
                                <Icon
                                  width="20"
                                  height="20"
                                  icon="basil:edit-solid"
                                  style={{ color: ' #ffc014' }}
                                />
                              </button>
                              <button
                                className="btn btn-light m-1"
                                onClick={() => launchDelete(categories.id, categories.category_name)}
                              >
                                <Icon
                                  icon="iconoir:trash-solid"
                                  width="20"
                                  height="20"
                                  style={{ color: '#c20027' }}
                                />
                              </button>
                            </div>
                          </td>
                        </tr>
                      </>
                    ))}
                    {getCategories.length < 1 ? (
                      <>
                        <tr>
                          <td colSpan={2}>
                            <center className="m-3">
                              <h6 className="fw-bold">
                                <i>Tidak Ada Data</i>
                              </h6>
                            </center>
                          </td>
                        </tr>
                      </>
                    ) : (
                      <></>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Modal ADD */}
        <Modal
          show={show}
          onHide={closeModal}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>{modalFor} CATEGORIES</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={modalFor === 'EDIT' ? handleEditCategories : handleAddCategories}>
              <div className="mb-3">
                <label
                  for="exampleInputEmail1"
                  className="form-label"
                >
                  Categories
                </label>
                <input
                  type="text"
                  className="form-control"
                  id=""
                  aria-describedby=""
                  placeholder="Entry Categories"
                  name="category_name"
                  defaultValue={modalFor == 'EDIT' ? dataCategories.category_name : ''}
                  onChange={onChangeInputValue}
                />
              </div>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={closeModal}
                >
                  Close
                </Button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Save Changes
                </button>
              </Modal.Footer>
            </form>
          </Modal.Body>
        </Modal>

        {/* MODAL DELETE */}
        <Modal
          show={showDelete}
          onHide={closeDelete}
          backdrop="static"
          keyboard={false}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>DELETE CATEGORIES</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <center>
              <h5 className="m-3 text-danger">{konfirmasi}</h5>
            </center>
            <Modal.Footer className="pt-2">
              <Button
                variant="secondary"
                onClick={closeDelete}
              >
                Close
              </Button>
              <button
                type="button"
                onClick={handleDeleteCategories}
                className="btn btn-primary"
              >
                Delete
              </button>
            </Modal.Footer>
          </Modal.Body>
        </Modal>
      </LayoutsAdmin>
    </>
  );
}
