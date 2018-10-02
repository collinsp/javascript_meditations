///////////////////////////////////////////////////////////////////////////////
/////// Destructuring /////////////////////////////////////////////////////////
let someObj = { apple:1, banana:2, cherry:3, date:4, egg:5 }  // example object
let apple = someObj.apple, egg = someObj.egg  // manually destruct without fancy new syntax
let { apple, egg } = someObj  // destructure with new syntax, new vars match property names

let { apple:a, egg:e } = someObj  // initialize new variables "a" and "e"
console.log([a,e])

// another example
function getData() {
  return { dataMsg: 'OK', dataRecs: [1,2,3,4,5], otherdata: "" }
}
let { dataMsg:msg, dataRecs:recs } = getData()
if (recs.length > 0) {
  console.log(msg)
}

// another example of using destructuring inside a function signature to unwrap an object argument
function printReport( { show, filter, sort, limit } ) {
  console.log([show,filter,sort,limit])
}
printReport({ show:['fname'], filter:'activeUsers', foofoo:'this gets ignored' })

// destructuring with default values
function printReport( { show=['fname','lname'], filter='activeUsers', sort='lname', limit=100 } ) {
  console.log([show,filter,sort,limit])
}

// notice the differences
printReport({ show:['fname'],                  }) // filter is "activeUsers"
printReport({ show:['fname'], filter:undefined }) // filter is "activeUsers"
printReport({ show:['fname'], filter:null,     }) // filter is null
printReport({ show:['fname'], filter:"",       }) // filter is ""
