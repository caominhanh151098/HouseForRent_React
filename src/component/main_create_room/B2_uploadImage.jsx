import React, { useState } from "react";
import { Await, Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Navbar_create_room from "../layout_create_room/Navbar_create_room";
import CreateRoom from './../../service/create_room_usestate';
import FileService from './../../Services/fileService';

function B2_uploadImage() {
    const list = CreateRoom.getCreateRoom().imageList?.map((item, index) => (
        {
            id: index,
            file: null,
            fakeUrl: item
        }
    ))
    list?.push({
        id: list?.length,
        file: null,
        fakeUrl: null
    })
    const [selectAvatar, setSelectAvatar] = useState(list || [{
        id: 0,
        file: null,
        fakeUrl: null
    }])
    const [count, setCount] = useState(1)
    const [uploadedAvatar, setUploadedAvatar] = useState([])
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();
    const handleSelectAvatar = (e, id) => {

         const temporaryAvatarUrl = 'URL.createObjectURL(e.target.files[0])';
       const temporaryAvatarUrlList=[]
       for (let index = 0; index < e.target.files.length; index++) {
            temporaryAvatarUrlList.push({
                file:e.target.files[index],
                fakeUrl : URL.createObjectURL(e.target.files[index])
            }
                
                )
       }      
        console.log(temporaryAvatarUrlList);
        let newSelectedAvatar = []
        let check = false
        selectAvatar.forEach(element => {
            if (id == element.id && id == selectAvatar.length - 1) {
                temporaryAvatarUrlList.forEach((item,i) => {
                    newSelectedAvatar.push({
                        id: id +i,
                        file: item.file,
                        fakeUrl: item.fakeUrl
                    })
                });
              
                newSelectedAvatar.push({
                    id: id + temporaryAvatarUrlList.length,
                    file: null,
                    fakeUrl: null
                })
            } else if (id == element.id) {
                temporaryAvatarUrlList.forEach((item,i) => {
                    newSelectedAvatar.push({
                        id: id +i,
                        file: item.file,
                        fakeUrl: item.fakeUrl
                    })
                });
            } else if (id != element.id) {
                newSelectedAvatar.push(element)
            }

        });

        setSelectAvatar(newSelectedAvatar)
    }

    const handleUploadAvatar = async () => {
        
        let list = [...uploadedAvatar]
        await selectAvatar.forEach(async (element) => {

            if (element.id != selectAvatar.length - 1 && element.file != null) {

                let uploadResult = await FileService.uploadAvatar(element.file);
                if(element.id==selectAvatar.length-2){setUploading(false)}
                if (uploadResult?.data.url) {
                    list = ([...list, uploadResult?.data.url]

                    );
                    setUploadedAvatar([...list])
                    console.log(list);
                   


                }

                toast.info("uploaded success", { position: "top-right", autoClose: 1 * 1000 });
            } else if(element.id != selectAvatar.length - 1) { 
                list=([...list,element.fakeUrl])
                setUploadedAvatar([...list])
                if(element.id==selectAvatar.length-2){setUploading(false)}
            }
             
        });

        
    }
    const handleLog = () => {
        console.log(uploadedAvatar);
    }
    return (
        <>
              <ToastContainer/>
            <Navbar_create_room></Navbar_create_room>
            <div className="col-7" style={{ marginLeft: '300px' }}>
                <div className="fs-3 mb-5">Bổ sung một số bức ảnh chụp chỗ ở thuộc danh mục nhà của bạn</div>
                <div className="fs-4 mb-5">Bạn sẽ cần 5 bức ảnh để bắt đầu. Về sau, bạn vẫn có thể đăng thêm hoặc thay đổi ảnh.

                   
                </div>
                <div className="d-flex flex-wrap">
                    {

                        selectAvatar.map((item) => (
                            <>
                                <div key={item.id}>
                                    <div className="col-md-4">
                                        <div className="card" style={{ width: '350px', height: '230px', marginRight: '30px', marginBottom: '30px' }}>
                                            <img style={{ width: '350px', height: '230px' }} role="button" src={item.fakeUrl || "https://cdn.pixabay.com/photo/2017/11/10/05/24/add-2935429_960_720.png"} className="card-img-top" alt=""
                                                onClick={() => document.getElementById(`fileUpload${item.id}`).click()}
                                            />
                                        </div>
                                        <div className="card-footer">
                                            <input multiple type="file" accept="image/*" className="d-none" id={`fileUpload${item.id}`}
                                                onChange={(e) => { handleSelectAvatar(e, item.id) }}
                                            />
                                            <div className="d-grid gap-2">

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ))
                    }

                </div>

            </div>
            <div className='fixed-bottom d-flex justify-content-between'>
                <Link className="btn btn-sm ms-5 ms-5 mb-5 fs-5" to={'/host/create/b2/comfortable'}>
                    <i className="fa fa-arrow-left me-2" />
                    quay lại
                </Link>
                {
                    selectAvatar.length<6 && uploading==false && uploadedAvatar.length==0?
                    <div><button className="btn bg-dark text-white me-5 mb-5 disabled"> Upload</button></div>:
                    selectAvatar.length>=6 && uploading==false&&uploadedAvatar.length==0?
                    <div><button className="btn bg-dark text-white me-5 mb-5 " onClick={()=>{setUploading(true);handleUploadAvatar()}}> Upload</button></div>:
                    uploading==true?
                    <div><button className="btn btn-sm btn-dark" type="button" disabled="">
                    <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                    />
                    Uploading...
                </button></div>:
                    uploading==false?
                    <div><Link className="" to={'/host/create/b2/title'}> <button onClick={() => { CreateRoom.setCreateRoom({ ...CreateRoom.getCreateRoom(), imageList: uploadedAvatar }) }} className='btn bg-dark text-white me-5 mb-5 ' >Tiếp theo</button></Link></div>
                    :""
                }
                
            </div>
        </>
    )
} export default B2_uploadImage
