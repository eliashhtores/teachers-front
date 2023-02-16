let server = 'http://localhost:3000'

if (window.location.hostname !== '127.0.0.1')
    server = 'https://nice-lime-dalmatian-sari.cyclic.app/'

const storage = localStorage
const http = new EasyHTTP()
const doctor_name = document.querySelector('.doctor_name')

let session = JSON.parse(storage.getItem('session'))

const getSessionData = () => {
    const storage = localStorage
    if (storage.getItem('session')) {
        session = JSON.parse(storage.getItem('session'))
        return
    }
    window.location.replace('index.html')
}

const loadEventListeners = () => {
    try {
        document.querySelector('#exit').addEventListener('click', () => {
            console.log('Deleting session...')
            window.location.replace('index.html')
            localStorage.clear()
        })
    } catch (error) { }
}

const setName = () => {
    const name = getName()
    doctor_name.innerHTML = name
}

const createNotification = (text, status) => {
    new Notify({
        text: text,
        autoclose: true,
        autotimeout: 3000,
        status: status,
        effect: 'fade',
        speed: 300,
    })
}

const clearForm = () => {
    document.querySelector('form').reset()
}

const getUserID = () => {
    return session[0].id
}

const getUsername = () => {
    return session[0].username
}

const getName = () => {
    return session[0].name
}

const hideLoader = () => {
    table_wrapper = document.querySelector('.table-wrapper')
    loader = document.querySelector('.loader')

    loader.style.opacity = 0
    loader.style.display = 'none'
    // loader.remove()

    table_wrapper.style.display = 'block'
    table_wrapper.style.opacity = 1
    setTimeout(() => (table_wrapper.style.opacity = 1), 25)
}

const showLoader = () => {
    table_wrapper = document.querySelector('.table-wrapper')
    loader = document.querySelector('.loader')

    loader.style.opacity = 1
    loader.style.display = 'block'

    table_wrapper.style.display = 'none'
    table_wrapper.style.opacity = 0
    setTimeout(() => (table_wrapper.style.opacity = 1), 25)
}

const formatDate = (created_at) => {
    const timestamp = new Date(created_at)
    return [
        timestamp.getFullYear(),
        ('0' + (timestamp.getMonth() + 1)).slice(-2),
        ('0' + timestamp.getDate()).slice(-2)
    ].join('-')
}

const getCurrentDate = () => {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return [year, month, day].join('-')
}

const getSchoolCycles = () => {
    http.get(`${server}/evaluation/school_cycles/get/${director_id}`)
        .then((response) => {
            if (response.status === 404) {
                not_found.classList.remove('d-none')
                submit_btn.disabled = true
                return
            }
            not_found.classList.add('d-none')
            school_cycle.innerHTML = ''
            response.forEach((cycle) => {
                school_cycle.innerHTML += `
            <option value="${cycle.school_cycle}">${cycle.school_cycle}</option>
            `
            })
        })
        .catch((err) => {
            console.error(err)
            createNotification('Ocurrió un error, favor de intentar más tarde.', 'error')
        })
}

getSessionData()
loadEventListeners()
try {
    setName()
} catch (error) {
    console.warn('Session not found, redirecting...')
}
