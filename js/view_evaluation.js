const url = new URL(window.location.href)
const id = url.searchParams.get('id')
const school = document.querySelector('#school')
const teacher_name = document.querySelector('#teacher_name')
const date = document.querySelector('#date')
const school_cycle = document.querySelector('#school_cycle')
const name = document.querySelector('#name')
const current_grade = document.querySelector('#current_grade')
const current_letter = document.querySelector('#current_letter')
const total_students = document.querySelector('#total_students')
const attendance = document.querySelector('#attendance')
const complete = document.querySelector('#complete')
const incomplete = document.querySelector('#incomplete')
const institution_organization = document.getElementsByName('institution_organization')
const visit_type = document.getElementsByName('visit_type')
const description = document.querySelector('#description')
const recommendations = document.querySelector('#recommendations')
const students_involved = document.getElementsByName('students_involved')
const students_role = document.getElementsByName('students_role')
const prior_knowledge = document.getElementsByName('prior_knowledge')
const prior_knowledge_form = document.getElementsByName('prior_knowledge_form')
const situated_learning = document.getElementsByName('situated_learning')
const material = document.getElementsByName('material')
const material_type = document.getElementsByName('material_type')
const deadTime = document.getElementsByName('dead_time')
const startTimeDead = document.querySelector('#start-time-dead')
const endTimeDead = document.querySelector('#end-time-dead')
const docentActivity = document.querySelector('#docent_activity')
const congruent = document.getElementsByName('congruent')
const promotesSituatedLearning = document.getElementsByName('promotes_situated_learning')
const feedback = document.querySelector('#feedback')
const activities_body = document.querySelector('#activities_body')

const formatTime = (time) => {
    return time.split(":").slice(0, -1).join(':')
}

const checkRadio = (radioButtons, responseValue) => {
    for (const checkbox of radioButtons) {
        if (responseValue == checkbox.value) {
            checkbox.checked = true
            break
        }
    }
}

const getActivities = () => {
    http.get(`${server}/activity/evaluation/${id}`)
        .then((response) => {
            activities_body.innerHTML = ''

            response.forEach(async (activity) => {
                const linkedFields = await getLinkedFields(activity.id)
                const reasonableAdjustments = await getReasonableAdjustments(activity.id)
                const materialTypes = await getMaterialTypes(activity.id)
                let linkedFieldsRow = ''
                let reasonableAdjustmentsRow = ''
                let materialTypesRow = ''

                linkedFields.forEach(linkedField => {
                    linkedFieldsRow += `
                        <li>
                            ${linkedField.field}
                        </li>
                    `
                })

                reasonableAdjustments.forEach(reasonableAdjustment => {
                    reasonableAdjustmentsRow += `
                        <strong>${reasonableAdjustment.kid}</strong>
                        <br>
                        ${reasonableAdjustment.adjustment}
                        <hr class="divider">
                    `
                })

                materialTypes.forEach(materialType => {
                    materialTypesRow += `
                        <li>
                            ${materialType.material}
                        </li>
                    `
                })

                activity.start_time = formatTime(activity.start_time)
                activity.end_time = formatTime(activity.end_time)
                activities_body.innerHTML += `
                <tr>
                    <td class="activity_name">
                        <small>${activity.activity_name}</small>
                    </td>
                    <td class="start_time">
                        <small>${activity.start_time}</small>
                    </td>
                    <td class="linked_fields">
                        <small>
                        <ul class="custom-list">
                            ${linkedFieldsRow}
                        </ul>
                        </small>
                    </td>
                    <td class="reasonable_adjustments">
                        <small>${reasonableAdjustmentsRow}</small>
                    </td>
                    <td class="pemc">
                        <small>${activity.pemc}</small>
                    </td>
                    <td class="social_emotional_work">
                        <small>${activity.social_emotional_work}</small>
                    </td>
                    <td class="students_involved">
                        <small>${activity.students_involved}</small>    
                    </td>
                    <td class="students_role">
                        <small>${activity.students_role}</small>
                    </td>
                    <td class="prior_knowledge">
                        <small>${activity.prior_knowledge.replace('\n', '<br>')}</small>
                    </td>
                    <td class="material">
                        <small>${activity.material}</small>
                    </td>
                    <td class="material_type">
                        <small>
                        <ul class="custom-list">
                            ${materialTypesRow}
                        </ul>
                        </small>
                    </td>

                    <td class="end_time">
                        <small>${activity.end_time}</small>
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

async function getLinkedFields(activity_id) {
    try {
        const response = await fetch(`${server}/linked_field/activity/${activity_id}`, {})
        const json = await response.json()
        return json
    } catch (error) {
        console.error(error)
        createNotification('Ocurrió un error, favor de intentar más tarde.', 'error')
    }
}

async function getReasonableAdjustments(activity_id) {
    try {
        const response = await fetch(`${server}/reasonable_adjustment/activity/${activity_id}`, {})
        const json = await response.json()
        return json
    } catch (error) {
        console.error(error)
        createNotification('Ocurrió un error, favor de intentar más tarde.', 'error')
    }
}

async function getMaterialTypes(activity_id) {
    try {
        const response = await fetch(`${server}/material_type/activity/${activity_id}`, {})
        const json = await response.json()
        return json
    } catch (error) {
        console.error(error)
        createNotification('Ocurrió un error, favor de intentar más tarde.', 'error')
    }
}


const getEvaluation = () => {
    http.get(`${server}/evaluation/${id}`)
        .then((response) => {
            school.value = response.school
            date.value = formatDate(response.created_at)
            school_cycle.value = response.school_cycle
            name.value = response.name
            current_grade.value = response.current_grade
            current_letter.value = response.current_letter
            total_students.value = response.total_students
            attendance.value = response.attendance
            checkRadio(institution_organization, response.institution_organization)
            checkRadio(visit_type, response.visit_type)
            description.value = response.description
            recommendations.value = response.recommendations
            checkRadio(students_involved, response.students_involved)
            checkRadio(students_role, response.students_role)
            checkRadio(prior_knowledge, response.prior_knowledge)
            checkRadio(prior_knowledge_form, response.prior_knowledge_form)
            checkRadio(situated_learning, response.situated_learning)
            checkRadio(material, response.material)
            checkRadio(material_type, response.material_type)
            checkRadio(deadTime, response.dead_time)
            startTimeDead.value = response.start_time_dead
            endTimeDead.value = response.end_time_dead
            docentActivity.value = response.docent_activity
            checkRadio(congruent, response.congruent)
            checkRadio(promotesSituatedLearning, response.promotes_situated_learning)
            feedback.value = response.feedback
            getActivities()
        })
        .catch((err) => {
            console.error(err)
            createNotification('Ocurrió un error, favor de intentar más tarde.', 'error')
        })
}

getEvaluation()