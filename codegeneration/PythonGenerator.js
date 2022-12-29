import '../lib/ECMAScriptVisitor.js'

import path from 'path'

const { SemanticArgumentCountMismatchError } = require(path.resolve(
  'error',
  'helper'
))

export default class PythonGenerator extends ECMAScriptVisitor {
  start (ctx) {
    return this.visitExpressionSequence(ctx)
  }

  visitChildren (ctx) {
    let code = ''

    for (let i = 0; i < ctx.getChildCount(); i++) {
      code += this.visit(ctx.getChild(i))
    }

    return code.trim()
  }

  visitTerminal (ctx) {
    return ctx.getText()
  }

  visitPropertyExpressionAssignment (ctx) {
    const key = this.visit(ctx.propertyName()) // ctx.getChild(0)
    const value = this.visit(ctx.singleExpression()) // ctx.getChild(2)

    return `'${key}': ${value}`
  }

  visitNewExpression (ctx) {
    return this.visit(ctx.singleExpression())
  }

  visitNumberExpression (ctx) {
    const argumentList = ctx.arguments().argumentList()

    if (argumentList === null || argumentList.getChildCount() !== 1) {
      throw new SemanticArgumentCountMismatchError()
    }

    const arg = argumentList.singleExpression()[0]
    const number = this.removeQuotes(this.visit(arg))

    return `int(${number})`
  }

  removeQuotes (str) {
    let newStr = str

    if (
      (str.charAt(0) === '"' && str.charAt(str.length - 1) === '"') ||
      (str.charAt(0) === "'" && str.charAt(str.length - 1) === "'")
    ) {
      newStr = str.substr(1, str.length - 2)
    }

    return newStr
  }
}
