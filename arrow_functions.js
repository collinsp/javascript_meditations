///////////////////////////////////////////////////////////////////////////////
/////// Arrow Functions ///////////////////////////////////////////////////////
// new way of defining functions that is the same except "this" is lexical
let f
f = function(a,b)    { console.log([a,b]) }
f =         (a,b) => { console.log([a,b]) } // less typing
f =          a    => { console.log([a])   } // () are optional with one arg
f =          a    =>   console.log([a])     // {} are optional if only one statement
f =          ()   =>   console.log('hi')    // no arguments used
f =          _    =>   console.log('hi')    // or use "_" - a common convention to indicate unused variable

// arrow functions handle the "this" reference differently, see example below
function post(url, data, callback) {
  // ... perform io, invoke callback ...
  setTimeout(function(){ callback('ok') }, 1000)
}

class User {
  constructor(name) {
    this.name = name
  }
  save() {
    post('https://foofoo', this.name, function(rv) {
      console.log('save user: ' + this.name + '; rv: ' + rv) // will not work!!!
    })
  }
}

let u = new User('fred')
u.save() // either an error or name is missing because "this" got manipulated on us

// let's do the traditional fix by redefining the save method for the User class
User.prototype.save = function() {
  var this2 = this   // save a copy of "this" so we can use it in the callback
  post('https://foofoo', this.name, function(rv) {
    console.log('save user: ' + this2.name + '; rv: ' + rv)
  })
}
u.save() // outputs: "save user: fred; rv: ok"

// one of the interesting features of using arrow functions is that it protects "this"
// "this" behaves as you think it should
User.prototype.save = function() {
  post('https://foofoo', this.name, rv => {
    console.log('save user: ' + this.name + '; rv: ' + rv)
  })
}
u.save() // outputs: "save user: fred; rv: ok"

// arrow functions CANNOT be used everywhere - consider
User.prototype.getName = () => { console.log(this.name) }
u.getName()  // returns undefined because "this" is not the user object

User.prototype.getName = function() { console.log(this.name) }
u.getName()  // returns "fred"
