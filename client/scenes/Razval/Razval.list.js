import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
// import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import RazvalRow from '../../components/razval/razval'
import { deleteEmployee } from '../../redux/reducers/employees'
import { updateRazval, createRazval, deleteRazval } from '../../redux/reducers/razvals'
import { createOil, updateOil, deleteOil } from '../../redux/reducers/oils'
import Navbar from '../../components/Navbar'
import RazvalSidebar from './Razval.sidebar'
import Modal from '../../components/Modal.delete'
import ModalView from '../../components/razval/razval.modal'
import ModalCreate from '../../components/razval/razval.modal.create'
import ModalEdit from '../../components/razval/razval.modal.edit'
import AccessModal from '../../components/razval/access.modal'
import 'react-toastify/dist/ReactToastify.css'

const RazvalList = () => {
  toast.configure()
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }
  const dispatch = useDispatch()
  const place = useSelector((s) => s.places.list)
  const employee = useSelector((s) => s.employees.list)
  const razvalList = useSelector((s) => s.razvals.list)
  const oilList = useSelector((s) => s.oils.list)
  const auth = useSelector((s) => s.auth)
  const [isOpen, setIsOpen] = useState(false)
  const [createIsOpen, setCreateIsOpen] = useState(false)
  const [editIsOpen, setEditIsOpen] = useState(false)
  const [deleteIsOpen, setDeleteIsOpen] = useState(false)
  const [accessIsOpen, setAccessIsOpen] = useState(false)
  const [itemId, setItemId] = useState('')
  const [itemType, setItemType] = useState('')
  const [activeDay, setActiveDay] = useState(new Date())
  const [activeTime, setActiveTime] = useState('')
  const [activeAdress, setActiveAdress] = useState({})

  const openAndEdit = (id, type, address) => {
    setIsOpen(true)
    setItemId(id)
    setItemType(type)
    setActiveAdress(address)
  }
  const openAndCreate = (time, address, type) => {
    setCreateIsOpen(true)
    setItemType(type)
    setActiveTime(time)
    setActiveAdress(address)
  }
  const openAndEditTime = () => {
    setIsOpen(false)
    setEditIsOpen(true)
  }
  const openAndDelete = () => {
    setIsOpen(false)
    setEditIsOpen(true)
    setDeleteIsOpen(true)
  }
  const openAndDeleteAccess = () => {
    setAccessIsOpen(false)
    setEditIsOpen(false)
    setDeleteIsOpen(true)
  }
  const openAccess = (id, type) => {
    setItemId(id)
    setItemType(type)
    setAccessIsOpen(true)
  }
  const updateRazvalLocal = (idOfItem, name) => {
    dispatch(updateRazval(idOfItem, name))
    setIsOpen(false)
    setEditIsOpen(false)
    notify('Данные обновлены')
    setItemId('')
  }

  const updateOilLocal = (idOfItem, name) => {
    dispatch(updateOil(idOfItem, name))
    setIsOpen(false)
    setEditIsOpen(false)
    notify('Данные обновлены')
    setItemId('')
  }

  const createRazvalLocal = (name) => {
    dispatch(createRazval(name))
    setCreateIsOpen(false)
    notify('Запись на развал-схождение добавлена')
    setItemId('')
  }

  const createOilLocal = (name) => {
    dispatch(createOil(name))
    setCreateIsOpen(false)
    notify('Запись на замену масла добавлена')
    setItemId('')
  }

  const deleteOilLocal = (id) => {
    dispatch(deleteOil(id))
    setDeleteIsOpen(false)
    notify('Запись удалена')
    setItemId('')
  }
  const deleteRazvalLocal = (id) => {
    if (itemType === 'Развал-схождение') {
      dispatch(deleteRazval(id))
      setDeleteIsOpen(false)
      setEditIsOpen(false)
      notify('Запись удалена')
      setItemId('')
    } else if (itemType === 'Замена масла') {
      dispatch(deleteOil(id))
      setDeleteIsOpen(false)
      setEditIsOpen(false)
      notify('Запись удалена')
      setItemId('')
    }
  }

  const deleteEmployeeLocal = (id) => {
    dispatch(deleteEmployee(id))
    setIsOpen(false)
    notify('Сотрудник удален')
  }
  return (
    <div>
      <Navbar />
      <div className="flex flex-row">
        <RazvalSidebar setActiveDay={setActiveDay} />
        <div className="w-full mx-auto my-2">
          <div className="rounded-lg relative lg:my-3 mt-1 flex flex-wrap mx-3">
            {place
              .filter((it) => it.id === auth.place)
              .filter((it) => it.razval === 'true' || it.oil === 'true')
              .map((it, id) => (
                <div key={id}>
                  <RazvalRow
                    key={id}
                    place={place}
                    editItem={openAndEdit}
                    createItem={openAndCreate}
                    changeItem={openAndEditTime}
                    openAccess={openAccess}
                    adress={it}
                    activeDay={activeDay}
                    razvalList={razvalList}
                    oilList={oilList}
                    activePlace="true"
                    activeAdress={auth.place}
                    activeRole={auth.roles}
                    {...it}
                  />
                </div>
              ))}
            {place
              .filter((it) => it.id !== auth.place)
              .filter((it) => it.razval === 'true' || it.oil === 'true')
              .map((it, id) => (
                <div key={id}>
                  <RazvalRow
                    key={id}
                    place={place}
                    editItem={openAndEdit}
                    createItem={openAndCreate}
                    changeItem={openAndEditTime}
                    openAccess={openAccess}
                    adress={it}
                    activeDay={activeDay}
                    razvalList={razvalList}
                    oilList={oilList}
                    activePlace="false"
                    activeAdress={auth.place}
                    activeRole={auth.roles}
                    {...it}
                  />
                </div>
              ))}
          </div>
          {/* <Link to="/razval/create">
            <button
              type="button"
              className="fixed bottom-0 h-32 w-32 left-0 p-6 shadow bg-blue-600 text-white text-l hover:bg-blue-700 hover:text-white rounded-full my-3 mx-3"
            >
              Добавить
              <br />
              запись
            </button>
          </Link> */}
        </div>
        <ModalView
          open={isOpen}
          onClose={() => setIsOpen(false)}
          onSubmit={() => deleteEmployeeLocal(itemId)}
          itemId={itemId}
          itemType={itemType}
          place={place}
          employee={employee}
          updateRazval={updateRazvalLocal}
          updateOil={updateOilLocal}
          activeAdress={auth.place}
          changeItem={openAndEditTime}
        />
        <ModalCreate
          open={createIsOpen}
          onClose={() => setCreateIsOpen(false)}
          onSubmit={() => deleteEmployeeLocal(itemId)}
          itemId={itemId}
          itemType={itemType}
          place={place}
          employee={auth}
          createRazval={createRazvalLocal}
          createOil={createOilLocal}
          activeDay={activeDay}
          timeActive={activeTime}
          activeAdress={activeAdress}
          createIsOpen={createIsOpen}
        />
        <ModalEdit
          open={editIsOpen}
          onClose={() => setEditIsOpen(false)}
          onSubmit={() => deleteEmployeeLocal(itemId)}
          itemId={itemId}
          itemType={itemType}
          place={place}
          employee={employee}
          updateRazval={updateRazvalLocal}
          updateOil={updateOilLocal}
          deleteRazval={deleteRazvalLocal}
          deleteOil={deleteOilLocal}
          activeAdress={activeAdress}
          deleteItem={openAndDelete}
          razvalList={razvalList}
          oilList={oilList}
        />
        <Modal
          open={deleteIsOpen}
          onClose={() => setDeleteIsOpen(false)}
          onSubmit={() => deleteRazvalLocal(itemId.id)}
        />
        <AccessModal
          open={accessIsOpen}
          onClose={() => setAccessIsOpen(false)}
          onSubmit={() => deleteEmployeeLocal(itemId)}
          itemId={itemId}
          itemType={itemType}
          place={place}
          employee={employee}
          updateRazval={updateRazvalLocal}
          updateOil={updateOilLocal}
          deleteRazval={deleteRazvalLocal}
          deleteOil={deleteOilLocal}
          activeAdress={auth.place}
          deleteItem={openAndDeleteAccess}
        />
      </div>
    </div>
  )
}

export default RazvalList