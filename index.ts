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

    Integer = "Integer",
    Float = "Float",
    String = "String",
    Identifier = "Identifier",
}

// Intermediate Representation tokens for Parser
enum IRToken {}

// Tokenizer/Lexer
function Tokenize(input: string) {
    let output: string[] = []
    let array = input.split("")
    
    for (let i = 0; i < array.length; i++) {
        const c = array[i]

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

            for (j; j < array.length; j++) {
                if (/^[0-9]+$/.test(array[j]) || array[j] === ".") {
                    result += array[j]
                } else {
                    break
                }
            }

            i += j - i

            if (result.includes(".")) output.push(BaseToken.Float + ":" + result)
            else output.push(BaseToken.Integer + ":" + result)
        } else if (c === '"') {
            let result = ""
            let j = i + 1
            
            for (j; j < array.length; j++) {
                if (array[j] !== '"') {
                    result += array[j]
                } else {
                    break
                }
            }
            
            i += j - i
            output.push(BaseToken.String + ":" + result)
        } else if (/^[a-zA-Z_]+$/.test(c)) {
            let result = ""
            let j = i

            for (j; j < array.length; j++) {
                if (/^[a-zA-Z0-9_]+$/.test(array[j])) {
                    result += array[j]
                } else {
                    break
                }
            }

            i += j - i - 1
            output.push(BaseToken.Identifier + ":" + result)
        } else if (c === " ") { // ignore
            console.info("ignoring whitespace")
        } else if (c === "\n") { // ignore
            console.info("ignoring line feed")
        } else if (c === "\r") { // ignore
            console.info("ignoring carriage return")
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
function Parse(tokens: string[]) {}

// Code generator
function Generate(ir: string[]) {}

// Make the input things and stuff
const source = 'fun add(x, y) {\nreturn x + y\n}'
const tokens= Tokenize(source)
console.log(tokens)
//const ir = Parse(tokens)
//const output = Generate(ir)

// write output to file
//console.log(output)