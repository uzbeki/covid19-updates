// document.addEventListener('DOMContentLoaded', changePeriodRange, false);

let url = "https://api.covid19api.com/countries"

let selectCountryTag = document.querySelector("#country")
let slug = "uzbekistan"
const fromDate = picker.options.startDate
const toDate = picker.options.endDate
let fromPicked = new Date(picker.options.element.value).toISOString()
let toPicked = new Date(picker.options.elementEnd.value).toISOString()

// by country all status request
// api link - https://api.covid19api.com/country/south-africa?from=2020-03-01T00:00:00Z&to=2020-04-01T00:00:00Z
let countryDataLink = `https://api.covid19api.com/country/${slug}?from=${fromDate}&to=${toDate}`
let countryDates = [] //labels
let countryConfirmed = []
let countryActive = []
let countryRecovered = []
let countryDeaths = []
const chartData = {
  labels: [],
  datasets: [{
    label: '',
    data: [],
  }]
}


const requestOptions = {
  method: "GET",
  redirect: "follow",
  headers: {
    'Content-Type': 'application/json'
    // 'Content-Type': 'application/x-www-form-urlencoded',
  },
  // body: JSON.stringify(undefined)
};

/* const prepareData = ()=>{
  if (condition) {
    
  } else {
    
  }
} */
const clearChart = () => {
  myBar.data.datasets[0].data = []
  myBar.data.datasets[1].data = []

  myBar.data.labels = []
  countryDates = [] //labels
  countryConfirmed = []
  countryActive = []
  countryRecovered = []
  countryDeaths = []
  myBar.update()
}

const addData = (label, dataset) => {

  for (const i in label) {
    const a = label[i];
    myBar.data.labels.push(a)


  }
  for (const i in dataset) {
    const a = dataset[i];
    myBar.data.datasets[0].data.push(a)
    myBar.data.datasets[1].data.push(a)

  }
  myBar.update();
}

function createChart() {
  var ctx = document.getElementById("covid19").getContext('2d');

  window.myBar = new Chart(ctx, {
    type: 'bar',

    // The data for my covid19 dataset
    data: {
      // labels: ['03/15', '03/25', '04/4', '04/14', '04/24', '05/04', '05/14', '05/24', '06/03', '06/13', '06/23', '07/03', '07/13', '07/23', '08/04'],
      labels: countryDates,
      // labels: state.date,
      // datasets: [dataContent]
      datasets: [{
        label: 'Total Cases',
        type: 'bar',
        backgroundColor: '',
        hoverBackgroundColor: '',
        // data: state.confirmed,
        data: countryConfirmed,
        // yAxisID: "Y",
        // xAxisID: "X",

      },
      {
        label: 'Line Dataset',
        data: countryConfirmed,
        backgroundColor: '#242424',
        fill: false,
        // hoverBackgroundColor:  ,
        // Changes this dataset to become a line
        type: 'line'
      }],


    },

    // Configuration options go here
    options: {
      // devicePixelRatio: 1.5
      tooltips: {
        // mode: 'point', 

      },
      layout: {
        padding: {
          left: 20,
          right: 10,
          top: 10,
          bottom: 10
        }
      },
      legend: { //label text
        display: true,
        labels: {
          // fontColor: 'rgb(255, 99, 132)',
          fontSize: 16,
          boxWidth: 40, //colored box width
          fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
          padding: 10,
          usePointStyle: true,//makes box circle
        },
        position: 'top',
        align: 'right',

      },
      title: {
        display: true,
        text: ""
      }
    }
  });
  window.myBar.update()




}

