const add_teacher_form = document.querySelector('#add-patient-form')
const add_teacher_button = document.querySelector('#add-patient-button')

const add_teacher = (data) => {
    http.post(`${server}/patient`, data)
        .then((response) => {
            if (response[0].affectedRows === 1) {
                createNotification('El paciente ha sido agregado.', 'success')
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

add_teacher_button.addEventListener('click', (e) => {
    e.preventDefault()
    const formData = new FormData(add_teacher_form)
    let data = {}
    for (let pair of formData.entries()) data[pair[0]] = pair[1]
    data.created_by = getUserID()
    add_teacher(data)
})
