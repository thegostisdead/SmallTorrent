
function isNumeric(c) {
    return "0" <= c && c <= "9";
}

function isAlpha(c) {
    return ("a" <= c && c <= "z") || ("A" <= c && c <= "Z");
}

function lexer(text) {
    const tokens = []

    for (const char of text) {
        // console.log(char)

        if (char === ":") {
            tokens.push({
                type: "stringSep",
                value: char
            })
        } else if(isNumeric(char)){
            tokens.push({
                type: "digit",
                value: char
            })

        } else if (isAlpha(char)) {
            tokens.push({
                type: "char",
                value: char
            })
        } else if (char === "-") {
            tokens.push({
                type: "symbol",
                value: char
            })
        } else {
            throw new Error(`Invalid char ${char}`)
        }

    }
    console.log(tokens)
    return tokens
}

class Parser {

    constructor(text) {

        this.text = text
        this.parsed = [];

        // registers 
        this.array_buffer = [];
        this.array_mode = false;

        this.string_len_buffer = [];
        this.string_buffer = []
        this.remaining_string = -1

        this.int_buffer = [];
        this.negative_int = false;
        

        this.dict = {}
        this.dict_len_buffer = []
        this.dict_remaining_items = -1

        
    }

    parseArray(tokens) {

        this.array_buffer = []
        this.array_mode = true
        console.log("Parsing an array")


    }

    parseString(tokens) {
        console.log("Parsing an string")
        console.log(`String Buff : ${this.string_buffer} : remaing string : ${this.remaining_string}`)

        const currentToken = tokens[0]

        if (currentToken === undefined) {
            this.parsed.push({"string" : this.string_buffer.join("")})
            return
        }

        if (currentToken.type === "stringSep") {
            this.remaining_string = parseInt(this.string_len_buffer.join(""))
            // reset 
            this.string_len_buffer = [] 
            return this.parseString(tokens.splice(1,))

        } else if (currentToken.type === "digit") {
            this.string_len_buffer.push(currentToken.value)
            
        } else if (currentToken.type === "char") {

            this.string_buffer.push(currentToken.value)
            this.remaining_string -= 1
     
            if (this.remaining_string >= 1 ) {
                return this.parseString(tokens.splice(1,))
            } else {
                console.log("Adding string")
                this.parsed.push({"string" : this.string_buffer.join("")})
                return
                // end of string
            }
            
        }


    }

    parseInt(tokens){
        console.log("Parsing an integer")
        console.log(`Int Buff : ${this.int_buffer} : isNegative : ${this.negative_int}`)
        console.log(tokens)

        const currentToken = tokens[0]

        if (currentToken)

        console.log("Current Token : ", currentToken)

        if (currentToken.value === '-') {
            console.log("negative int ")
            this.negative_int = true 
            return this.parseInt(tokens.slice(1,))

        } else if (currentToken.type === "digit") {
            this.int_buffer.push(currentToken.value)
            return this.parseInt(tokens.slice(1,))

        } else if (currentToken.value === "e") {
            // end of int 
            const fullString = this.negative_int ? "-" + this.int_buffer.join('') : this.int_buffer.join('')

            // reset 
            this.negative_int = false
            this.int_buffer = []

            if (this.array_mode) {
                this.array_buffer.push(parseInt(fullString))
                return 
            }
            console.log("Adding integer to parsed -> %d", parseInt(fullString))
            this.parsed.push({"number" : parseInt(fullString)})
        }
    }

    parseDict(tokens) {
        console.log("Parsing a Dictionary")
        console.log(`Int Buff : ${this.int_buffer} : isNegative : ${this.negative_int}`)
        console.log(tokens)
    }

    // decodeBencode("5:hello") -> "hello"
    // decodeBencode("10:hello12345") -> "hello12345"
    // decodeBencode("i52e") -> 52
    // decodeBencode("i-52e") -> -52
    // decodeBencode("l5:helloi52ee") -> ["hello",52]
    // decodeBencode("l5:helloi52e10:hello12345e") -> ["hello",52]
    // decodeBencode("d3:foo3:bar5:helloi52ee") -> {"foo":"bar","hello":52}

    parse() {

        const tokenStream = lexer(this.text)
    
        const currentToken = tokenStream[0]
        const lastToken = tokenStream.at(-1)

        if(currentToken.type === "digit") {
            this.string_len_buffer.push(currentToken.value)
            return this.parseString(tokenStream.slice(1,))

        } else if (currentToken.type === "char") {

            if (currentToken.value === "i") {
                return this.parseInt(tokenStream.slice(1,))

            } else if (currentToken.value === "l" && lastToken.value === "e") {
                this.array_mode = true 
                return this.parseArray(tokenStream.slice(1,-1))
            } else if (currentToken.value === "d" && lastToken.value === "e") {
                return this.parseDict(tokenStream.slice(1,-1))
            }

        } else if (currentToken === undefined) {
            // end 
        }

        return this.parsed

    }

    stringify() {
        // text generation here
    }


}

function decodeBencode(bencodedValue) {
    const parser = new Parser(bencodedValue)
    const parsed = parser.parse()
    console.log("PARSED : ")
    console.log(parsed)
    return parser.stringify()
}

decodeBencode("5:hello")
console.log("--------------------------")
//decodeBencode("i-52e")