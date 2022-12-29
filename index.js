import './codegeneration/ErrorListener.js'
import './codegeneration/PythonGenerator.js'

import ECMAScriptLexer from './lib/ECMAScriptLexer.js'
import ECMAScriptParser from './lib/ECMAScriptParser.js'
import antlr4 from 'antlr4'

const input = '{x: new Number(1)}'

const chars = new antlr4.InputStream(input)
const lexer = new ECMAScriptLexer.ECMAScriptLexer(chars)

lexer.strictMode = false // do not use js strictMode

const tokens = new antlr4.CommonTokenStream(lexer)
const parser = new ECMAScriptParser.ECMAScriptParser(tokens)
const listener = new ErrorListener()

// Do this after creating the parser and before running it
parser.removeErrorListeners() // Remove default ConsoleErrorListener
parser.addErrorListener(listener) // Add custom error listener

console.log('JavaScript input:')
console.log(input)
console.log('Python output:')

try {
  const tree = parser.expressionSequence()
  const output = new PythonGenerator().start(tree)

  console.log(output)

  // console.log(tree.toStringTree(parser.ruleNames));
} catch (error) {
  console.log(error)
}
