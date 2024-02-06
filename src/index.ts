// Written by Morelia contributors. Licensed under the MIT license. Repository: https://github.com/johanrong/morelia

import fs from "node:fs";
import os from "node:os";

import { version } from "../package.json"

import { tokenize } from "./transpiler/lexer.ts";
import { parse } from "./transpiler/parser.ts";
import { generate } from "./transpiler/codegen.ts";

const argv = process.argv.slice(2)

if (argv.length < 1) {
    console.info(`(morelia v${version})`)
    console.info("morelia <source_path> [--debug]")
    process.exit(0)
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

const source = await Bun.file(source_path).text()
const tokens= tokenize(source)
if (debugging) console.log("*From lexer*\n", tokens)

const ir = parse(tokens)
if (debugging) console.log("*From parser*\n", ir)

const output = generate(ir)
if (debugging) console.log("*From codegen*\n", output)

if (debugging) console.log("*From output*")

if (!fs.existsSync(os.homedir() + "/morelia")) {
    fs.mkdirSync(os.homedir() + "/morelia")
}

const temp_output = os.homedir() + "/morelia/temp.py"
fs.writeFileSync(temp_output, output)

if (os.platform() === "linux") {
    Bun.spawn(["python3", temp_output], { stdout: "inherit", stdio: ["inherit", "inherit", "inherit"] })
} else if (os.platform() === "win32" || os.platform() === "darwin") {
    Bun.spawn(["python", temp_output], { stdout: "inherit", stdio: ["inherit", "inherit", "inherit"] })
} else {
    console.error("morelia: operating system not supported.")
    process.exit(1)
}