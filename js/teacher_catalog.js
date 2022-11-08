const teachers = document.querySelector('#teachers')
const form = document.querySelector('form')
const name = document.querySelector('#name')
const tbody = document.querySelector('tbody')
const submit_btn = document.querySelector('#submit-btn')
const not_found = document.querySelector('#not-found')
const director_id = getUserID()

const getTeachers = () => {
    http.get(`${server}/teacher/teacher/${name.value}/${director_id}`)
        .then((response) => {
            if (response.status === 404) {
                not_found.classList.remove('d-none')
                teachers.classList.add('d-none')
                return
            }
            not_found.classList.add('d-none')
            teachers.classList.remove('d-none')
            tbody.innerHTML = ''
            response.forEach((teacher) => {
                tbody.innerHTML += `
                <tr>
                    <td>${teacher.name}</td>
                    <td>
                        <a href="view_teacher.html?teacher_id=${teacher.id}"><button type="button" class="btn btn-info btn-xs">Ver información <i class="fa fa-user"></i></button></a>
                    </td>
                    <td>
                        <a href="edit_teacher.html?teacher_id=${teacher.id}"><button type="button" class="btn red_bg text-white btn-xs">Editar información <i class="fa fa-edit"></i></button></a>
                    </td>
                    <td>
                        <a href="view_evaluations.html?teacher_id=${teacher.id}"><button type="button" class="btn blue_bg btn-xs text-white">Evaluaciones <i class="fa fa-desktop"></i></button></a>
                    </td>
                </tr>
                `
            })
        })
        .catch((err) => {
            console.error(err)
            createNotification('Ocurrió un error, favor de intentar más tarde.', 'error')
        })
}

form.addEventListener('submit', (e) => {
    if (name.value == '')
        return
    getTeachers()
    e.preventDefault()
})

submit_btn.addEventListener('click', (e) => {
    if (name.value == '')
        return
    getTeachers()
    e.preventDefault()
})
