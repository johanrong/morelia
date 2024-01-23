#!/usr/bin/env bun

// Morelia -> Python Transpiler

// Base tokens for Lexer/Tokenizer
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
    Function = "Function",
    Variable = "Variable",
    Integer = "Integer",
    String = "String",
    Float = "Float",
    Path = "Path",
}

function TokenPart(string: string) {
    return string.split(":")
}

// Tokenizer/Lexer
function Tokenize(input: string) {
    let output: string[] = []
    let chars = input.split("")
    
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

// Parser
function Parse(toks: string[]) {
    let output: string[] = []
    
    for (let i = 0; i < toks.length; i++) {
        let t = toks[i]
        
        if (t.includes(BaseToken.Identifier)) {
            if (toks[i + 1] === BaseToken.Equals) {
                // handle variable assignment
                output.push(IRToken.Assign + ":" + TokenPart(t)[1])
                i++
            }
            
            /*if (toks[i + 1] === BaseToken.OpenParen) {
                // TODO: handle function declarations
                console.info("function declarations not implemented")
            }*/
            
            // identifier is being used as variable or function call
            //output.push(IRToken.Variable + ":" + TokenPart(t)[1])
        } else if (t.includes(BaseToken.Integer)) {
            // TODO: check if there is something wrong
            
            output.push(IRToken.Integer + ":" + TokenPart(t)[1])
        } else if (t === BaseToken.Newline) {
            
        } else {
            console.log("unparsed token found in parser: " + t)
        }
    }
    
    return output
}

// Code generator
function Generate(ir: string[]) {}

// Make the input things and stuff
const source = 'x = 25\nprint(x)'
const tokens= Tokenize(source)
console.log(tokens)
const ir = Parse(tokens)
console.log(ir)
//const output = Generate(ir)

// write output to file
//console.log(output)