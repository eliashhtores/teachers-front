const evaluations = document.querySelector('#evaluations')
const submitBtn = document.querySelector('#submit-btn')
const schoolCycle = document.querySelector('#school_cycle')
const tbody = document.querySelector('tbody')
const not_found = document.querySelector('#not-found')
const director_id = getUserID()

const getEvaluations = (school_cycle) => {
    http.get(`${server}/evaluation/school_cycle/${school_cycle}/${director_id}`)
        .then((response) => {
            if (response.status === 404) {
                not_found.classList.remove('d-none')
                evaluations.classList.add('d-none')
                return
            }
            not_found.classList.add('d-none')
            evaluations.classList.remove('d-none')
            tbody.innerHTML = ''
            tbody.innerHTML += `
                <tr>
                    <td>
                        <a href="draw_global_chart.html?school_cycle=${school_cycle}&chart=global_time"><button type="button" class="btn brown_bg text-white btn-xs">Maestras con tiempos muertos <i class="fa fa-clock-o"></i></button></a>
                    </td>
                    <td>
                        <a href="draw_global_chart.html?school_cycle=${school_cycle}&chart=global_students"><button type="button" class="btn white_bg red_color btn-xs">Alumnos involucrados <i class="fa fa-users red_color"></i></button></a>
                    </td>
                    <td>
                        <a href="draw_global_chart.html?school_cycle=${school_cycle}&chart=global_material"><button type="button" class="btn btn-info btn-xs text-white">Tipo de material <i class="fa fa-map"></i></button></a>
                    </td>
                    <td>
                        <a href="draw_global_chart.html?school_cycle=${school_cycle}&chart=pemc"><button type="button" class="btn white_bg orange_color btn-xs">Vinculación a PEMC <i class="fa fa-external-link-square orange_color"></i></button></a>
                    </td>
                </tr>
                `
        })
        .catch((err) => {
            console.error(err)
            createNotification('Ocurrió un error, favor de intentar más tarde.', 'error')
        })
}

submitBtn.addEventListener('click', (e) => {
    getEvaluations(schoolCycle.value)
    e.preventDefault()
})

getSchoolCycles()