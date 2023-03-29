const url = new URL(window.location.href)
const teacherID = url.searchParams.get('teacher_id')
const chart = url.searchParams.get('chart')
const queryDate = url.searchParams.get('date')
const title = document.querySelector('#title')
const form = document.querySelector('form')
const date = document.querySelector('#date')
const ctx = document.getElementById('myChart')
const directorID = getUserID()
const teacherName = document.querySelector('#teacher_name')
let myChart

const getTeacherData = () => {
    // const school = document.querySelector('#school')
    // const grade = document.querySelector('#grade')
    // const letter = document.querySelector('#letter')
    // const total_students = document.querySelector('#total_students')

    http.get(`${server}/teacher/${teacherID}/${directorID}`)
        .then((response) => {
            // if (response.status == 500) {
            //     console.error(response.message)
            //     createNotification('Ocurrió un error, favor de intentar más tarde.', 'error')
            //     return
            // }
            teacherName.innerHTML = response.name
        })
        .catch((err) => {
            console.error(err)
            createNotification('Ocurrió un error, favor de intentar más tarde.', 'error')
            return
        })
}

const drawChart = (ctx, data, type) => {
    if (myChart !== undefined) {
        myChart.destroy()
    }

    let config

    if (chart === 'time') {
        config = {
            type: type,
            data: {
                datasets: [
                    {
                        data: [data, 180],
                        backgroundColor: ['rgba(233, 30, 99, 0.5)', 'rgba(33, 150, 243, 0.5)'],
                    },
                ],
                labels: ['Tiempo muerto', 'Tiempo total'],
            },
            options: {
                responsive: true,
            },
        }
    } else if (chart === 'students') {
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
    else {
        console.log(data)
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
    console.log('Drawing chart...')
    myChart = new Chart(ctx, config)
}

const setDate = (queryDate) => date.value = queryDate

const getEvaluationData = (chart) => {
    console.log(`Getting evaluation data with teacherID = ${teacherID} and chart = ${chart}...`)
    http.get(`${server}/evaluation/${teacherID}/${chart}/${date.value}/${directorID}`)
        .then((response) => {
            if (response.status == 500) {
                console.error(response.message)
                createNotification('Ocurrió un error, favor de intentar más tarde.', 'error')
                return
            }

            if (response.status == 404 || response[0].total == 0 || response[0].total == null) {
                createNotification('Sin datos en la fecha seleccionada.', 'warning')
                if (myChart !== undefined)
                    myChart.destroy()
                return
            }

            if (chart === 'time') {
                drawChart(ctx, response[0].total, type)
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

const setChartTitle = (chart) => {
    console.log('Setting chart title...')
    let chartType = ''

    if (chart === 'time') {
        chartType = 'Tiempos muertos en minutos'
        type = 'pie'
    } else if (chart === 'students') {
        chartType = 'Alumnos involucrados'
        type = 'bar'
    } else {
        chartType = 'Tipo de material'
        type = 'bar'
    }

    title.innerHTML = chartType
    getEvaluationData(chart)
}

form.addEventListener('submit', (e) => {
    console.log('Form submitted, redrawing chart data...')
    setChartTitle(chart)
    e.preventDefault()
})

setDate(queryDate)
setChartTitle(chart)
getTeacherData()
