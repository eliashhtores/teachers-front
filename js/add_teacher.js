const add_teacher_form = document.querySelector('#add-teacher-form')

const addTeacher = (data) => {
    http.post(`${server}/teacher`, data)
        .then((response) => {
            if (response[0].affectedRows === 1) {
                createNotification('La maestra ha sido agregada.', 'success')
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

add_teacher_form.addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(add_teacher_form)
    let data = {}
    for (let pair of formData.entries()) data[pair[0]] = pair[1]
    data.director_id = getUserID()
    addTeacher(data)
})
