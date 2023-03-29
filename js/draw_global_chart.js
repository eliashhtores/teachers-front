const url = new URL(window.location.href)
const teacherID = url.searchParams.get('teacher_id')
const chart = url.searchParams.get('chart')
const querySchoolCycle = url.searchParams.get('school_cycle')
const title = document.querySelector('#title')
const form = document.querySelector('form')
const ctx = document.getElementById('myChart')
const not_found = document.querySelector('#not-found')
const director_id = getUserID()
const teacherName = document.querySelector('#teacher_name')
const schoolCycle = document.querySelector('#school_cycle')
let myChart

const drawChart = (ctx, data, type) => {
    if (myChart !== undefined) {
        myChart.destroy()
    }

    let config = {}

    if (chart === 'global_time') {
        data[0] === undefined ? data[0] = 0 : data[0]

        config = {
            type: type,
            data: {
                datasets: [
                    {
                        label: 'Maestras con tiempos muertos registrados',
                        data: [data[0].count, data[0].total - data[0].count],
                        backgroundColor: ['rgba(233, 30, 99, 0.5)', 'rgba(33, 150, 243, 0.5)'],
                    },
                ],
                labels: ['Maestras con tiempos muertos registrados', 'Maestras sin tiempos muertos registrados'],
            },
            options: {
                responsive: true,
            },
        }
    } else if (chart === 'global_students') {
        config = {
            type: type,
            data: {
                datasets: [
                    {
                        label: 'Alumnos involucrados',
                        data: [parseInt([data[0].all]), parseInt([data[0].more_than_half]), parseInt([data[0].half]), parseInt([data[0].less_than_half]), parseInt([data[0].none])],
                        backgroundColor: [
                            'rgb(54, 162, 235, 0.5)',
                            'rgb(75, 192, 192, 0.5)',
                            'rgb(255, 205, 86, 0.5)',
                            'rgb(255, 159, 64, 0.5)',
                            'rgb(255, 99, 132, 0.5)',
                        ],
                        borderColor: [
                            'rgb(54, 162, 235)',
                            'rgb(75, 192, 192)',
                            'rgb(255, 205, 86)',
                            'rgb(255, 159, 64)',
                            'rgb(255, 99, 132)',
                        ],
                        borderWidth: 1
                    }
                ],
                labels: ['Todos', 'Más de la mitad', 'La mitad', 'Menos de la mitad', 'Ninguno'],
            },
            options: {
                responsive: true,
            },
        }
    }
    else if (chart === 'global_material') {
        config = {
            type: type,
            data: {
                datasets: [
                    {
                        label: 'Tipo de material',
                        data: [parseInt([data[0].audiovisual]), parseInt([data[0].experimental]), parseInt([data[0].illustrative]), parseInt([data[0].informative]), parseInt([data[0].permanent]), parseInt([data[0].technological])],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.5)',
                            'rgba(255, 159, 64, 0.5)',
                            'rgba(255, 205, 86, 0.5)',
                            'rgba(75, 192, 192, 0.5)',
                            'rgba(54, 162, 235, 0.5)',
                            'rgba(153, 102, 255, 0.5)',
                            'rgba(201, 203, 207, 0.5)',
                            'rgba(54, 162, 235, 0.5)',
                        ],
                        borderColor: [
                            'rgb(255, 99, 132)',
                            'rgb(255, 159, 64)',
                            'rgb(255, 205, 86)',
                            'rgb(75, 192, 192)',
                            'rgb(54, 162, 235)',
                            'rgb(153, 102, 255)',
                            'rgb(201, 203, 207)',
                            'rgb(54, 162, 235)',
                        ],
                        borderWidth: 1
                    }
                ],
                labels: ['Audiovisual', 'Experimental', 'Ilustrativo', 'Informativo', 'Permanente de trabajo', 'Tecnológico']

            },
            options: {
                responsive: true,
            },
        }
    }
    else if (chart === 'pemc') {
        config = {
            type: type,
            data: {
                datasets: [
                    {
                        label: 'Vinculación a PEMC',
                        data: [parseInt([data[0].yes]), parseInt([data[0].no])],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.5)',
                            'rgba(54, 162, 235, 0.5)',
                        ],
                        borderColor: [
                            'rgb(255, 99, 132)',
                            'rgb(54, 162, 235)',
                        ],
                        borderWidth: 1
                    }
                ],
                labels: ['Sí', 'No']

            },
            options: {
                responsive: true,
            },
        }
    }

    console.log('Drawing chart...')
    myChart = new Chart(ctx, config)
}

async function setSchoolCycle() {
    schoolCycle.value = querySchoolCycle
}

const getEvaluationData = (chart) => {
    console.log(`Getting evaluation data with schoolCycle.value = ${schoolCycle.value} and chart = ${chart}...`)

    let url = `${server}/evaluation/${chart}/${querySchoolCycle}/${director_id}`

    if (schoolCycle.value !== '')
        url = `${server}/evaluation/${chart}/${schoolCycle.value}/${director_id}`

    http.get(`${url}`)
        .then((response) => {
            if (response.status == 500) {
                console.error(response.message)
                createNotification('Ocurrió un error, favor de intentar más tarde.', 'error')
                return
            }

            if (response.status == 404 || response[0].total == 0) {
                createNotification('Sin datos en la fecha seleccionada.', 'warning')
                if (myChart !== undefined)
                    myChart.destroy()
                return
            }

            drawChart(ctx, response, type)

        })
        .catch((err) => {
            console.error(err)
            createNotification('Ocurrió un error, favor de intentar más tarde.', 'error')
            return
        })
}

const setChartFormat = (chart) => {
    console.log('Setting chart title...')
    let chartType = ''

    switch (chart) {
        case 'global_time':
            chartType = 'Maestras con tiempos muertos registrados'
            break
        case 'global_students':
            chartType = 'Alumnos involucrados'
            break
        case 'global_material':
            chartType = 'Tipo de material'
            break
        default:
            chartType = 'Vinculación a PEMC'
    }

    title.innerHTML = chartType
    type = 'bar'
    getEvaluationData(chart)
}

form.addEventListener('submit', (e) => {
    console.log('Form submitted, redrawing chart data...')
    setChartFormat(chart)
    e.preventDefault()
})

const populateSchoolCycles = () => {
    http.get(`${server}/evaluation/school_cycles/get/${director_id}`)
        .then(async (response) => {
            if (response.status === 404) {
                not_found.classList.remove('d-none')
                submit_btn.disabled = true
                return
            }
            not_found.classList.add('d-none')
            school_cycle.innerHTML = ''
            response.forEach((cycle) => {
                school_cycle.innerHTML += `
            <option value="${cycle.school_cycle}">${cycle.school_cycle}</option>
            `
            })
            await setSchoolCycle()
        })
        .catch((err) => {
            console.error(err)
            createNotification('Ocurrió un error, favor de intentar más tarde.', 'error')
        })
}

populateSchoolCycles()
setChartFormat(chart)