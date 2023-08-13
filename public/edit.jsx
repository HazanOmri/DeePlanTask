import { useRef, useState } from 'react'
import { itemService } from '../services/item.service'
import Swal from 'sweetalert2'
import { showSavedMsg } from '../services/event-bus.service'

export function Edit({ item = itemService.getEmptyItem(), closeModal }) {
    const [itemName, setItemName] = useState(item.name)
    const [itemId, setItemId] = useState(item._id)
    const [itemDesc, setItemDesc] = useState(item.desc)
    const [itemKind, setItemKind] = useState(item.kind)
    const [itemDate, setItemDate] = useState(item.date)
    const [addedLines, setAddedLines] = useState([])
    const elScreenRef = useRef(null)
    const elUlRef = useRef(null)

    function handleChange({ target }) {
        switch (target.id) {
            case 'name':
                if (target.value.length >= 50) break
                setItemName(target.value)
                break
            case 'id':
                setItemId(target.value)
                break
            case 'desc':
                setItemDesc(target.value)
                break
            case 'kind':
                setItemKind(target.value)
                break
            case 'date':
                setItemDate(target.value)
                break
            default:
                if (target.id.charAt(0) === 'k') {
                    addedLines[target.name] = { ...addedLines[target.name], "key": target.value }
                }
                if (target.id.charAt(0) === 'p') {
                    addedLines[target.name] = { ...addedLines[target.name], "prop": target.value }
                }
                break
        }
    }

    function toggleMenu() {
        closeModal()
        if (!elScreenRef.current) elScreenRef.current = document.querySelector('.toggle-menu-screen')
        if (!elUlRef.current) elUlRef.current = document.querySelector('ul')
        elScreenRef.current.classList.toggle('close-nav')
        elUlRef.current.classList.toggle('open')
        let elImgInput = document.querySelector('.input-img-container')
        let elCatInput = document.querySelector('.multi-selector')
        if (elImgInput) elImgInput.classList.toggle('to-back')
        if (elCatInput) elCatInput.classList.toggle('to-back')
    }

    function onCancel() {
        Swal.fire({
            title: 'Are you sure?',
            text: "All changes will be deleted!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#518678',
            cancelButtonColor: '#F98866',
            confirmButtonText: 'Yes, exit!'
        }).then((result) => {
            if (result.isConfirmed) {
                closeModal(false)
            }
        })
    }

    async function onSave() {
        let newItem = {
            ...item,
            name: itemName,
            desc: itemDesc,
            kind: itemKind,
            date: itemDate
        }
        if (addedLines.length > 0) {
            addedLines.forEach((line) => {
                if (line.key !== undefined && line.prop !== undefined)
                    newItem = { ...newItem, [line.key]: line.prop }
            })
        }
        try {
            console.log('newItem', newItem)
            await itemService.save(newItem)
            showSavedMsg('✓ Your changes have been successfully saved!')
            closeModal(false)
        } catch (err) {
            console.error("had problems saving due to:", err)
        }
    }

    function onAddLine() {
        setAddedLines(prevAdeedLines => [...prevAdeedLines, {}])
    }

    return <section className="edit-container">
        <form className="edit" onSubmit={(ev) => ev.preventDefault()}>
            <label htmlFor="name"> Name
                <input type="text"
                    name="name"
                    id="name"
                    value={itemName}
                    onChange={handleChange}
                />
            </label>
            <label htmlFor="desc"> Description
                <textarea type="text"
                    name="desc"
                    id="desc"
                    value={itemDesc}
                    onChange={handleChange}
                />
            </label>
            <label htmlFor="kind"> Kind
                <select name="kind"
                    id="kind"
                    value={itemKind}
                    onChange={handleChange}
                >
                    <option disabled value="0"> -- select an option -- </option>
                    <option value="fruit">fruit</option>
                    <option value="vegetable">vegetable</option>
                    <option value="crop">crop</option>
                </select>
            </label>
            <label htmlFor="date">Product marketing date
                <input type="date"
                    name="date"
                    id="date"
                    value={itemDate.toString()}
                    onChange={handleChange}
                />
            </label>
            <label htmlFor="id"> Catalog number
                <p>{itemId}</p>
            </label>
            <div className="added-lines">
                {addedLines.length > 0 && addedLines.map((line, index) => {
                    return <div className={`line${index}`} key={`line${index}`}>
                        <input type="text" id={`k${index}`} onChange={handleChange} name={index} />
                        <input type="text" id={`p${index}`} onChange={handleChange} name={index} />
                    </div>
                })}
            </div>
            <button className="add-line" onClick={onAddLine}>add line</button>
            <div className="actions">
                <button className="save" onClick={onSave}>Save</button>
                <button className="cancel" onClick={onCancel}>Cancel</button>
            </div>
        </form>
        <div className="toggle-menu-screen" onClick={toggleMenu}></div>
    </section >
}