const url = new URL(window.location.href)
const teacher_id = url.searchParams.get('teacher_id')
const form = document.querySelector('#main-form')
const triggerModal = document.querySelector('#trigger-modal')
const activitiesBody = document.querySelector('#activities_body')
const totalStudents = document.querySelector('#total_students')
const attendance = document.querySelector('#attendance')
const students = document.querySelectorAll('.students')
const submitButton = document.querySelector('#submit-button')
const priorKnowledge = document.getElementsByName('prior_knowledge')
const priorKnowledgeForm = document.getElementsByName('prior_knowledge_form')
const material = document.getElementsByName('material')
const materialType = document.getElementsByName('material_type')
const addActivityModal = document.querySelector('#addActivityModal')
const formActivity = document.querySelector('#form-activity')
const activityName = document.querySelector('#activity-name')
const startTime = document.querySelector('#start-time')
const linkedFields = document.querySelector('#linked-fields')
const specificKid = document.querySelector('#specific-kid')
const groupLearning = document.querySelector('#group-learning')
const endTime = document.querySelector('#end-time')
const pemc = document.querySelector('#pemc')
const socialEmotionalWork = document.querySelector('#social-emotional-work')
const director_id = getUserID()


const add_evaluation = (data) => {
    let activity = []
    data.activities = []

    for (let row of activitiesBody.rows) {
        for (let cell of row.cells) {
            const value = cell.innerText
            const field = cell.classList
            activity = { ...activity, [field]: value }
        }
        data.activities.push(activity)
    }

    submitButton.disabled = true
    http.post(`${server}/evaluation`, data)
        .then((response) => {
            if (response[0].affectedRows === 1) {
                createNotification('Evaluación guardada correctamente.', 'success')
                clearForm()
                activitiesBody.innerHTML = ''
                // window.setTimeout(function () {
                //     window.location.replace('save_evaluation.html')
                // }, 1500)
                return
            }
            console.error(response)
            createNotification('Ocurrió un error, favor de intentar más tarde.', 'error')
        })
        .catch((err) => {
            console.error(err)
            createNotification('Ocurrió un error, favor de intentar más tarde.', 'error')
        })
}

const getCurrentDate = () => {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return [year, day, month].join('-')
}

const getSchoolCycle = () => {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    if (month < '08')
        return [year - 1, year].join('-')

    return [year, year + 1].join('-')

}

const getTeacherData = () => {
    http.get(`${server}/teacher/${teacher_id}/${director_id}`)
        .then((response) => {
            const name = document.querySelector('#name')
            const school = document.querySelector('#school')
            const grade = document.querySelector('#current_grade')
            const letter = document.querySelector('#current_letter')
            const school_cycle = document.querySelector('#school_cycle')
            name.value = response.name
            school.value = response.school
            date.value = getCurrentDate()
            grade.value = response.grade
            letter.value = response.letter
            school_cycle.value = getSchoolCycle()
        })
        .catch((err) => {
            console.error(err)
            createNotification('Ocurrió un error, favor de intentar más tarde.', 'error')
        })
}

formActivity.addEventListener('submit', (e) => {
    e.preventDefault()
    if (startTime.value != '' && endTime.value != '' && startTime.value > endTime.value) {
        createNotification('La hora de inicio no puede ser mayor a la hora de cierre.', 'warning')
        startTime.value = 0
        startTime.focus()
        return
    }
    addActivityModal.classList.remove('show')
    addActivityModal.setAttribute('aria-hidden', 'true')
    addActivityModal.setAttribute('style', 'display: none')

    const modalBackdrops = document.getElementsByClassName('modal-backdrop')
    document.body.removeChild(modalBackdrops[0])

    activitiesBody.innerHTML += `
    <tr>
        <td class="activity_name">
            <small>${activityName.value}</small>
        </td>
        <td class="start_time">
            <small>${startTime.value}</small>
        </td>
        <td class="linked_fields">
            <small>${linkedFields.value}</small>
        </td>
        <td class="specific_kid">
            <small>${specificKid.value}</small>
        </td>
        <td class="group_learning">
            <small>${groupLearning.value}</small>
        </td>
        <td class="end_date">
            <small>${endTime.value}</small>
        </td>
        <td class="pemc">
            <small>${pemc.value}</small>
        </td>
        <td class="social_emotional_work">
            <small>${socialEmotionalWork.value}</small>
        </td>
    </tr>
    `
})

students.forEach(student => {
    student.addEventListener('blur', () => {
        if (attendance.value != '' && totalStudents.value != '' && parseInt(attendance.value) > parseInt(totalStudents.value)) {
            createNotification('La asistencia no puede ser mayor al número de alumnos.', 'warning')
            attendance.value = 0
            attendance.focus()
        }
    })
})

priorKnowledge.forEach(priorKnowledgeElement => {
    priorKnowledgeElement.addEventListener('click', (e) => {
        priorKnowledgeForm.forEach(priorKnowledgeFormElement => {
            if (e.target.value != 'No') {
                priorKnowledgeFormElement.disabled = false
                return
            }
            priorKnowledgeFormElement.disabled = true
        })
    })
})

material.forEach(material_element => {
    material_element.addEventListener('click', (e) => {
        materialType.forEach(materialType_element => {
            if (e.target.value != 'Sin material') {
                materialType_element.disabled = false
                return
            }
            materialType_element.disabled = true
        })
    })
})

triggerModal.addEventListener('click', () => {
    activityName.value = ''
    startTime.value = ''
    linkedFields.value = ''
    specificKid.value = ''
    groupLearning.value = ''
    endTime.value = ''
    pemc.value = ''
    socialEmotionalWork.value = ''
})

form.addEventListener('submit', (e) => {
    // children = document.querySelectorAll('activitiesBody .form-control')
    // console.log(children)
    // children.forEach(child => {
    //     console.log(child.value)
    // })

    e.preventDefault()
    const formData = new FormData(form)
    let data = {}
    for (let pair of formData.entries())
        data[pair[0]] = pair[1]

    data.teacher_id = teacher_id
    data.director_id = getUserID()

    add_evaluation(data)
})

getTeacherData()
