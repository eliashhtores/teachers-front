const evaluations = document.querySelector('#evaluations')
const school_cycle = document.querySelector('#school_cycle')
const tbody = document.querySelector('tbody')
const submit_btn = document.querySelector('#submit-btn')
const not_found = document.querySelector('#not-found')
const director_id = getUserID()

const getEvaluations = () => {
    http.get(`${server}/evaluation/school_cycle/${school_cycle.value}/${director_id}`)
        .then((response) => {
            if (response.status === 404) {
                not_found.classList.remove('d-none')
                evaluations.classList.add('d-none')
                return
            }
            not_found.classList.add('d-none')
            evaluations.classList.remove('d-none')
            tbody.innerHTML = ''
            response.forEach((evaluation) => {
                evaluation.created_at = formatDate(evaluation.created_at)
                tbody.innerHTML += `
                <tr>
                    <td class="text-left"><a class="text-white" href="view_evaluation.html?id=${evaluation.id}">${evaluation.teacher_name}</a></td>
                    <td class="text-right text-white">${evaluation.created_at}</td>
                </tr>
                `
            })
        })
        .catch((err) => {
            console.error(err)
            createNotification('Ocurrió un error, favor de intentar más tarde.', 'error')
        })
}

submit_btn.addEventListener('click', (e) => {
    getEvaluations()
    e.preventDefault()
})

getSchoolCycles()