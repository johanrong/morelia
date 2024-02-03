// Morelia -> Python Transpiler

import * as fs from "node:fs"
import * as child_process from "node:child_process";
import * as os from "node:os";

// Base tokens for Lexer/Tokenizer

enum BaseToken {
    Equals = "Equals",
    Greater = "Greater",
    Not = "Not",
    Less = "Less",
    Plus = "Plus",
    Minus = "Minus",
    Asterisk = "Asterisk",
    Slash = "Slash",
    Period = "Period",
    Comma = "Comma",
    Colon = "Colon",
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

// TODO: rewrite the tokens that come out of the parser to almost python code

// Intermediate Representation tokens for Parser
enum IRToken {
    Newline = "Newline",
    Outdent = "Outdent",
    Indent = "Indent",
}

function TokenPart(string: string) {
    if (string === undefined) {
        return ""
    }
    
    if (!string.includes(":")) {
        return [string]
    }
    
    return [string.substring(0, string.indexOf(":")), string.substring(string.indexOf(":") + 1)]
}

function indent(indents: number) {
    return " ".repeat(indents)
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
        } else if (c === "!") {
            output.push(BaseToken.Not)
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
        } else if (c === ":") {
            output.push(BaseToken.Colon)
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
            let result = "'"
            let j = i + 1
            
            for (j; j < chars.length; j++) {
                if (chars[j] !== '"') {
                    result += chars[j]
                } else {
                    result += "'"
                    break
                }
            }
            
            i += j - i
            output.push(BaseToken.String + ":" + result)
        } else if (/^[a-zA-Z_]+$/.test(c)) {
            let result = ""
            let j = i

            for (j; j < chars.length; j++) {
                if (/^[a-zA-Z0-9_]+$/.test(chars[j]) || chars[j] === ".") {
                    result += chars[j]
                } else {
                    break
                }
            }

            i += j - i - 1
            output.push(BaseToken.Identifier + ":" + result)
        } else if (c === " ") { // ignore
        } else if (c === "#") {
            let j = i
            
            for (j; j < chars.length; j++) {
                if (chars[j] === "\n") {
                    break
                }
            }
            
            i += j - i
            output.push(BaseToken.Newline)
        } else if (c === "\n") { // ignore
            output.push(BaseToken.Newline)
        } else if (c === "\r") { // ignore
            if (chars[i + 1] && chars[i + 1] !== "\n")
                output.push(BaseToken.Newline)
        } else if (c === ";") { // ignore
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
    
    let openCurly = 0
    
    for (let i = 0; i < toks.length; i++) {
        const t = toks[i]

        if (TokenPart(t)[0] === BaseToken.Equals) {
            output.push("=")
        } else if (TokenPart(t)[0] === BaseToken.Not) {
            output.push("!")
        } else if (TokenPart(t)[0] === BaseToken.Comma) {
            output.push(",")
        } else if (TokenPart(t)[0] === BaseToken.Colon) {
            output.push(":")
        } else if (TokenPart(t)[0] === BaseToken.Identifier) {
            // check if identifier matches a keyword

            if (TokenPart(t)[1] === "import") {
                if (toks[i + 1] && TokenPart(toks[i + 1])[0] === BaseToken.Identifier) {
                    //output.push(IRToken.Import + ";" + toks[i + 1])
                    output.push(`import ${TokenPart(toks[i + 1])[1]}`)
                } else {
                    console.error("morelia: import requires valid identifier")
                    process.exit(1)
                }

                i++ // eat the source_path
            } else if (TokenPart(t)[1] === "from") {
                if (toks[i + 1] && TokenPart(toks[i + 1])[0] === BaseToken.Identifier) {
                    if (toks[i + 2] && TokenPart(toks[i + 2])[0] === BaseToken.Identifier && TokenPart(toks[i + 2])[1] === "import") {
                        if (toks[i + 3] && TokenPart(toks[i + 3])[0] === BaseToken.Identifier) {
                            //output.push(IRToken.From + ";" + toks[i + 1] + ":" + IRToken.Import + ";" + toks[i + 3])
                            output.push(`from ${TokenPart(toks[i + 1])[1]} import ${TokenPart(toks[i + 3])[1]}`)
                        } else {
                            console.error("morelia: import requires valid identifier")
                            process.exit(1)
                        }
                    } else {
                        console.error("morelia: from requires import")
                        process.exit(1)
                    }
                } else {
                    console.error("morelia: from requires valid identifier")
                    process.exit(1)
                }

                i += 3 // eat the source_path, import and import source_path
            } else if (TokenPart(t)[1] === "for") {
            } else if (TokenPart(t)[1] === "if") {
                let j = i + 1
                let foundOpenCurly = false
                let firstIndex = undefined

                for (j; j < toks.length; j++) {
                    if (TokenPart(toks[j])[0] === BaseToken.Newline) {
                        break
                    }

                    if (TokenPart(toks[j])[0] === BaseToken.OpenCurly) {
                        if (openCurly !== j) {
                            foundOpenCurly = true
                            openCurly = j
                            break
                        }
                    }
                }

                if (!foundOpenCurly) {
                    console.error("morelia: invalid if statement, missing opening curly brace")
                    process.exit(1)
                }

                output.push("if ")
            } else if (TokenPart(t)[1] === "elif") {
                // parse elseif
                let j = i + 1
                let foundOpenCurly = false
                
                for (j; j < toks.length; j++) {
                    if (TokenPart(toks[j])[0] === BaseToken.Newline) {
                        break
                    }
                    
                    if (TokenPart(toks[j])[0] === BaseToken.OpenCurly) {
                        if (openCurly !== j) {
                            foundOpenCurly = true
                            openCurly = j
                            break
                        }
                    }
                }
                
                if (!foundOpenCurly) {
                    console.error("morelia: invalid elseif statement, missing opening curly brace")
                    process.exit(1)
                }
                
                output.push("elif ")
            } else if (TokenPart(t)[1] === "else") {
                let j = i + 1
                let foundOpenCurly = false
                
                for (j; j < toks.length; j++) {
                    if (TokenPart(toks[j])[0] === BaseToken.Newline) {
                        break
                    }
                    
                    if (TokenPart(toks[j])[0] === BaseToken.OpenCurly) {
                        if (openCurly !== j) {
                            foundOpenCurly = true
                            openCurly = j
                            break
                        }
                    }
                }
                
                if (!foundOpenCurly) {
                    console.error("morelia: invalid else statement, missing opening curly brace")
                    process.exit(1)
                }
                
                output.push("else")
            } else if (TokenPart(t)[1] === "return") {
                output.push("return ")
            } else if (TokenPart(t)[1] === "while") {
                let j = i + 1
                let foundOpenCurly = false
                
                for (j; j < toks.length; j++) {
                    if (TokenPart(toks[j])[0] === BaseToken.Newline) {
                        break
                    }

                    if (TokenPart(toks[j])[0] === BaseToken.OpenCurly) {
                        if (openCurly !== j) {
                            foundOpenCurly = true
                            openCurly = j
                            break
                        }
                    }
                }
                
                if (!foundOpenCurly) {
                    console.error("morelia: invalid while statement, missing opening curly brace")
                    process.exit(1)
                }
                
                output.push("while ")
            } else {
                let j = i + 1
                let foundOpenCurly = false
                for (j; j < toks.length; j++) {
                    if (TokenPart(toks[j])[0] === BaseToken.Newline) {
                        break
                    }
                    
                    if (TokenPart(toks[j])[0] === BaseToken.OpenCurly) {
                        if (openCurly !== j) {
                            foundOpenCurly = true
                            openCurly = j
                            break
                        }
                    }
                }
                
                if (foundOpenCurly) {
                    output.push(`def ${TokenPart(t)[1]}`)
                } else {
                    output.push(TokenPart(t)[1])
                }
            }
        } else if (TokenPart(t)[0] === BaseToken.Plus) {
            output.push("+")
        } else if (TokenPart(t)[0] === BaseToken.Minus) {
            output.push("-")
        } else if (TokenPart(t)[0] === BaseToken.Asterisk) {
            output.push("*")
        } else if (TokenPart(t)[0] === BaseToken.Slash) {
            output.push("/")
        } else if (TokenPart(t)[0] === BaseToken.Greater) {
            output.push(">")
        } else if (TokenPart(t)[0] === BaseToken.Less) {
            output.push("<")
        } else if (TokenPart(t)[0] === BaseToken.Integer) {
            output.push(TokenPart(t)[1])
        } else if (TokenPart(t)[0] === BaseToken.Float) {
            if (!TokenPart(t)[1].includes(".")) {
                console.error("morelia: float does not include a period. (should not be possible)")
                process.exit(1)
            }
            
            if (TokenPart(t)[1].split(".").length - 1 !== 1) {
                console.error("morelia: float contains multiple periods")
                process.exit(1)
            }
            
            output.push(TokenPart(t)[1])
        } else if (TokenPart(t)[0] === BaseToken.String) {
            let str = TokenPart(t)[1].split("")
            if (str[str.length - 1] !== "'") {
                console.log(str[str.length - 1])
                console.error(`morelia: string does not end with a quote: ${str.join("")}`)
                process.exit(1)
            }

            output.push(TokenPart(t)[1])
        } else if (TokenPart(t)[0] === BaseToken.OpenBracket) {
            // check for closing bracket
            let j = i
            let foundCloseBracket = false
            
            for (j; j < toks.length; j++) {
                if (TokenPart(toks[j])[0] === BaseToken.CloseBracket) {
                    foundCloseBracket = true
                    break
                }
            }
            
            if (!foundCloseBracket) {
                console.error("morelia: invalid list, missing closing bracket")
                process.exit(1)
            }
            
            output.push("[")
        } else if (TokenPart(t)[0] === BaseToken.CloseBracket) {
            output.push("]")
        } else if (TokenPart(t)[0] === BaseToken.Period) {
            output.push(".")
        } else if (TokenPart(t)[0] === BaseToken.OpenParen) {
            output.push("(")
        } else if (TokenPart(t)[0] === BaseToken.CloseParen) {
            output.push(")")
        } else if (TokenPart(t)[0] === BaseToken.OpenCurly) {
            output.push(IRToken.Indent)
        } else if (TokenPart(t)[0] === BaseToken.CloseCurly) {
            output.push(IRToken.Outdent)
            output.push(IRToken.Newline)
        } else if (TokenPart(t)[0] === BaseToken.Newline) {
            if (TokenPart(toks[i - 1])[0] !== BaseToken.Newline && toks[i + 1] !== BaseToken.CloseCurly) { // so there wont be too many newlines
                output.push(IRToken.Newline)
            }
        } else {
            console.error("morelia: unparsed token found in parser: " + t)
            process.exit(1)
        }
    }
    
    return output
}

// Code generator
function Generate(ir: string[]) {
    let output = ""
    let indents = 0
    
    for (let i = 0; i < ir.length; i++) {
        let t = ir[i]
        
        if (t === IRToken.Newline) {
            output += "\n"
            output += indent(indents)
        } else if (t === IRToken.Indent) {
            indents += 4
            output += ":"
        } else if (t === IRToken.Outdent) {
            if (indents - 4 >= 0) {
                indents -= 4
            } else {
                console.error("morelia: indent count became negative (too many closing curly braces)")
                process.exit(1)
            }
        } else {
            output += t
        }
    }
    
    return output
}

const argv = process.argv.slice(2)

if (argv.length < 1) {
    // TODO: implement repl
    console.error("morelia: repl not implemented yet")
    process.exit(1)
}

let source_path = ""

let debugging = false

if (argv[1] === "--debug") {
    debugging = true
    source_path = argv[0]
} else if (argv[2] === "--debug") {
    debugging = true
    source_path = argv[0]
} else {
    source_path = argv[0]
}

if (!fs.existsSync(source_path)) {
    console.error(`morelia: file does not exist: "${source_path}"`)
    process.exit(1)
}

const source = fs.readFileSync(source_path).toString()
const tokens= Tokenize(source)
if (debugging) console.log("*From lexer*\n", tokens)

const ir = Parse(tokens)
if (debugging) console.log("*From parser*\n", ir)

const output = Generate(ir)
if (debugging) console.log("*From codegen*\n", output)

if (!fs.existsSync(os.homedir() + "/morelia")) {
    fs.mkdirSync(os.homedir() + "/morelia")
}

const temp_output = os.homedir() + "/morelia/temp.py"
fs.writeFileSync(temp_output, output)

if (debugging) console.log("*From output*")
if (os.platform() === "linux") {
    child_process.spawnSync(`python3`, [temp_output], { stdio: 'inherit' })
} else if (os.platform() === "win32" || os.platform() === "darwin") {
    child_process.spawnSync(`python`, [temp_output], { stdio: 'inherit' })
} else {
    console.error("morelia: operating system not supported.")
    process.exit(1)
}
