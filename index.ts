// Morelia -> Python Transpiler

// Base tokens for Lexer/Tokenizer
import * as constants from "constants";

enum BaseToken {
    Equals = "Equals",
    Greater = "Grater",
    Less = "Less",
    Plus = "Plus",
    Minus = "Minus",
    Asterisk = "Asterisk",
    Slash = "Slash",
    Period = "Period",
    Comma = "Comma",
    OpenParen = "OpenParen",
    CloseParen = "CloseParen",
    OpenCurly = "OpenCurly",
    CloseCurly = "CloseCurly",
    OpenBracket = "OpenBracket",
    CloseBracket = "CloseBracket",
    Newline = "Newline",
    
    Integer = "Integer",
    Float = "Float",
    String = "String",
    Path = "Path",
    Identifier = "Identifier",
}

// Intermediate Representation tokens for Parser
enum IRToken {
    Import = "Import",
    From = "From",
    While = "While",
    For = "For",
    If = "If",
    
    Declare = "Declare",
    Assign = "Assign",
    Args = "Args",
    
    Function = "Function",
    Variable = "Variable",
    Integer = "Integer",
    String = "String",
    Float = "Float",
    Path = "Path",
    Newline = "Newline",
}

function TokenPart(string: string) {
    return string.split(":")
}

// Tokenizer/Lexer
function Tokenize(input: string) {
    let output: string[] = []
    const chars = input.split("")
    
    for (let i = 0; i < chars.length; i++) {
        const c = chars[i]

        if (c === "=") {
            output.push(BaseToken.Equals)
        } else if (c === ">") {
            output.push(BaseToken.Greater)
        } else if (c === "<") {
            output.push(BaseToken.Less)
        } else if (c === "+") {
            output.push(BaseToken.Plus)
        } else if (c === "-") {
            output.push(BaseToken.Minus)
        } else if (c === "*") {
            output.push(BaseToken.Asterisk)
        } else if (c === "/") {
            output.push(BaseToken.Slash)
        } else if (c === "(") {
            output.push(BaseToken.OpenParen)
        } else if (c === ")") {
            output.push(BaseToken.CloseParen)
        } else if (c === "{") {
            output.push(BaseToken.OpenCurly)
        } else if (c === "}") {
            output.push(BaseToken.CloseCurly)
        } else if (c === "[") {
            output.push(BaseToken.OpenBracket)
        } else if (c === "]") {
            output.push(BaseToken.CloseBracket)
        } else if (c === ".") {
            output.push(BaseToken.Period)
        } else if (c === ",") {
            output.push(BaseToken.Comma)
        } else if (/^[0-9]$/.test(c)) {
            let result = ""
            let j = i

            for (j; j < chars.length; j++) {
                if (/^[0-9]+$/.test(chars[j]) || chars[j] === ".") {
                    result += chars[j]
                } else {
                    break
                }
            }

            i += j - i - 1

            if (result.includes(".")) output.push(BaseToken.Float + ":" + result)
            else output.push(BaseToken.Integer + ":" + result)
        } else if (c === '"') {
            let result = ""
            let j = i + 1
            
            for (j; j < chars.length; j++) {
                if (chars[j] !== '"') {
                    result += chars[j]
                } else {
                    break
                }
            }
            
            i += j - i
            output.push(BaseToken.String + ":" + result)
        } else if (/^[a-zA-Z_]+$/.test(c)) {
            let result = ""
            let j = i

            for (j; j < chars.length; j++) {
                if (/^[a-zA-Z0-9_]+$/.test(chars[j])) {
                    result += chars[j]
                } else {
                    break
                }
            }

            i += j - i - 1
            output.push(BaseToken.Identifier + ":" + result)
        } else if (c === "^") {
            let result = ""
            let j = i + 2

            for (j; j < chars.length; j++) {
                if (chars[j] !== '"') {
                    result += chars[j]
                } else {
                    break
                }
            }

            i += j - i
            output.push(BaseToken.Path + ":" + result)
        } else if (c === " ") { // ignore
            console.info("ignoring whitespace")
        } else if (c === "#") {
            let j = i
            
            for (j; j < chars.length; j++) {
                if (chars[j] === "\n") {
                    break
                }
            }
            
            i += j - i
        } else if (c === "\n") { // ignore
            output.push(BaseToken.Newline)
        } else if (c === "\r") { // ignore
            if (chars[i + 1] && chars[i + 1] !== "\n")
                output.push(BaseToken.Newline)
            else console.info("ignoring carriage return")
        } else if (c === ";") {
            console.info("ignoring semicolon")
        } else {
            console.error("morelia: error: unknown token found during tokenization: " + c);
            process.exit(1);
        }
    }
    
    return output
}

