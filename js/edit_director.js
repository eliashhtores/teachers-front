const director_id = window.location.href.split('?director_id=').reverse()[0]
const form = document.querySelector('form')

const getDirectorData = () => {
    const name = document.querySelector('#name')
    const school = document.querySelector('#school')

    http.get(`${server}/director/${director_id}`)
        .then((response) => {
            if (response.status == 500) {
                console.error(response.message)
                createNotification('Ocurrió un error, favor de intentar más tarde.', 'error')
                return
            }
            name.value = response.name
            school.value = response.school
        })
        .catch((err) => {
            console.error(err)
            createNotification('Ocurrió un error, favor de intentar más tarde.', 'error')
            return
        })
}

const updateDirector = (data) => {
    http.patch(`${server}/director/${director_id}`, data)
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

getDirectorData()

form.addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(form)
    let data = {}
    for (let pair of formData.entries()) data[pair[0]] = pair[1]
    updateDirector(data)
})