const teachers = document.querySelector('#teachers')
const form = document.querySelector('form')
const tbody = document.querySelector('tbody')
const not_found = document.querySelector('#not-found')
const director_id = getUserID()

const getTeachers = (data) => {
    http.get(`${server}/evaluation/teacher/${data.name}/${data.date}/${director_id}`)
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
                        <a href="draw_chart.html?teacher_id=${teacher.id}&date=${data.date}&chart=time"><button type="button" class="btn brown_bg text-white btn-xs">Tiempos muertos <i class="fa fa-clock-o"></i></button></a>
                    </td>
                    <td>
                        <a href="draw_chart.html?teacher_id=${teacher.id}&date=${data.date}&chart=students"><button type="button" class="btn white_bg red_color btn-xs">Alumnos involucrados <i class="fa fa-users red_color"></i></button></a>
                    </td>
                    <td>
                        <a href="draw_chart.html?teacher_id=${teacher.id}&date=${data.date}&chart=material"><button type="button" class="btn btn-info btn-xs text-white">Tipo de material <i class="fa fa-map"></i></button></a>
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
    const formData = new FormData(form)
    let data = {}
    for (let pair of formData.entries())
        data[pair[0]] = pair[1]

    getTeachers(data)
    e.preventDefault()
})
