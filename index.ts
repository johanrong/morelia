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

// TODO: rewrite the tokens that come out of the parser to almost python code

// Intermediate Representation tokens for Parser
enum IRToken {
    Newline = "Newline",
    Outdent = "Outdent",
    Indent = "Indent",
}

function TokenPart(string: string) {
    return string.split(":")
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
            let result = '"'
            let j = i + 1
            
            for (j; j < chars.length; j++) {
                if (chars[j] !== '"') {
                    result += chars[j]
                } else {
                    result += '"'
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
        } else if (c === "@") {
            let result = ""
            let j = i + 1

            for (j; j < chars.length; j++) {
                if (/^[a-zA-Z0-9_]+$/.test(chars[j]) || chars[j] === ".") {
                    result += chars[j]
                } else {
                    break
                }
            }

            i += j - i - 1
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
    
    let openCurly = 0
    
    for (let i = 0; i < toks.length; i++) {
        const t = toks[i]

        if (TokenPart(t)[0] === BaseToken.Equals) {
            if (toks[i + 1] && TokenPart(toks[i + 1])[0] == BaseToken.Equals) {
                // found double equals
                output.push("==")
            } else {
                output.push("=")
            }
        } else if (TokenPart(t)[0] === BaseToken.Comma) {
            output.push(",")
        } else if (TokenPart(t)[0] === BaseToken.Identifier) {
            // check if identifier matches a keyword

            if (TokenPart(t)[1] === "import") {
                if (toks[i + 1] && TokenPart(toks[i + 1])[0] === BaseToken.Path) {
                    //output.push(IRToken.Import + ";" + toks[i + 1])
                    output.push(`import ${TokenPart(toks[i + 1])[1]}`)
                } else {
                    console.error("morelia: import requires valid path")
                    process.exit(1)
                }

                i++ // eat the path
            } else if (TokenPart(t)[1] === "from") {
                if (toks[i + 1] && TokenPart(toks[i + 1])[0] === BaseToken.Path) {
                    if (toks[i + 2] && TokenPart(toks[i + 2])[0] === BaseToken.Identifier && TokenPart(toks[i + 2])[1] === "import") {
                        if (toks[i + 3] && TokenPart(toks[i + 3])[0] === BaseToken.Path) {
                            //output.push(IRToken.From + ";" + toks[i + 1] + ":" + IRToken.Import + ";" + toks[i + 3])
                            output.push(`from ${TokenPart(toks[i + 1])[1]} import ${TokenPart(toks[i + 3])[1]}`)
                        } else {
                            console.log("morelia: import requires valid path")
                        }
                    } else {
                        console.error("morelia: from requires import")
                        process.exit(1)
                    }
                } else {
                    console.error("morelia: from requires valid path")
                    process.exit(1)
                }

                i += 3 // eat the path, import and import path
            } else if (TokenPart(t)[1] === "while") {
            } else if (TokenPart(t)[1] === "for") {
            } else if (TokenPart(t)[1] === "if") {
            } else if (TokenPart(t)[1] === "return") {
                //output.push(IRToken.Return)
                output.push("return ")
            } else {
                let j = i + 1
                let foundOpenCurly = false
                for (j; j < toks.length; j++) {
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
        } else if (TokenPart(t)[0] === BaseToken.Integer) {
            output.push(TokenPart(t)[1])
        } else if (TokenPart(t)[0] === BaseToken.Float) {
            if (!TokenPart(t)[1].includes(".")) {
                console.error("morelia: float does not include a period. (should not be possible)")
                process.exit(1)
            }
            
            if (TokenPart(t)[1].split(".").length - 1 !== 1) {
                console.error("morelia: float contains multiple periods.")
                process.exit(1)
            }
            
            output.push(TokenPart(t)[1])
        } else if (TokenPart(t)[0] === BaseToken.String) {
            if (!TokenPart(t)[1].startsWith("\"")) {
                console.error("morelia: string does not start with a quotation mark")
                process.exit(1)
            }

            if (!TokenPart(t)[1].endsWith("\"")) {
                console.error("morelia: string does not end with a quotation mark")
                process.exit(1)
            }

            output.push(TokenPart(t)[1])
        } else if (TokenPart(t)[0] === BaseToken.Path) {
            output.push(TokenPart(t)[1])
        } else if (TokenPart(t)[0] === BaseToken.OpenParen) {
            output.push("(")
        } else if (TokenPart(t)[0] === BaseToken.CloseParen) {
            output.push(")")
        } else if (TokenPart(t)[0] === BaseToken.OpenCurly) {
            output.push(IRToken.Indent)
        } else if (TokenPart(t)[0] === BaseToken.CloseCurly) {
            output.push(IRToken.Outdent)
        } else if (TokenPart(t)[0] === BaseToken.Newline) {
            if (TokenPart(toks[i - 1])[0] !== BaseToken.Newline) { // so there wont be to many newlines
                output.push(IRToken.Newline)
            }
        } else {
            console.log("morelia: unparsed token found in parser: " + t)
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

// Make the input things and stuff
//const source: string = 'from @math import @pi'
const source = Bun.file("test.mrl").text()
const tokens= Tokenize(await source)
console.log(tokens)
const ir = Parse(tokens)
console.log(ir)
const output = Generate(ir)
console.log(output)