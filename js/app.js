let server = 'http://localhost:3000'

if (window.location.hostname !== '127.0.0.1')
    server = 'https://teachersback-production.up.railway.app'

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

getSessionData()
loadEventListeners()
try {
    setName()
} catch (error) {
    console.warn('Session not found, redirecting...')
}
