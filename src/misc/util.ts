// Written by Morelia contributors. Licensed under the MIT license. Repository: https://github.com/johanrong/morelia

// split inputted token
function splitToken(string: string) {
    if (string === undefined) {
        return ""
    }

    if (!string.includes(":")) { // just return the string, because there is nothing to split
        return [string]
    }

    return [string.substring(0, string.indexOf(":")), string.substring(string.indexOf(":") + 1)] // very nice one-liner // split by the first occurrence of ":"
}

// quick easy thing for indenting in the codegen
function indent(indents: number) {
    return " ".repeat(indents)
}

export { splitToken, indent }