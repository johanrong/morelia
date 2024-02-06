// Written by Morelia contributors. Licensed under the MIT license. Repository: https://github.com/johanrong/morelia

import { BaseToken, IRToken } from "../misc/enum.ts";
import { splitToken } from "../misc/util.ts";

// parse the tokens into almost python code (intermediate representation)
function parse(toks: string[]) {
    let output: string[] = []

    let openCurly = 0

    for (let i = 0; i < toks.length; i++) {
        const t = toks[i]

        if (splitToken(t)[0] === BaseToken.Equals) {
            output.push("=")
        } else if (splitToken(t)[0] === BaseToken.Not) {
            output.push("!")
        } else if (splitToken(t)[0] === BaseToken.Comma) {
            output.push(",")
        } else if (splitToken(t)[0] === BaseToken.Colon) {
            output.push(":")
        } else if (splitToken(t)[0] === BaseToken.Identifier) {
            // check if identifier matches a keyword

            if (splitToken(t)[1] === "import") {
                if (toks[i + 1] && splitToken(toks[i + 1])[0] === BaseToken.Identifier) {
                    //output.push(IRToken.Import + ";" + toks[i + 1])
                    output.push(`import ${splitToken(toks[i + 1])[1]}`)
                } else {
                    console.error("morelia: import requires valid identifier")
                    process.exit(1)
                }

                i++ // eat the source_path
            } else if (splitToken(t)[1] === "from") {
                if (toks[i + 1] && splitToken(toks[i + 1])[0] === BaseToken.Identifier) {
                    if (toks[i + 2] && splitToken(toks[i + 2])[0] === BaseToken.Identifier && splitToken(toks[i + 2])[1] === "import") {
                        if (toks[i + 3] && splitToken(toks[i + 3])[0] === BaseToken.Identifier) {
                            //output.push(IRToken.From + ";" + toks[i + 1] + ":" + IRToken.Import + ";" + toks[i + 3])
                            output.push(`from ${splitToken(toks[i + 1])[1]} import ${splitToken(toks[i + 3])[1]}`)
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
            } else if (splitToken(t)[1] === "for") {
            } else if (splitToken(t)[1] === "if") {
                let j = i + 1
                let foundOpenCurly = false
                let firstIndex = undefined

                for (j; j < toks.length; j++) {
                    if (splitToken(toks[j])[0] === BaseToken.Newline) {
                        break
                    }

                    if (splitToken(toks[j])[0] === BaseToken.OpenCurly) {
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
            } else if (splitToken(t)[1] === "elif") {
                // parse elseif
                let j = i + 1
                let foundOpenCurly = false

                for (j; j < toks.length; j++) {
                    if (splitToken(toks[j])[0] === BaseToken.Newline) {
                        break
                    }

                    if (splitToken(toks[j])[0] === BaseToken.OpenCurly) {
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
            } else if (splitToken(t)[1] === "else") {
                let j = i + 1
                let foundOpenCurly = false

                for (j; j < toks.length; j++) {
                    if (splitToken(toks[j])[0] === BaseToken.Newline) {
                        break
                    }

                    if (splitToken(toks[j])[0] === BaseToken.OpenCurly) {
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
            } else if (splitToken(t)[1] === "return") {
                output.push("return ")
            } else if (splitToken(t)[1] === "while") {
                let j = i + 1
                let foundOpenCurly = false

                for (j; j < toks.length; j++) {
                    if (splitToken(toks[j])[0] === BaseToken.Newline) {
                        break
                    }

                    if (splitToken(toks[j])[0] === BaseToken.OpenCurly) {
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
            } else if (splitToken(t)[1] === "try") {
                let j = i + 1
                let foundOpenCurly = false

                for (j; j < toks.length; j++) {
                    if (splitToken(toks[j])[0] === BaseToken.Newline) {
                        break
                    }

                    if (splitToken(toks[j])[0] === BaseToken.OpenCurly) {
                        if (openCurly !== j) {
                            foundOpenCurly = true
                            openCurly = j
                            break
                        }
                    }
                }

                if (!foundOpenCurly) {
                    console.error("morelia: invalid try statement, missing opening curly brace")
                    process.exit(1)
                }

                output.push("try")
            } else if (splitToken(t)[1] === "catch") {
                let j = i + 1
                let foundOpenCurly = false

                for (j; j < toks.length; j++) {
                    if (splitToken(toks[j])[0] === BaseToken.Newline) {
                        break
                    }

                    if (splitToken(toks[j])[0] === BaseToken.OpenCurly) {
                        if (openCurly !== j) {
                            foundOpenCurly = true
                            openCurly = j
                            break
                        }
                    }
                }

                if (!foundOpenCurly) {
                    console.error("morelia: invalid catch statement, missing opening curly brace")
                    process.exit(1)
                }

                output.push("except ")
            } else {
                let j = i + 1
                let foundOpenCurly = false
                for (j; j < toks.length; j++) {
                    if (splitToken(toks[j])[0] === BaseToken.Newline) {
                        break
                    }

                    if (splitToken(toks[j])[0] === BaseToken.OpenCurly) {
                        if (openCurly !== j) {
                            foundOpenCurly = true
                            openCurly = j
                            break
                        }
                    }
                }

                if (foundOpenCurly) {
                    output.push(`def ${splitToken(t)[1]}`)
                } else {
                    output.push(splitToken(t)[1])
                }
            }
        } else if (splitToken(t)[0] === BaseToken.Plus) {
            output.push("+")
        } else if (splitToken(t)[0] === BaseToken.Minus) {
            output.push("-")
        } else if (splitToken(t)[0] === BaseToken.Asterisk) {
            output.push("*")
        } else if (splitToken(t)[0] === BaseToken.Slash) {
            output.push("/")
        } else if (splitToken(t)[0] === BaseToken.Greater) {
            output.push(">")
        } else if (splitToken(t)[0] === BaseToken.Less) {
            output.push("<")
        } else if (splitToken(t)[0] === BaseToken.Integer) {
            output.push(splitToken(t)[1])
        } else if (splitToken(t)[0] === BaseToken.Float) {
            if (!splitToken(t)[1].includes(".")) {
                console.error("morelia: float does not include a period. (should not be possible)")
                process.exit(1)
            }

            if (splitToken(t)[1].split(".").length - 1 !== 1) {
                console.error("morelia: float contains multiple periods")
                process.exit(1)
            }

            output.push(splitToken(t)[1])
        } else if (splitToken(t)[0] === BaseToken.String) {
            let str = splitToken(t)[1].split("")
            if (str[str.length - 1] !== "'") {
                console.log(str[str.length - 1])
                console.error(`morelia: string does not end with a quote: ${str.join("")}`)
                process.exit(1)
            }

            output.push(splitToken(t)[1])
        } else if (splitToken(t)[0] === BaseToken.OpenBracket) {
            // check for closing bracket
            let j = i
            let foundCloseBracket = false

            for (j; j < toks.length; j++) {
                if (splitToken(toks[j])[0] === BaseToken.CloseBracket) {
                    foundCloseBracket = true
                    break
                }
            }

            if (!foundCloseBracket) {
                console.error("morelia: invalid list, missing closing bracket")
                process.exit(1)
            }

            output.push("[")
        } else if (splitToken(t)[0] === BaseToken.CloseBracket) {
            output.push("]")
        } else if (splitToken(t)[0] === BaseToken.Period) {
            output.push(".")
        } else if (splitToken(t)[0] === BaseToken.OpenParen) {
            output.push("(")
        } else if (splitToken(t)[0] === BaseToken.CloseParen) {
            output.push(")")
        } else if (splitToken(t)[0] === BaseToken.OpenCurly) {
            output.push(IRToken.Indent)
        } else if (splitToken(t)[0] === BaseToken.CloseCurly) {
            output.push(IRToken.Outdent)
            output.push(IRToken.Newline)
        } else if (splitToken(t)[0] === BaseToken.Newline) {
            if (splitToken(toks[i - 1])[0] !== BaseToken.Newline && toks[i + 1] !== BaseToken.CloseCurly) { // so there wont be too many newlines
                output.push(IRToken.Newline)
            }
        } else {
            console.error("morelia: unparsed token found in parser: " + t)
            process.exit(1)
        }
    }

    return output
}

export { parse }