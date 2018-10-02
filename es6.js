///////////////////////////////////////////////////////////////////////////////
/////// Strict Mode ///////////////////////////////////////////////////////////
// place at top of file or in functions to reduce undeclared vars and more
"use strict"


///////////////////////////////////////////////////////////////////////////////
/////// String Trim ///////////////////////////////////////////////////////////
" apple ".trim() == "apple"


///////////////////////////////////////////////////////////////////////////////
/////// Optional ";" Gottchas /////////////////////////////////////////////////
function foo() {
  return
    5;
}
foo();    // returns undefined!!!!!

// while it's rare to start a new line with a parenthesis that does not follow
// an operator of some sort, it can result in an error
{ let x = '1,2,3'
  (x.split(',')).forEach(function(v){ console.log(v) })
}
// ERROR: Uncaught ReferenceError: x is not defined
// lines which start with a ( can be parsed as function arguments if previous
// statement does not end with an operator of some sort
// make sure you end the previous statement with a ';'
{ let x = '1,2,3';
  (x.split(',')).forEach(function(v){ console.log(v) })
}


/////// Block Scope! //////////////////////////////////////////////////////////
// use block scope variable initializers "let" and "const"
// instead of the weird function scoped "var"
// GOTCHA: old Apple devices may not support let and const
function f(x) {
  var rv = 7
  if (x > 30) {
    var rv = 1
  }
  return rv
}
console.log( f(50) ) // returns 1

// most languages use block scope variables
function f(x) {
  let rv = 7
  if (x > 30) {
    let rv = 1
  }
  return rv
}
console.log( f(50) ) // returns 7


///////////////////////////////////////////////////////////////////////////////
/////// Array Iterators ////////////////////////////////////////////////////////

// traditional iterate over array
let ar = [1,2,3]
for (let i=0, l=ar.length; i<l; ++i) {
  let e = ar[i]
  console.log(e)
}

// or use forEach - warning break and continue do not work this is also less efficient!
ar.forEach(function(e) {
  console.log(e)
})

// or use new for..of syntax
for (let e of ar) {
  console.log(e)
}

// for..of is for arrays
// WARNING! do not confuse it with for..in iterator over object properties
let o = { a:1,b:2 }
for (let p in o) {
  console.log(p + ':' + o[k])
}

///////////////////////////////////////////////////////////////////////////////
/////// Function Default Args /////////////////////////////////////////////////
function foofoo( a=1, b=2, c=3, d=4 ) {
  console.log([a,b,c,d])
}
foofoo()
foofoo(7,null,9)

///////////////////////////////////////////////////////////////////////////////
/////// Spread Operator ///////////////////////////////////////////////////////
function f(x, y, ...z) { console.log([x,y,z]) }
f(1,2,3,4,5,6)
{ let x = [1,2,3]
  let y = [...x,4,5,6]
  console.log(x,y)
}


///////////////////////////////////////////////////////////////////////////////
/////// Template Literals /////////////////////////////////////////////////////
{ let a=1, b=[1,2,3], c = { a:'hi' }, d=()=>{ return "bye" }
  let x = `template literal strings can contain multi-line text
You can also embed data with \${ expression }
a    is ${ a    } 
b[1] is ${ b[1] }
c.a  is ${ c.a  }
d()  is ${ d()  }`
  console.log(x)
}
