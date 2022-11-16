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
const dead_time = document.getElementsByName('dead_time')
const congruent = document.getElementsByName('congruent')
const promotes_situated_learning = document.getElementsByName('promotes_situated_learning')
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
            response.forEach(activity => {
                activity.start_time = formatTime(activity.start_time)
                activity.end_date = formatTime(activity.end_date)

                activities_body.innerHTML += `
                <tr>
                    <td class="activity_name">
                        <small>${activity.activity_name}</small>
                    </td>
                    <td class="start_time">
                        <small>${activity.start_time}</small>
                    </td>
                    <td class="linked_fields">
                        <small>${activity.linked_fields}</small>
                    </td>
                    <td class="specific_kid">
                        <small>${activity.specific_kid}</small>
                    </td>
                    <td class="group_learning">
                        <small>${activity.group_learning}</small>
                    </td>
                    <td class="end_date">
                        <small>${activity.end_date}</small>
                    </td>
                    <td class="pemc">
                        <small>${activity.pemc}</small>
                    </td>
                    <td class="social_emotional_work">
                        <small>${activity.social_emotional_work}</small>
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
            checkRadio(dead_time, response.dead_time)
            checkRadio(congruent, response.congruent)
            checkRadio(promotes_situated_learning, response.promotes_situated_learning)
            feedback.value = response.feedback
            getActivities()
        })
        .catch((err) => {
            console.error(err)
            createNotification('Ocurrió un error, favor de intentar más tarde.', 'error')
        })
}

getEvaluation()