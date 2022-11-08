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
                    <td class="text-left">${teacher.name}</td>
                    <td>
                        <a href="add_evaluation.html?teacher_id=${teacher.id}"><button type="button" class="btn orange_bg brown_color btn-xs">Crear evaluación <i class="fa fa-file-text brown_color-o"></i></button></a>
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
