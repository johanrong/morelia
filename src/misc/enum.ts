// Written by Morelia contributors. Licensed under the MIT license. Repository: https://github.com/johanrong/morelia

// base tokens from Lexer/Tokenizer
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

// intermediate Representation tokens from Parser
enum IRToken {
    Newline = "Newline",
    Outdent = "Outdent",
    Indent = "Indent",
}

export { BaseToken, IRToken }