import React, { useEffect, useState } from 'react'
import SAdminLayout from '../../../../src/layouts/SAdminLayout'
import DueDetail from '../../../../src/components/DueDetail'
import { useRouter } from 'next/router'
import { db } from '../../../../src/Firebase/config'
import DueEdit from '../../../../src/components/DueEdit'


const isObjectEmpty = (objectName) => {
    return JSON.stringify(objectName) === "{}";
  };


const duesid = () => {
    const router =useRouter();
    const { id } = router.query;
    const [editDues, setEditDues] = useState(false);
    const [reRenderState, setReRenderState] = useState(Math.random());
    const [dueRec,setDueRec]=useState({});


    useEffect(()=>{
        const fetchDueRecord=()=>{
            db.collection("salaries").doc(id).onSnapshot((snapshot)=>{
                setDueRec({...snapshot.data(),firebaseId:snapshot.id});
            })
        }

        fetchDueRecord();
    },[router.query])


    const handleEditToggle=(e)=>{
        e.preventDefault();
        setEditDues(!editDues);
    }
  return (
    <SAdminLayout>
         <div className="text-center">
          {!editDues && "Salary Detail"}
          {editDues && "Salary Edit"}
        </div>

        {/* Edit Button */}
        <div className="d-flex  justify-center lg:justify-end md:justify-end  w-100 ">
          <div>
            <button
              type="submit"
              id="edit-button"
              className="border rounded px-2 py-1 w-[140px] ml-1 hover:bg-blue-600 hover:text-white"
              onClick={handleEditToggle}
            >
              {editDues === false && (
                <span>
                  {" "}
                  <span className="bi bi-pen"></span> Turn Edit On
                </span>
              )}
              {editDues === true && (
                <span>
                  {" "}
                  <span className="bi bi-pen"></span> Turn Edit Off
                </span>
              )}
            </button>
          </div>
        </div>
     {!isObjectEmpty(dueRec)&& !editDues &&<DueDetail dueRec={dueRec} setReRenderState={setReRenderState}/>}
     {!isObjectEmpty(dueRec)&&editDues&& <DueEdit dueRec={dueRec} setReRenderState={setReRenderState}/>}
    </SAdminLayout>
  )
}

export default duesid
