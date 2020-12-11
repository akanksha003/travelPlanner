import http from 'k6/http'
import { parseHTML } from 'k6/html'
import { check, sleep } from 'k6'
import { Counter, Rate } from 'k6/metrics'
let url = `http://localhost:3000/home/saveItinerary`
let url4 = `http://localhost:3000/home/getItineraries`
let url1 = `http://localhost:3000/auth/createUser`
let url2 = `http://localhost:3000/auth/login`
/*export const options = {
  scenarios: {
    example_scenario: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '10s', target: 100 },
        { duration: '10s', target: 500 },
        {duration: '10s', target: 100},
        {duration: '10s', target: 0},
      ],
      gracefulRampDown: '0s',
    },
  },
}*/
  export const options = {
   scenarios: {
     example_scenario: {
       executor: 'constant-vus',
       vus: 200,
       duration: '10s',
     },
   },
 }

 function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

 function CreateUserANDLoginANDPOST(){


  let myemail = `${__VU}@gmail.com`
  console.log('cur vu email: ' + myemail)
  let req1 = {email: myemail, password: '123' }

  let req = req1
   var payload = JSON.stringify(req)
   var params = {
    headers: {
      'Content-Type': 'application/json',
     },
   }

   //sign up
  //recordRates(http.post(url1, payload, params))
   //console.log(resp.body)
   /*let resp = http.post(url1, payload, params)
   check(resp, { 'Signup OK': r => r.status == 200 })*/

   //login
  //recordRates(http.post(url2, payload, params))
  let resp2 = http.post(url2, payload, params)
   //console.log('login related info: ' + resp2.body)
   check(resp2, {'Login OK': r => r.status == 200 })

   //sleep(Math.random() * 3)
   //posting
   let req3 = {
    itinerary:{
      date: '2020-12-08',
      schedule: [
        {type: 'departure', name: 'ucla', address: 'ucla', coordinates: ' 34.0689° N, 118.4452° W', departure: '09:00'},
        {type: 'trip', transportation: 'bus', duration: 70, cost: 32.23},
        {type: 'stop', name: 'ucb', address: 'ucb', coordinates: ' 34.0689° N, 118.4452° W ', arrival: '10:10', departure: '10:20', duration: 10},
        {type: 'trip', transportation: 'bus', duration: 80, cost: 1233},
        {type: 'stop', name: 'usc', address: 'usc', coordinates: ' 34.0689° N, 118.4452° W ', arrival: '11:40', departure: '11:50', duration: 10},
        {type: 'trip', transportation: 'bus', duration: 50, cost: 23},
        {type: 'stop', name: 'ucsd', address: 'ucsd', coordinates: ' 34.0689° N, 118.4452° W ', arrival: '12:40', departure: '12:50', duration: 10},
        {type: 'trip', transportation: 'bus', duration: 80, cost: 2134},
        {type: 'arrival', name: 'uci', address: 'uci', coordinates: '  34.0689° N, 118.4452° W', arrival: '14:10'}
      ]
    }
  }

  var payload3 = JSON.stringify(req3)
   var params3 = {
    headers: {
      'Content-Type': 'application/json',
     },
   }

   let resp3 = http.post(url, payload3, params3)
   //console.log('post request info: ' + resp3.body)
   check(resp3, { 'POST ITINERARY OK': r => r.status == 200 })

   //recordRates(http.post(url, payload3, params3))

   //sleep(Math.random() * 3)

   let resp4 = http.post(url4, params3)
   //let resp4 = http.get(`http://localhost:3000/app/lectures`)
   //console.log(resp4.body)
   check(resp4, { 'GET ITINERARY OK': r => r.status == 200 })

   //recordRates(http.get(`http://localhost:3000/app/lectures`))
   //recordRates(http.post(url4, params3))

 }



export default function () {
  // recordRates(
  // const resp = http.post(
  //   'http://localhost:3000/graphql',
  //   '{"operationName":"AnswerSurveyQuestion","variables":{"input":{"answer":"🤗","questionId":1}},"query":"mutation AnswerSurveyQuestion($input: SurveyInput!) {\\n  answerSurvey(input: $input)\\n}\\n"}',
  //   {
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   }
  // )

  CreateUserANDLoginANDPOST()
  sleep(Math.random() * 3)
}

const count200 = new Counter('status_code_2xx')
const count300 = new Counter('status_code_3xx')
const count400 = new Counter('status_code_4xx')
const count500 = new Counter('status_code_5xx')

const rate200 = new Rate('rate_status_code_2xx')
const rate300 = new Rate('rate_status_code_3xx')
const rate400 = new Rate('rate_status_code_4xx')
const rate500 = new Rate('rate_status_code_5xx')

function recordRates(res) {
  if (res.status >= 200 && res.status < 300) {
    count200.add(1)
    rate200.add(1)
  } else if (res.status >= 300 && res.status < 400) {
    console.log(res.body)
    count300.add(1)
    rate300.add(1)
  } else if (res.status >= 400 && res.status < 500) {
    count400.add(1)
    rate400.add(1)
  } else if (res.status >= 500 && res.status < 600) {
    count500.add(1)
    rate500.add(1)
  }
}