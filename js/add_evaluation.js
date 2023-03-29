const url = new URL(window.location.href)
const teacher_id = url.searchParams.get('teacher_id')
const form = document.querySelector('#main-form')
const triggerModal = document.querySelector('#trigger-modal')
const activitiesBody = document.querySelector('#activities_body')
const deadTimesBody = document.querySelector('#dead-time-body')
const totalStudents = document.querySelector('#total_students')
const attendance = document.querySelector('#attendance')
const students = document.querySelectorAll('.students')
const submitButton = document.querySelector('#submit-button')
const addActivityModal = document.querySelector('#addActivityModal')
const addDeadTimeModal = document.querySelector('#addDeadTimeModal')
const formActivity = document.querySelector('#form-activity')
const activityName = document.querySelector('#activity-name')
const startTime = document.querySelector('#start-time')
const description = document.querySelector('#description')
const recommendations = document.querySelector('#recommendations')
const endTime = document.querySelector('#end-time')
const director_id = getUserID()
const addBtn = document.querySelector('.add')
const input = document.querySelector('#inp-group')
const priorKnowledge = document.getElementsByName('prior_knowledge')
const priorKnowledgeForm = document.getElementsByName('prior_knowledge_form')
const material = document.getElementsByName('material')
const materialType = document.getElementsByName('material_type')
const activitiesTable = document.querySelector('#activities-table')
const formDeadTime = document.querySelector('#form-dead-time')
const deadTimeTable = document.querySelector('#dead-time-table')

const linkedFieldsArr =
{
    "language": "Lenguaje y comunicación",
    "mathematical": "Pensamiento matemático",
    "exploration": "Exploración y comprensión del mundo natural y social",
    "arts": "Artes",
    "socioemotional": "Educación socioemocional",
    "physical": "Educación física",
}
const materialTypesArr =
{
    "permanent": "Permanente de trabajo",
    "informative": "Informativo",
    "illustrative": "Ilustrativo audiovisual",
    "experimental": "Experimental",
    "technological": "Tecnológico",
}

