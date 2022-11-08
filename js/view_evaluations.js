const url = new URL(window.location.href)
const teacher_id = url.searchParams.get('teacher_id')
const tbody = document.querySelector('tbody')
const teacher_name = document.querySelector('#teacher_name')
const evaluations = document.querySelector('#evaluations')
const notFound = document.querySelector('#not-found')

const getEvaluation = () => {
    http.get(`${server}/evaluation/teacher/${teacher_id}`)
        .then((response) => {
            if (response.status === 404) {
                notFound.classList.remove('d-none')
                return
            }
            evaluations.classList.remove('d-none')
            tbody.innerHTML = ''
            teacher_name.innerHTML = response[0].name
            response.forEach((evaluation) => {
                tbody.innerHTML += `
                <tr id="${evaluation.id}">
                    <td class="view-message">${evaluation.school_cycle}</td>
                </tr>
                `
            })
        })
        .then(() => {
            const trs = document.querySelectorAll('tr')
            trs.forEach((tr) => {
                tr.addEventListener('click', (e) => {
                    const id = e.target.parentElement.id
                    window.open(`view_evaluation.html?id=${id}`, '_blank').focus()
                })
            })
        })
        .catch((err) => {
            console.error(err)
            createNotification('Ocurrió un error, favor de intentar más tarde.', 'error')
        })
}

getEvaluation()