const changePeriodRange = () => {
  let fromPicked = new Date(picker.options.element.value).toISOString()
  let toPicked = new Date(picker.options.elementEnd.value).toISOString()
  countryDataLink = `https://api.covid19api.com/country/${slug}?from=${fromPicked}&to=${toPicked}`
  let message = `Period Changed from ${fromPicked} to ${toPicked}`
  console.log(message)



}
const statusChange = () => {
  // checks the status and updates info based on that
  let statusTag = document.getElementById("status")
  let chosen = statusTag.options[statusTag.selectedIndex].value

  myBar.options.title.text = statusTag.options[statusTag.selectedIndex].label
  // chosen status name will reflect dataset label as well:
  myBar.data.datasets[0].label = "Bar view"
  myBar.data.datasets[1].label = "Line view"
  if (chosen == 'total') {
    myBar.data.datasets[0]['backgroundColor'] = "#4285f4"
    myBar.data.datasets[1]['backgroundColor'] = "#de425b"
    myBar.data.datasets[0]['hoverBackgroundColor'] = "#de425b"
    myBar.data.datasets[1]['hoverBackgroundColor'] = "#4285f4"



    addData(countryDates, countryConfirmed)


  }
  else if (chosen == 'recovered') {

    myBar.data.datasets[0]['backgroundColor'] = "#178665"
    myBar.data.datasets[0]['hoverBackgroundColor'] = "#de425b"
    myBar.data.datasets[1]['backgroundColor'] = "#de425b"
    myBar.data.datasets[1]['hoverBackgroundColor'] = "#178665"

    addData(countryDates, countryRecovered)

  }
  else if (chosen == 'active') {

    // chartBg = ""
    myBar.data.datasets[0]['backgroundColor'] = "#DE2424"
    myBar.data.datasets[0]['hoverBackgroundColor'] = "#4285f4"
    myBar.data.datasets[1]['backgroundColor'] = "##4285f4"
    myBar.data.datasets[1]['hoverBackgroundColor'] = "#DE2424"
    addData(countryDates, countryActive)
  }
  else {

    myBar.data.datasets[0]['backgroundColor'] = "#242424"
    myBar.data.datasets[0]['hoverBackgroundColor'] = "#de425b"
    myBar.data.datasets[1]['backgroundColor'] = "#242424"
    myBar.data.datasets[1]['hoverBackgroundColor'] = "#de425b"
    addData(countryDates, countryDeaths)
  }


}

const altGrabData = (l) => {
  fetch(l, requestOptions)
    .then((res) => res.json())
    .then((data) => {
      console.log("Accessing alternative API...", l)
      clearChart()
      for (const i in data) {
        const ok = data[i]
        dates = ok.Date.slice(5, 10)
        countryDates.push(dates)
        countryConfirmed.push(ok.Confirmed)
        countryActive.push(ok.Active)
        countryRecovered.push(ok.Recovered)
        countryDeaths.push(ok.Deaths)

      }

      // console.log(countryDates)
      /*      console.log(countryDeaths)
      console.log(countryRecovered)
      console.log(countryActive)
      console.log(countryConfirmed) */
      statusChange()
    })
}


const grabData = (link) => {
  fetch(link, requestOptions)
    .then((res) => res.json())
    .then((data) => {
      clearChart()
      // console.log(data)
      if (data[0].Date.slice(5, 10) == data[1].Date.slice(5, 10)) {
        console.log("fixing this messedup API...")
        
        // let l = `https://api.covid19api.com/total/country/${slug}?from=${fromPicked}&to=${toPicked}`
        altGrabData(`https://api.covid19api.com/total/country/${slug}?from=${new Date(picker.options.element.value).toISOString()}&to=${new Date(picker.options.elementEnd.value).toISOString()}`)
        
      } else {

        for (const i in data) {
          const ok = data[i]
          dates = ok.Date.slice(5, 10)
          countryDates.push(dates)
          countryConfirmed.push(ok.Confirmed)
          countryActive.push(ok.Active)
          countryRecovered.push(ok.Recovered)
          countryDeaths.push(ok.Deaths)

        }
      }
      // console.log(countryDates)
      /*      console.log(countryDeaths)
      console.log(countryRecovered)
      console.log(countryActive)
      console.log(countryConfirmed) */
      statusChange()
    })
}

const changeCountry = () => {
  // clear data 
  clearChart()
  // grabs the new country slug and updates the api link
  slug = selectCountryTag.options[selectCountryTag.selectedIndex].value
  changePeriodRange()
  // console.log(countryDataLink)
  //check the chosen period
  // statusChange()
  grabData(countryDataLink)



}



// fetching country names from the API database



window.onload = function start() {
  fetch(url, requestOptions)
    .then((res) => res.json())
    .then((data) => {
      let selector = document.getElementById('country')

      for (const i in data) {

        const opt = document.createElement("option")
        opt.id = "countryOption"
        const country = data[i].Country
        const slug = data[i].Slug
        opt.appendChild(document.createTextNode(country))
        opt.value = slug
        opt.classList.add("countries")
        selector.appendChild(opt)
        if (slug == "uzbekistan") {
          opt.setAttribute("selected", "")
        }

      }
      createChart()
      changeCountry()
      // console.log(data)
    })
    .catch((error) => console.log("error", error))
}