function parseArgs(openParenIndex: number,  closeParenIndex: number, toks: string[]) {
    let args: string[] = []
    let argAmount = 0
    console.log(openParenIndex)
    console.log(closeParenIndex)
    
    for (let i = openParenIndex + 1; i < closeParenIndex; i++) {
        if (toks[i] === BaseToken.Comma) {
            args.push(",")
        } else if (toks[i].includes(BaseToken.Identifier)) {
            if (toks[i + 1] === BaseToken.OpenParen) {
                args.push(IRToken.Function + ":" + TokenPart(toks[i])[1])
            } else {
                args.push(IRToken.Variable + ":" + TokenPart(toks[i])[1])
            }
        } else {
            args.push(toks[i])
        }
        
        argAmount++
    }
    
    return [args.join(""),  argAmount]
}

// Parser
function Parse(toks: string[]) {
    let output: string[] = []
    
    for (let i = 0; i < toks.length; i++) {
        const t = toks[i]
        
        if (t.includes(BaseToken.Identifier)) { // this has to be redone in someway because it thought it through and i dont want to write it in a comment
            let isVariableUsage = false
            let isVariableAssignment = false
            let isFunctionCall = false
            let isFunctionDeclaration = false
            
            let hasArgs = false
            
            let openParenIndex
            let closeParenIndex
            let openCurlyIndex
            let closeCurlyIndex
            
            if (toks[i + 1] === BaseToken.Equals) {
                isVariableAssignment = true
            } if (toks[i + 1] === BaseToken.OpenParen) {
                // the identifier is either a function call or declaration
                
                openParenIndex = i + 1
                if (toks[i + 2] !== BaseToken.CloseParen)
                    hasArgs = true
                
                for (let j = i + 1; j < toks.length; j++) {
                    if (toks[j] === BaseToken.CloseParen)
                        closeParenIndex = j
                    if (toks[j] === BaseToken.OpenCurly)
                        openCurlyIndex = j
                    if (toks[j] === BaseToken.CloseCurly)
                        closeCurlyIndex = j
                }
                
                if (openCurlyIndex) {
                    isFunctionDeclaration = true
                } else {
                    isFunctionCall = true
                }
            } else {
                // the identifier is a variable usage
                isVariableUsage = true
            }
            
            if (isFunctionDeclaration) {
                // parse args
                output.push(IRToken.Declare + ":" + TokenPart(t)[1])
            } else if (isFunctionCall) {
                if (hasArgs) {
                    // @ts-ignore
                    const [args, argAmount] = parseArgs(openParenIndex, closeParenIndex, toks)
                    output.push(IRToken.Function + ":" + TokenPart(t)[1])
                    output.push(IRToken.Args + ":" + args)
                    i += 2 // skip identifier and openParen
                    i += (Number(argAmount))
                    i++ // skip close paren
                } else {
                    i += 2 // skip identifier and openParen
                    output.push(IRToken.Function + ":" + TokenPart(t)[1])
                    i++ // skip closeParen
                }
            } else if (isVariableAssignment) {
                output.push(IRToken.Assign + ":" + TokenPart(t)[1])
                i++
            } else if (isVariableUsage) {
                output.push(IRToken.Variable + ":" + TokenPart(t)[1])
            } else {
                console.error("morelia: something horrible has happened")
            }
            
            // skip indices
        } else if (t.includes(BaseToken.Integer)) {
            // TODO: check if there is something wrong
            
            output.push(IRToken.Integer + ":" + TokenPart(t)[1])
        } else if (t === BaseToken.Newline) {
            output.push(IRToken.Newline)
        } else {
            console.log("unparsed token found in parser: " + t)
        }
    }
    
    return output
}

// Code generator
function Generate(ir: string[]) {}

// Make the input things and stuff
const source: string = 'x = 25\nprint(1, 2, 3, 4)\nprint(x)'
const tokens= Tokenize(source)
console.log(tokens)
const ir = Parse(tokens)
console.log(ir)
//const output = Generate(ir)

// write output to file
//console.log(output)