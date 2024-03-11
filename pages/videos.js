import React, { useEffect, useState } from 'react';
import LayoutsAdmin from '@/component/LayoutsAdmin';
import { Icon } from '@iconify/react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import Image from 'next/image';
import Cookies from 'js-cookie';

const Videos = () => {
  const [alert, setAlert] = useState(false);
  const handleClose = () => setAlert(false);
  const [alertFor, setAlertFor] = useState('');

  let i = 1;
  const [id, setId] = useState('');
  const [modalFor, setModalFor] = useState('');
  const [dataDetail, setDataDetail] = useState({});
  const [showDelete, setShowDelete] = useState(false);
  const closeDelete = () => setShowDelete(false);
  const [konfirmasi, setKonfirmasi] = useState('');
  const [showDetail, setShowDetail] = useState(false);
  const closeDetail = () => setShowDetail(false);
  const [getCategory, setGetCategory] = useState([]);
  const [image, setImage] = useState(null);
  const [tokens, setTokens] = useState('');
  const [getVideo, setGetVideo] = useState([]);
  const [show, setShow] = useState(false);
  const closeAdd = () => setShow(false);
  const [dataVideos, setDataVideos] = useState({
    title_video: '',
    link_video: '',
    thumbnail_video: '',
    deskripsi_video: '',
    categoryContentId: '',
    babyBluesCategoryId: '',
  });
  const onChangeInputValue = (e) => {
    setDataVideos((prevDev) => ({ ...prevDev, [e.target.name]: e.target.value }));
  };
  const body = {
    title_video: dataVideos.title_video,
    link_video: dataVideos.link_video,
    thumbnail_video: dataVideos.thumbnail_video,
    deskripsi_video: dataVideos.deskripsi_video,
    categoryContentId: dataVideos.categoryContentId,
    babyBluesCategoryId: dataVideos.babyBluesCategoryId,
    file: image,
  };

  //launch modal edit
  const launchEdit = (id) => {
    const editId = getVideo.filter((item) => item.id === id)[0];
    setShow(true);
    console.log(editId);
    setId(id);
    setDataVideos(editId);
    setModalFor('EDIT');
  };
  // Launch Add
  const launchAdd = () => {
    setShow(true);
    setModalFor('ADD');
  };
  // launch modal delete
  const launchDelete = (id, title_video) => {
    setKonfirmasi(`Are you sure to delete article '${title_video}'  ?`);
    setShowDelete(true);
    setId(id);
  };
  // launchModalDetail
  const launchDetail = (id) => {
    setShowDetail(true);
    setDataDetail(getVideo.filter((item) => item.id === id)[0]);
    console.log('data detail:', dataDetail);
  };

  // FETCH CATEGORIES
  const fetchCategories = async (token) => {
    try {
      const res = await axios.get('http://34.101.42.219:5000/api/v1/category', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGetCategory(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  // FETCH VIDEO
  const fetchVideo = async (token) => {
    try {
      const res = await axios.get('http://34.101.42.219:5000/api/v1/video', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGetVideo(res.data.data);
    } catch (error) {}
  };
  // ADD VIDEO
  const addVideos = async (token, body) => {
    try {
      const res = await axios.post('http://34.101.42.219:5000/api/admin-only/v1/video', body, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data.code;
      console.log(res.data);
    } catch (error) {
      console.log(error);
      return 500;
    }
  };
  // DELETE VIDEO
  const deleteVideo = async (tokens, id) => {
    try {
      const res = await axios.delete('http://34.101.42.219:5000/api/admin-only/v1/video/' + id, {
        headers: {
          Authorization: `Bearer ${tokens}`,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
  // DELETE VIDEO
  const editVideo = async (tokens, id, body) => {
    try {
      const res = await axios.put('http://34.101.42.219:5000/api/admin-only/v1/video/' + id, body, {
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

  // HANDLE ADD VIDEO
  const handleAddVideo = async (e) => {
    e.preventDefault();
    //console.log(body);
    const code = await addVideos(tokens, body);
    setShow(false);
    setDataVideos('');
    await fetchVideo(tokens);
    if (code == 201) {
      setAlertFor('success');
    } else {
      setAlertFor('failed');
    }
    setAlert(true);
  };
  // HANDLE DELETE VIDEO
  const handleDeleteVideo = async () => {
    await deleteVideo(tokens, id);
    setShowDelete(false);
    await fetchVideo(tokens);
  };
  // HANDLE EDIT VIDEO
  const handleEditVideo = async (e) => {
    e.preventDefault();
    const code = await editVideo(tokens, id, body);
    setShow(false);
    setDataVideos('');
    await fetchVideo(tokens);
    if (code == 200) {
      setAlertFor('success');
    } else {
      setAlertFor('failed');
    }
    setAlert(true);
  };

  useEffect(() => {
    const token = Cookies.get('token');
    fetchVideo(token);
    fetchCategories(token);
    setTokens(token);
  }, []);

  return (
    <>
      <LayoutsAdmin title="Videos">
        <div className="m-3">
          <div className="card shadow-lg border-0">
            <div className="card-body">
              <h5 className="fw-bold text-primary mt-2">
                VIDEOS <span className="badge bg-info"> {getVideo.length}</span>
              </h5>
            </div>
          </div>

          <div className="card shadow-lg border-0 mt-3 h-100">
            <div className="card-body content-list">
              <Button
                className="btn btn-primary ms-2 mt-2 mb-3"
                data-bs-toggle="modal"
                onClick={launchAdd}
              >
                Tambah +{' '}
              </Button>
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
                      <th>NO</th>
                      <th>TITLE</th>
                      <th>THUMBANAIL</th>
                      <th>LINK</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getVideo.map((video) => (
                      <>
                        <tr>
                          <td>{i++}</td>
                          <td>{video.title_video}</td>
                          <td>
                            <Image
                              src={video.thumbnail_video}
                              alt="image"
                              width="100"
                              height="70"
                            />
                          </td>
                          <td>{video.link_video}</td>
                          <td>
                            <div className="d-flex justify-content-center">
                              <button
                                className="btn btn-light m-1"
                                onClick={() => launchDetail(video.id)}
                              >
                                <Icon
                                  icon="icon-park-solid:eyes"
                                  width="20"
                                  height="20"
                                  style={{ color: ' #145bff' }}
                                />
                              </button>
                              <button
                                className="btn btn-light m-1"
                                onClick={() => launchEdit(video.id)}
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
                                onClick={() => launchDelete(video.id, video.title_video)}
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
                    {getVideo.length < 1 ? (
                      <>
                        <tr>
                          <td colSpan={5}>
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
          onHide={closeAdd}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>{modalFor} VIDEO</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={modalFor == 'EDIT' ? handleEditVideo : handleAddVideo}>
              <div className="mb-3">
                <label
                  htmlFor="exampleInputEmail1"
                  className="form-label"
                >
                  Title Videos
                </label>
                <input
                  type="text"
                  className="form-control"
                  id=""
                  aria-describedby=""
                  required
                  placeholder="Entry Title"
                  name="title_video"
                  {...(modalFor == 'EDIT' ? { value: dataVideos?.title_video } : '')}
                  onChange={onChangeInputValue}
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleInputEmail1"
                  className="form-label"
                >
                  Thumbanail
                </label>
                <input
                  type="file"
                  className="form-control"
                  id=""
                  {...(modalFor == 'EDIT' ? '' : { require })}
                  aria-describedby=""
                  placeholder="Entry Image"
                  name="thumbnail_vidio"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleInputEmail1"
                  className="form-label"
                >
                  Link Video
                </label>
                <input
                  type="url"
                  className="form-control"
                  id=""
                  aria-describedby=""
                  required
                  placeholder="Entry subTitle"
                  name="link_video"
                  {...(modalFor == 'EDIT' ? { value: dataVideos?.link_video } : '')}
                  onChange={onChangeInputValue}
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleInputEmail1"
                  className="form-label"
                >
                  Kategori Video
                </label>
                <select
                  name="categoryContentId"
                  className="form-select"
                  required
                  aria-label="Default select example"
                  onChange={onChangeInputValue}
                  {...(modalFor == 'EDIT' ? { value: dataVideos?.categoryContentId } : '')}
                >
                  <option>
                    <strong>PILIH KATEGORI</strong>
                  </option>
                  {getCategory.map((category) => (
                    <>
                      <option value={category.id}> {category.category_name} </option>
                    </>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleInputEmail1"
                  className="form-label"
                >
                  Kategori Baby Blues
                </label>
                <select
                  name="babyBluesCategoryId"
                  className="form-select"
                  required
                  aria-label="Default select example"
                  onChange={onChangeInputValue}
                  {...(modalFor == 'EDIT' ? { value: dataVideos?.babyBluesCategoryId } : '')}
                >
                  <option>PILIH KATEGORI BABY BLUES</option>
                  {modalFor == 'EDIT' ? (
                    <>
                      <option
                        {...(dataVideos?.babyBluesCategoryId == 1 ? { selected: true } : '')}
                        value="1"
                      >
                        Aman
                      </option>
                      <option
                        {...(dataVideos?.babyBluesCategoryId == 2 ? { selected: true } : '')}
                        value="2"
                      >
                        Kemungkinan Depresi
                      </option>
                      <option
                        {...(dataVideos?.babyBluesCategoryId == 3 ? { selected: true } : '')}
                        value="3"
                      >
                        Depresi Ringan
                      </option>
                      <option
                        {...(dataVideos?.babyBluesCategoryId == 4 ? { selected: true } : '')}
                        value="4"
                      >
                        Depresi Berat
                      </option>
                    </>
                  ) : (
                    <>
                      <option value="1">Aman</option>
                      <option value="2">Kemungkinan Depresi</option>
                      <option value="3">Depresi Ringan</option>
                      <option value="4">Depresi Berat</option>
                    </>
                  )}
                </select>
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleInputEmail1"
                  className="form-label"
                >
                  Deskripsi Video
                </label>
                <textarea
                  type="text"
                  required
                  className="form-control"
                  id=""
                  aria-describedby=""
                  placeholder="Entry Konten"
                  name="deskripsi_video"
                  onChange={onChangeInputValue}
                  {...(modalFor == 'EDIT' ? { value: dataVideos?.deskripsi_video } : '')}
                ></textarea>
              </div>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={closeAdd}
                >
                  Close
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                >
                  Save Changes
                </Button>
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
            <Modal.Title>DELETE ARTIKELS</Modal.Title>
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
                onClick={handleDeleteVideo}
                className="btn btn-primary"
              >
                Delete
              </button>
            </Modal.Footer>
          </Modal.Body>
        </Modal>

        {/* MODAL VIEW */}
        <Modal
          show={showDetail}
          onHide={closeDetail}
          size="lg"
          backdrop="static"
          keyboard={false}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>DETAIL VIDEO</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="m-3">
              <h4> TITLE VIDEO : {dataDetail.title_video} </h4>
              <h6 className="pt-2"> LINK VIDEO : {dataDetail.link_video}</h6>
              <Image
                className="img-fluid pt-2"
                src={dataDetail.thumbnail_video}
                alt="image"
                width="500"
                height="300"
              />

              <h6 className="pt-2">KATEGORI VIDEO : {dataDetail.category_content?.category_name}</h6>
              <p className="text-justify">
                KONTEN :
                <br />
                {dataDetail.deskripsi_video}
              </p>
            </div>

            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={closeDetail}
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal.Body>
        </Modal>
      </LayoutsAdmin>
    </>
  );
};

export default Videos;
