// Written by Morelia contributors. Licensed under the MIT license. Repository: https://github.com/johanrong/morelia

import { indent } from "../misc/util.ts";
import { IRToken } from "../misc/enum.ts";

// generate python code
function generate(ir: string[]) {
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

export { generate }