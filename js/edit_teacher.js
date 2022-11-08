const teacher_id = window.location.href.split('?teacher_id=').reverse()[0]
const form = document.querySelector('form')
const director_id = getUserID()

const getTeacherData = () => {
    const name = document.querySelector('#name')
    const school = document.querySelector('#school')
    const grade = document.querySelector('#grade')
    const letter = document.querySelector('#letter')

    http.get(`${server}/teacher/${teacher_id}/${director_id}`)
        .then((response) => {
            if (response.status == 500) {
                console.error(response.message)
                createNotification('Ocurrió un error, favor de intentar más tarde.', 'error')
                return
            }
            console.log(response)
            name.value = response.name
            school.value = response.school
            grade.value = response.grade
            letter.value = response.letter
        })
        .catch((err) => {
            console.error(err)
            createNotification('Ocurrió un error, favor de intentar más tarde.', 'error')
            return
        })
}

const updateTeacher = (data) => {
    http.patch(`${server}/teacher/${teacher_id}`, data)
        .then((response) => {
            if (response.status == 500) {
                console.error(response.message)
                createNotification('Ocurrió un error, favor de intentar más tarde.', 'error')
                return
            }
            createNotification('Información de actualizada.', 'success')
        })
        .catch((err) => {
            console.error(err)
            createNotification('Ocurrió un error, favor de intentar más tarde.', 'error')
        })
}

getTeacherData()

form.addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(form)
    let data = {}
    for (let pair of formData.entries()) data[pair[0]] = pair[1]
    updateTeacher(data)
})