const directors = document.querySelector('#directors')
const form = document.querySelector('form')
const name = document.querySelector('#name')
const tbody = document.querySelector('tbody')
const submit_btn = document.querySelector('#submit-btn')
const not_found = document.querySelector('#not-found')
const director_id = getUserID()

const getTeachers = () => {
    http.get(`${server}/director/name/${name.value}`)
        .then((response) => {
            if (response.status === 404) {
                not_found.classList.remove('d-none')
                directors.classList.add('d-none')
                return
            }
            not_found.classList.add('d-none')
            directors.classList.remove('d-none')
            tbody.innerHTML = ''
            response.forEach((director) => {
                tbody.innerHTML += `
            <tr>
                <td class="text-left">${director.name}</td>
                <td>
                    <a href="edit_director.html?director_id=${director.id}"><button type="button" class="btn red_bg text-white btn-xs">Editar información <i class="fa fa-edit"></i></button></a>
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
