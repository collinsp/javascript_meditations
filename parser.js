////////////////////////////////////////////////////////////////////////////////
/////// RegExp stick(y) flag ///////////////////////////////////////////////////
// "y" flag means perform regex from lastIndex property
// This feature makes it much easier to implement parsers. Here's an example of
// parsing a user filter string which could then be used to safely generate a
// SQL where clause.
//
// Usage:
//   rv = parseFilterStr('col1 = 3 AND (col2 contains "foo" OR col3 < 5.0) OR isActive() AND foofoo(1, "ds")')
//   rv = [ {"type":"literalExp","lexp":"col1","op":"=","rexp":"3"},
//            "AND","(",
//          {"type":"literalExp","lexp":"col2","op":"contains","rexp":"foo"},
//            "OR",
//          {"type":"literalExp","lexp":"col3","op":"<","rexp":"5.0"},
//            ")","OR",
//          {"type":"namedFilter","name":"isActive","args":[]},
//            "AND",
//          {"type":"namedFilter","name":"foofoo","args":["1","ds"]} ]
//
let parseFilterStr
{ // define reusable stick(y) patterns
  const space=/\s+/y, comma=/\,\s*/y, leftP=/\(\s*/y, rightP=/\)\s*/y,
    word=/(\w+)\s*/y, namedFilter=/(\w+)\s*\(\s*/y,
    op=/(=|!=|<|<=|>|>=|like|not like|contains|not contains)\s*/yi,
    num=/(\-?(?:\d*\.\d+|\d+))\s*/y, logic=/(and|or)\b\s*/yi,
    sQuoteVal=/'([^']*)'\s*/y, dQuoteVal=/"([^"]*)"\s*/y

  // expose parseFilterStr function
  parseFilterStr=(filterStr="")=>{
    const filterStrLen=filterStr.length // cache, used to determine when done
    const parsedFilter=[]               // array of parsed elements to be returned
    let doneParsing=false               // set by parse() when filterStr parse is complete
    let lastIndex=0                     // char position of filterStr we are currently parsing at
    let pCount=0                        // ensure parenthesis are balanced balance, +1 for open paren, -1 for close

    // if parse error detected, this function is called which throws a real exception
    // the exception object contains a readable error message (msg),
    // at (col index where error was found),
    // and the filter string with a <*> to denote what part of the filter string had the error
    const parseError=(o={})=>{
      if (! o.msg) o.msg='could not parse filter'
      if (! o.at)  o.at=lastIndex
      if (! o.loc) o.loc = filterStr.substr(0,o.at) + '<*>' + filterStr.substr(o.at)
      throw o
    }

    // simple parse util to process a pattern against the filter string
    // also resets lastIndex on each pattern, and handles setting the doneParsing flag
    const parse=(pattern)=>{
      pattern.lastIndex=lastIndex
      let rv=pattern.test(filterStr)
      if (rv) lastIndex=pattern.lastIndex
      if (lastIndex==filterStrLen) doneParsing=true
      return rv
    }
    
    parse(space) // match preceeding whitespace (also sets doneParsing if nothing to parse)
    while (! doneParsing) {
      // parse (
      if (parse(leftP)) {
        parsedFilter.push('(')
        ++pCount
      }
      // parse namedFilterExpressions( withOptionalargs, ..)
      if (parse(namedFilter)) {
        let e = { type: 'namedFilter', name: RegExp.$1, args: [] }
        parsedFilter.push(e)
        while (true) {
          if (parse(sQuoteVal) || parse(dQuoteVal) || parse(num) || parse(word)) {
            e.args.push(RegExp.$1)
            parse(comma)
          } else {
            if (parse(rightP)) break
            parseError({ msg: 'could not parse named filter right parenthesis' }) 
          }
        }
      }
      // parse <leftExpression> <operator> <rightExpression>
      else if (parse(word)) {
        let e = { type: 'literalExp', lexp: RegExp.$1, op: null, rexp: null }
        parsedFilter.push(e)
        if (parse(op)) e.op = RegExp.$1
        else parseError({ msg: 'could not parse operator' })
        if (parse(sQuoteVal) || parse(dQuoteVal) || parse(num) || parse(word)) e.rexp = RegExp.$1
      }
      // if we didn't parse a namedFilter or a literalExp, throw exception
      else parseError()

      // parse )
      if (parse(rightP) && pCount > 0) {
        parsedFilter.push(')')
        --pCount
      }

      // parse logic and/or operator
      if (parse(logic)) parsedFilter.push(RegExp.$1.toUpperCase())
    }

    // add missing right parenthesis
    while (pCount-- > 0) parsedFilter.push(')')

    // return the parsed filter object
    return parsedFilter
  }
}
