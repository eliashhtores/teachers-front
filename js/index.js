let server = "http://localhost:3000"

if (window.location.hostname !== "127.0.0.1") server = "https://teachers-back.vercel.app"

const http = new EasyHTTP()
const username = document.querySelector("#username")
const password = document.querySelector("#password")
const form = document.querySelector("form")

const createSession = (data) => {
    const storage = localStorage
    let session = []
    session.push(data)
    storage.setItem("session", JSON.stringify(session))
}

const redirect = (superuser) => {
    if (superuser == 1) {
        window.location.replace("admin.html")
        return
    }
    window.location.replace("main.html")
}

const createNotification = (text, status) => {
    new Notify({
        text,
        autoclose: true,
        autotimeout: 3000,
        status,
        effect: "fade",
        speed: 300,
    })
}

form.addEventListener("submit", (e) => {
    let data = {
        username: username.value,
        password: password.value,
    }
    const url = `${server}/director/validate`

    http.post(url, data)
        .then((response) => {
            if (response.status == 500) {
                createNotification("Ocurrió un error, favor de intentar más tarde.", "error")
                console.error(response.message)
                return
            }
            if (response.length == 0) {
                createNotification("Favor de verificar su usuario y contraseña.", "warning")
                return
            }
            createSession(response)
            redirect(response.super)
        })
        .catch((err) => {
            createNotification("Ocurrió un error, favor de intentar más tarde.", "error")
            console.error(err)
        })

    e.preventDefault()
})
