import { error as SyntaxGenericError } from '../error/helper'
import antlr4 from 'antlr4'
import path from 'path'

export default class ErrorListener extends antlr4.error.ErrorListener {
  syntaxError (recognizer, symbol, line, column, message, payload) {
    throw new SyntaxGenericError({ line, column, message })
  }
}
