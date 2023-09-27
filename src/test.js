
function isNumeric(c) { return "0" <= c && c <= "9"; }

function isAlpha(c) { return ("a" <= c && c <= "z") || ("A" <= c && c <= "Z");}

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

        this.tokens = lexer(text)
        this.currentTokenIndex = 0
        this.parsed = [];

        // registers 
        this.array_buffer = [];
        this.array_mode = false;

        this.string_len_buffer = [];
        this.string_buffer = []
        this.remaining_string = null
        this.string_buffer_head = 0

        this.int_buffer = [];
        // this.negative_int = false;
        

        this.dict = {}
        this.dict_len_buffer = []
        this.dict_remaining_items = -1

        
    }

    

    parseString() {

        const currentToken = this.tokens.at(this.currentTokenIndex)
        console.log("Reading : %s", currentToken.value )
        
        switch (true) {
            
            case currentToken.type === "digit" :
                console.log("readed string len digit")
                this.string_len_buffer.push(currentToken.value)
                this.currentTokenIndex += 1;
                return this.parseString()

            case currentToken.type === "stringSep" :  
                console.log("readed stringSep")
                this.remaining_string = parseInt(this.string_len_buffer.join(""))
                console.log("string should have a lenght of %d", this.remaining_string)

                this.currentTokenIndex += 1;
                return this.parseString()

            case currentToken.type === "char" :

                const needToStop = this.string_buffer_head + 1  === this.remaining_string
      

                if (!needToStop) {
                    this.currentTokenIndex += 1;
                    this.string_buffer_head += 1;
                    this.string_buffer.push(currentToken.value)
                    return this.parseString()

                } else {
                    
                    // End of string
                    this.string_buffer.push(currentToken.value)
                    this.parsed.push({"string" : this.string_buffer.join("")})
                    this.currentTokenIndex += 1;

                    // reset buff 
                    this.string_len_buffer = [];
                    this.string_buffer = []
                    this.remaining_string = null
                    this.string_buffer_head = 0

                    return this.parse()
                }

        }

    }

    parseInt(){

        const currentToken = this.tokens.at(this.currentTokenIndex)
        console.log("Reading : %s", currentToken.value )

        
        switch (true) {

            case currentToken.value === "-":
                console.log("readed negative sign")
                this.int_buffer.unshift("-")
                this.currentTokenIndex += 1
                return this.parseInt()

            case currentToken.value === "e" :
                console.log("readed end of int")
                this.parsed.push({"int" : parseInt(this.int_buffer.join(""))})
                this.int_buffer = []
                this.currentTokenIndex += 1
                return this.parse()
                

            case currentToken.type === "digit" :
                console.log("reading a digit")   
                this.int_buffer.push(currentToken.value)
                this.currentTokenIndex += 1
                return this.parseInt()
        }
       

    }

    parseDict(tokens) {
        console.log("Parsing a Dictionary")
        console.log(`Int Buff : ${this.int_buffer} : isNegative : ${this.negative_int}`)
        console.log(tokens)
    }

    parseArray(tokens) {
        this.array_buffer = []
        this.array_mode = true
        console.log("Parsing an array")
        const x = this.parse(tokens)
        console.log(x)

    }

    // decodeBencode("5:hello") -> "hello"
    // decodeBencode("10:hello12345") -> "hello12345"
    // decodeBencode("i52e") -> 52
    // decodeBencode("i-52e") -> -52
    // decodeBencode("l5:helloi52ee") -> ["hello",52]
    // decodeBencode("l5:helloi52e10:hello12345e") -> ["hello",52]
    // decodeBencode("d3:foo3:bar5:helloi52ee") -> {"foo":"bar","hello":52}

    parse() {
        console.log("parsing...")
        console.log(this.parsed)

        const lastToken = this.tokens.at(-1)
        const currentToken = this.tokens.at(this.currentTokenIndex)

        if (currentToken === undefined) {
            console.log("EOF")
            return this.parsed
        }

        this.currentTokenIndex += 1 

        if(currentToken.type === "digit") {

            this.string_len_buffer.push(currentToken.value)
            return this.parseString()

        } else if (currentToken.type === "char") {
            
            if (currentToken.value === "i") {
                return this.parseInt()

            } else if (currentToken.value === "l" && lastToken.value === "e") {
                this.array_mode = true 
                return this.parseArray(this.tokens.slice(1,-1))
            } else if (currentToken.value === "d" && lastToken.value === "e") {
                return this.parseDict(this.tokens.slice(1,-1))
            }

        } else if (currentToken === undefined) {
            // end 
            console.log("EOF")
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


console.log("--------------------------")
decodeBencode("i52ei20ei-8e")

//decodeBencode("i-52e")
// decodeBencode("5:hello3:aze6:dorian")
// decodeBencode("l5:helloi52ee")