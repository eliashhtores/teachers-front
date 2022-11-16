const teachers = document.querySelector('#teachers')
const form = document.querySelector('form')
const name = document.querySelector('#name')
const tbody = document.querySelector('tbody')
const submit_btn = document.querySelector('#submit-btn')
const not_found = document.querySelector('#not-found')
const director_id = getUserID()

const currentDate = () => {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return [year, month, day].join('-')
}

const getTeachers = () => {
    http.get(`${server}/evaluation/teacher/check/${name.value}/${director_id}`)
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
                const disabled = teacher.created_at == currentDate() ? 'disabled' : ''
                const text = disabled == '' ? 'Crear evaluación' : 'Evaluación realizada'
                tbody.innerHTML += `
                <tr>
                    <td class="text-left">${teacher.name}</td>
                    <td>
                        <button id="${teacher.id}" ${disabled} type="button" class="btn orange_bg brown_color btn-xs evaluations">${text} <i class="fa fa-file-text brown_color-o"></i></button>
                    </td>
                </tr>
                `
            })
            const evaluations = document.querySelectorAll('.evaluations')
            evaluations.forEach(evaluation => {
                evaluation.addEventListener('click', (e) => {
                    e.preventDefault()
                    window.location.replace(`add_evaluation.html?teacher_id=${e.target.id}`)
                    return
                })
            })
        })
        .catch((err) => {
            console.error(err)
            createNotification('Ocurrió un error, favor de intentar más tarde.', 'error')
        })
}

form.addEventListener('submit', (e) => {
    e.preventDefault()
    if (name.value == '')
        return
    getTeachers()
})

submit_btn.addEventListener('click', (e) => {
    e.preventDefault()
    if (name.value == '')
        return
    getTeachers()
})
