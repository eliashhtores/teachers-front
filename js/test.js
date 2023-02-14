const url = new URL(window.location.href)
const teacherID = url.searchParams.get('teacher_id')
const title = document.querySelector('#title')

const setTitle = () => {
    if (chart === 'time') {

        new Chart(document.getElementById("pie_chart"), getChartJs('pie'))
    }
    if (chart === 'students') {

        new Chart(document.getElementById("bar_chart"), getChartJs('bar'))
    }
}
chart = 'students'
setTitle()

// $(function () {
//     new Chart(document.getElementById("radar_chart").getContext("2d"), getChartJs('radar'))
//     new Chart(document.getElementById("line_chart").getContext("2d"), getChartJs('line'))
// })

function getChartJs(type) {
    var config = null

    if (type === 'line' && chart === 'students') {
        config = {
            type: 'line',
            data: {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],

                datasets: [
                    {
                        label: 'My First dataset',
                        data: [68, 55, 75, 86, 47, 52, 36],
                        borderColor: 'rgba(33, 150, 243, 1)',
                        backgroundColor: 'rgba(33, 150, 243, 0.2)',
                        pointBorderColor: 'rgba(33, 150, 243, 1)',
                        pointBackgroundColor: 'rgba(255, 255, 255, 1)',
                        pointBorderWidth: 1,
                    },
                    {
                        label: 'My Second dataset',
                        data: [28, 48, 40, 19, 86, 27, 90],
                        borderColor: 'rgba(30, 208, 133, 1)',
                        backgroundColor: 'rgba(30, 208, 133, 0.2)',
                        pointBorderColor: 'rgba(30, 208, 133, 1)',
                        pointBackgroundColor: 'rgba(255, 255, 255, 1)',
                        pointBorderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                legend: false,
            },
        }
    } else if (type === 'bar' && chart === 'students') {
        config = {
            type: 'bar',
            data: {
                datasets: [
                    {
                        label: 'Todos',
                        data: [3, 0, 2, 3, 5],
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
                legend: false,
            },
        }
    } else if (type === 'radar') {
        config = {
            type: 'radar',
            data: {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [
                    {
                        label: 'My First dataset',
                        data: [48, 25, 95, 75, 64, 58, 54],
                        borderColor: 'rgba(33, 150, 243, 1)',
                        backgroundColor: 'rgba(33, 150, 243, 0.2)',
                        pointBorderColor: 'rgba(33, 150, 243, 1)',
                        pointBackgroundColor: 'rgba(255, 255, 255, 1)',
                        pointBorderWidth: 1,
                    },
                    {
                        label: 'My Second dataset',
                        data: [82, 54, 25, 65, 47, 21, 95],
                        borderColor: 'rgba(30, 208, 133, 1)',
                        backgroundColor: 'rgba(30, 208, 133, 0.2)',
                        pointBorderColor: 'rgba(30, 208, 133, 1)',
                        pointBackgroundColor: 'rgba(255, 255, 255, 1)',
                        pointBorderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
                legend: false,
            },
        }
    } else if (type === 'pie' && chart === 'time') {
        config = {
            type: 'pie',
            data: {
                datasets: [
                    {
                        data: [30, 80],
                        backgroundColor: ['rgba(233, 30, 99, 1)', 'rgba(33, 150, 243, 1)'],
                    },
                ],
                labels: ['Tiempo muerto', 'Tiempo total'],
            },
            options: {
                responsive: true,
                legend: false,
            },
        }
    }
    return config
}