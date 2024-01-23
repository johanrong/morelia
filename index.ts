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

// Parser
function Parse(toks: string[]) {
    let output: string[] = []
    
    for (let i = 0; i < toks.length; i++) {
        const t = toks[i]
        
        if (t.includes(BaseToken.Identifier)) { // this has to be redone in someway because it thought it through and i dont want to write it in a comment
            if (toks[i + 1] === BaseToken.Equals) {
                // handle variable assignment
                output.push(IRToken.Assign + ":" + TokenPart(t)[1])
                i++
            }
            
            if (toks[i + 1] === BaseToken.OpenParen) {
                // TODO: parse function declarations and calls

                let args: string
                
                let hasArgs = false
                let isDeclaration = false

                const openParenIndex = i + 1
                let closeParenIndex
                let openCurlyIndex // will be undefined if it is a function call rather than declaration
                let closeCurlyIndex // will be undefined if it is a function call rather than declaration

                // loop over the tokens to find the indices for important symbols
                for (let j = i + 1; j < toks.length; j++) {
                    if (toks[j] === BaseToken.CloseParen) { 
                        closeParenIndex = j
                    }
                    
                    if (toks[j] === BaseToken.OpenCurly) {
                        openCurlyIndex = j
                        isDeclaration = true
                    }
                    
                    if (toks[j] === BaseToken.CloseCurly)
                        closeCurlyIndex = j
                }
                
                if (openParenIndex + 1 !== closeParenIndex)
                    hasArgs = true

                if (closeParenIndex === undefined) {
                    console.error("morelia: function call/declaration does not have a closing parenthesis")
                    process.exit(1)
                }
                
                if (hasArgs) {
                    console.log("has args")
                    // parse arguments
                    args = "" // initializing args because it is undefined at default
                    
                    // make a for loop that starts at openParenIndex and goes until closeParenIndex that does parsing stuff on the arguments thingies.
                    for (let arg = openParenIndex + 1; arg < closeParenIndex; arg++) {
                        if (toks[arg] === BaseToken.Comma) {
                            args += ","
                        }
                        
                        args += toks[arg]
                    }
                    
                    if (args.split(" ").length > 1) {
                        console.error("morelia: function call/declaration contains two arguments, but no comma separator")
                        process.exit(1)
                    }
                    
                    console.log(args)
                }
                
                if (isDeclaration) {
                    // handle function declaration
                    //output.push(IRToken.Declare + ":" + )
                } else {
                    // handle function call
                    output.push(IRToken.Function + ":" + TokenPart(t)[1]) // TODO: push arguments if there are any
                }
            }
            
            // identifier is being used as variable
            //output.push(IRToken.Variable + ":" + TokenPart(t)[1])
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
const source: string = 'x = 25\nprint(x)'
const tokens= Tokenize(source)
console.log(tokens)
const ir = Parse(tokens)
console.log(ir)
//const output = Generate(ir)

// write output to file
//console.log(output)