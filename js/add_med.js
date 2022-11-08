const add_med_form = document.querySelector('#add-med-form')
const add_med_button = document.querySelector('#add-med-button')

const add_med = (data) => {
    http.post(`${server}/medication`, data)
        .then((response) => {
            if (response[0].affectedRows === 1) {
                createNotification('La medicina ha sido agregada.', 'success')
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

add_med_button.addEventListener('click', (e) => {
    e.preventDefault()
    const formData = new FormData(add_med_form)
    let data = {}
    for (let pair of formData.entries()) {
        if (pair[1] == '') {
            createNotification('Favor de llenar todos los campos.', 'warning')
            return
        }
        data[pair[0]] = pair[1]
    }
    add_med(data)
})
