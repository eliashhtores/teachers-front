const teacher_name = document.querySelector('#teacher-name')
const teacher_id = window.location.href.split('?teacher_id=').reverse()[0]
const director_id = getUserID()


const getTeacherCycles = (teacher_id) => {
    const schoolCycles = document.querySelector('#v-pills-tab')

    http.get(`${server}/evaluation/teacher/${teacher_id}`)
        .then((response) => {
            if (response.status == 500) {
                console.error(response.message)
                createNotification('Ocurrió un error, favor de intentar más tarde.', 'error')
                return
            }
            if (response.status == 404) {
                schoolCycles.innerHTML = 'Sin evaluaciones'
                return
            }
            response.forEach((evaluation) => {
                schoolCycles.innerHTML += `<a href="view_evaluation.html?id=${evaluation.id}" target="_blank" id="${evaluation.id}">${evaluation.created_at}</a><br>`
            })
        })
        .catch((err) => {
            console.error(err)
            createNotification('Ocurrió un error, favor de intentar más tarde.', 'error')
            return
        })
}

const getTeacherData = () => {
    const school = document.querySelector('#school')
    const grade = document.querySelector('#grade')
    const letter = document.querySelector('#letter')
    const total_students = document.querySelector('#total_students')

    http.get(`${server}/teacher/${teacher_id}/${director_id}`)
        .then((response) => {
            if (response.status == 500) {
                console.error(response.message)
                createNotification('Ocurrió un error, favor de intentar más tarde.', 'error')
                return
            }
            teacher_name.innerHTML = response.name
            school.innerHTML = response.school
            grade.innerHTML = response.grade
            letter.innerHTML = response.letter
            total_students.innerHTML = response.total_students
        })
        .catch((err) => {
            console.error(err)
            createNotification('Ocurrió un error, favor de intentar más tarde.', 'error')
            return
        })
}

getTeacherData()
getTeacherCycles(teacher_id)