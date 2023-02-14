const form = document.querySelector('form')
const passwords = document.querySelectorAll("input[type='password']")

const addDirector = (data) => {
    http.post(`${server}/director`, data)
        .then((response) => {
            if (response[0].affectedRows === 1) {
                createNotification('La directora ha sido agregada.', 'success')
                passwords.forEach(password => password.classList.remove('is-invalid'))
                clearForm()
                return
            }
            console.error(response)
            createNotification('Ocurrió un error, favor de intentar más tarde.', 'error')
        })
        .catch((err) => {
            console.error(err)
            createNotification('Ocurrió un error, favor de intentar más tarde.', 'error')
        })
}

passwords.forEach(password => {
    password.addEventListener('focus', () => {
        password.classList.remove('is-invalid')
    })
})

form.addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(form)
    let data = {}
    for (let pair of formData.entries())
        data[pair[0]] = pair[1]
    if (data.password != data.repassword) {
        passwords.forEach(password => {
            password.classList.add('is-invalid')
        })
        return
    }
    addDirector(data)
})
