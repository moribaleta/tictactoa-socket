
/*let promise1 = new Promise((resolve, reject) => {
  resolve(1)
  //reject("help")
})

let promise2 = new Promise((resolve, reject) => {
  //reject("help")
  resolve(2)
})

console.log(2)

promise1.then((res) => {
  console.log(res)
  return funcPromise(res)
}).then(res => {
  console.log(res)
}).catch((err) => {
  console.log(err)
})


function funcPromise(val) {
  return new Promise((resolve, reject) => {
    resolve("help me ->" + val)
  })
}*/


let promise = new Promise(
  (resolve, reject) =>{ 
  resolve(Math.random())
})
  
  promise.then((res) => {
    console.log(res)
    return funcTosscoin(res)
  }).then(res => {
    console.log(res)
  }).catch((err) =>{
    console.log(err)
  })


function funcTosscoin(random){
  let promise1 = new Promise((resolve, reject)=> { 
    if(random>0.5){
        resolve()
    }else{
        resolve("tails")
    }
  })
  return promise1
}