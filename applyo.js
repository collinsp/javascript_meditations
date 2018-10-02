"use strict"

///////////////////////////////////////////////////////////////////////////////
// Function.prototype.applyo - invoke a function with arguments from an object
Function.prototype.applyo=function(_this=null, argObj={}) {
  // parse the arg signature (what arguments would the function like)
  if (! this._applyoSig) {
    const s = this.toString()
    if (/^function[^\(]*\(([^\)]*)/.test(s) ||
        /^\(([^\)]*)/.test(s) || /^(\w+)/.test(s)) {
      this._applyoSig = RegExp.$1
        .trim()
        .split(/\s*\,\s*/)
        .map(n => n.replace(/\=.*/,''))  // strip default vals
    } else {
      throw "could not parse argument signature"
    }
  }

  // build argument array based on the argument signature
  let argAr = this._applyoSig.map(name => {
    let v = argObj[name]
    if (typeof(v)=='function' && v.applyoAutoEval) {
      v = v.apply(v.applyoAutoEvalThis, v.applyoAutoEvalArgs)
    }
    return v
  })

  // call function with its desired arguments
  return this.apply(_this, argAr)
}

/*
// define all possible arguments that can be injected with the applyo method
let args = {}
args.rec = { fname: 'fred', lname: 'joe' }
args.ctx = { userid: 57 }
args.val = 10
args.rows = ()=>{ return [1,2,3] }
args.cb = function(){ return 'cb' }

// example functions with parameter names in args
function f1(rec, ctx) { console.log(rec, ctx) }
function f2(val, ctx) { console.log(val, ctx) }
function f3(rec, val) { console.log(rec, val) }
function f4(ctx)      { console.log(ctx)      }
function f5(rows)     { console.log(rows)     }
function f6(rec=1, foo=2, rows=3) { console.log(rec,foo,rows) }

f1.applyo(null,args)
f2.applyo(null,args)
f3.applyo(null,args)
f4.applyo(null,args)
f5.applyo(null,args)
f6.applyo(null,args)

// auto evaluate function arg with apply
args.rows.applyoAutoEval = true
//args.rows.applyoAutoEvalThis = window
//args.rows.applyoAutoEvalArgs = [1,2,3]
f5.applyo(null,args)   // notice args.rows is auto evaluated
*/