const add_evaluation = (data) => {
    let activity = []
    let deadTime = []
    data.activities = []
    data.deadTimes = []

    for (let row of activitiesBody.rows) {
        for (let cell of row.cells) {
            const value = cell.innerText
            const field = cell.classList
            activity = { ...activity, [field]: value }
        }
        data.activities.push(activity)
    }

    for (let row of deadTimesBody.rows) {
        for (let cell of row.cells) {
            const value = cell.innerText
            const field = cell.classList
            deadTime = { ...deadTime, [field]: value }
        }
        data.deadTimes.push(deadTime)
    }

    submitButton.disabled = true
    http.post(`${server}/evaluation`, data)
        .then((response) => {
            if (response[0].affectedRows === 1) {
                createNotification('Evaluación guardada correctamente.', 'success')
                clearForm()
                activitiesBody.innerHTML = ''
                deadTimesBody.innerHTML = ''

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

addBtn.addEventListener('click', () => {
    const kidName = document.createElement('input')
    const adjustment = document.createElement('input')
    const btn = document.createElement('a')

    kidName.type = 'text'
    kidName.classList = 'form-control my-1 kids'
    kidName.placeholder = 'Nombre del niño'

    adjustment.type = 'text'
    adjustment.classList = 'form-control my-1 adjustments'
    adjustment.placeholder = 'Ajuste'

    btn.classList = 'delete my-1'
    btn.innerHTML = '&times;'
    btn.addEventListener('click', (e) => {
        e.target.parentElement.remove()
    })

    const flex = document.createElement('div')
    flex.className = 'input-row'
    input.appendChild(flex)

    flex.appendChild(kidName)
    flex.appendChild(adjustment)
    flex.appendChild(btn)
})

formActivity.addEventListener('submit', (e) => {
    e.preventDefault()

    const modalBackdrops = document.getElementsByClassName('modal-backdrop')
    const kids = document.querySelectorAll('.kids')
    const adjustments = document.querySelectorAll('.adjustments')
    const pemc = document.querySelector('input[name="pemc"]:checked')
    const socialEmotionalWork = document.querySelector('input[name="social-emotional-work"]:checked')
    const students_involved = document.querySelector('input[name="students_involved"]:checked')
    const students_role = document.querySelector('input[name="students_role"]:checked')
    const priorKnowledgeChecked = document.querySelector('input[name="prior_knowledge_form"]:checked')
    const linkedFields = Array.from(document.querySelectorAll('[name="linked-fields"]:checked'))
    const materialTypes = Array.from(document.querySelectorAll('[name="material_type"]:checked'))

    let linkedFieldList = '', materialTypeList = '', kidsArray = [], adjustmentsArray = []
    let materialRow = 'Sin material'
    let priorKnowledgeRow = 'No'
    let adjustmentsRow = ''

    if (startTime.value != '' && endTime.value != '' && startTime.value > endTime.value) {
        createNotification('La hora de inicio no puede ser mayor a la hora de cierre.', 'warning')
        startTime.value = 0
        startTime.focus()
        return
    }

    for (const key in kids) {
        if (Object.hasOwnProperty.call(kids, key)) {
            const kid = kids[key]
            kidsArray.push(kid.value)
        }
    }

    for (const key in adjustments) {
        if (Object.hasOwnProperty.call(adjustments, key)) {
            const adjustment = adjustments[key]
            adjustmentsArray.push(adjustment.value)
        }
    }

    kidsArray.forEach((kid, i) => {
        adjustmentsRow += `
        <small><strong>${kidsArray[i]}</strong></small>
        <br>
        <small>${adjustmentsArray[i]}</small>
        <hr class="divider">
        `
    })

    if (linkedFields.length === 0) {
        createNotification('Seleccione al menos un campo o área vinculada a la actividad.', 'warning')
        return
    }

    linkedFields.map(linkedField => {
        linkedFieldList += `
            <li>${linkedFieldsArr[linkedField.value]}</li>
        `
    })

    if (material[0].checked) {

        if (materialTypes.length === 0) {
            createNotification('Seleccione al menos un tipo de material.', 'warning')
            return
        }

        materialRow = 'Con material'
        materialTypes.map(materialType => {
            materialTypeList += `
                <li>${materialTypesArr[materialType.value]}</li>
            `
        })
    }

    if (priorKnowledge[0].checked) {
        priorKnowledgeRow = 'Sí'
        priorKnowledgeRow = `
        ${priorKnowledgeRow}
        <hr class="divider">
        ${priorKnowledgeChecked.value}
        `
    }

    addActivityModal.classList.remove('show')
    addActivityModal.setAttribute('aria-hidden', 'true')
    addActivityModal.setAttribute('style', 'display: none')

    document.body.removeChild(modalBackdrops[0])
    activitiesBody.innerHTML += `
    <tr>
        <td class="activity_name">
            <small>${activityName.value}</small>
        </td>
        <td class="description">
            <small>${description.value}</small>
        </td>
        <td class="start_time">
            <small>${startTime.value}</small>
        </td>
        <td class="linked_fields">
            <small>
                <ul class="custom-list">
                    ${linkedFieldList}
                </ul>
            </small>
        </td>
        <td class="reasonable_adjustments">
            ${adjustmentsRow}
        </td>
        <td class="pemc">
            <small>${pemc.value}</small>
        </td>
        <td class="social_emotional_work">
            <small>${socialEmotionalWork.value}</small>
        </td>
        <td class="students_involved">
            <small>${students_involved.value}</small>
        </td>
        <td class="students_role">
            <small>${students_role.value}</small>
        </td>
        <td class="prior_knowledge">
            <small>${priorKnowledgeRow}</small>
        </td>
        <td class="material">
            <small>${materialRow}</small>
        </td>
        <td class="material_type">
            <small>
                <ul class="custom-list">
                    ${materialTypeList}
                </ul>
            </small>
        </td>
        <td class="recommendations">
            <small>${recommendations.value}</small>
        </td>
        <td class="end_time">
            <small>${endTime.value}</small>
        </td>
    </tr>
    `

    formActivity.reset()
    activitiesTable.classList.remove('d-none')
    createNotification('Actividad agregada.', 'success')
})


formDeadTime.addEventListener('submit', e => {
    const deadTimeStart = document.querySelector('#dead-time-start')
    const deadTimeEnd = document.querySelector('#dead-time-end')
    const docentActivity = document.querySelector('#docent_activity')
    const modalBackdrops = document.getElementsByClassName('modal-backdrop')

    e.preventDefault()

    if (deadTimeStart.value != '' && deadTimeEnd.value != '' && deadTimeStart.value > deadTimeEnd.value) {
        createNotification('La hora de inicio de tiempo muerto no puede ser mayor a la hora de fin.', 'warning')
        deadTimeStart.value = 0
        deadTimeStart.focus()
        return
    }

    addDeadTimeModal.classList.remove('show')
    addDeadTimeModal.setAttribute('aria-hidden', 'true')
    addDeadTimeModal.setAttribute('style', 'display: none')


    document.body.removeChild(modalBackdrops[0])
    deadTimesBody.innerHTML += `
    <tr>
        <td class="start">
            <small>${deadTimeStart.value}</small>
        </td>
        <td class="end">
            <small>${deadTimeEnd.value}</small>
        </td>
        <td class="docent_activity">
            <small>${docentActivity.value}</small>
        </td>
    </tr>
    `

    formDeadTime.reset()
    deadTimeTable.classList.remove('d-none')
    createNotification('Tiempo muerto agregado.', 'success')
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

triggerModal.addEventListener('click', () => {
    activityName.value = ''
    description.value = ''
    recommendations.value = ''
    startTime.value = ''
    input.innerHTML = ''

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
    endTime.value = ''
})

form.addEventListener('submit', (e) => {
    e.preventDefault()

    const formData = new FormData(form)
    let data = {}
    for (let pair of formData.entries())
        data[pair[0]] = pair[1]

    // if (data.dead_time == 'Sí') {
    //     data.total_dead_time = ((deadTimeEnd.value.split(':')[0] * 60) + deadTimeEnd.value.split(':')[1]) - ((deadTimeStart.value.split(':')[0] * 60) + deadTimeStart.value.split(':')[1])
    // }

    data.teacher_id = teacher_id
    data.director_id = getUserID()

    add_evaluation(data)
})

getTeacherData()
