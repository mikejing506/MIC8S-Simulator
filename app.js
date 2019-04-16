var fs = require("fs")
var FLASH = new Uint16Array(1024)//1024word, 14bit per word, high 2bit always in 0b00
// buf = fs.readFileSync("./test.bin");

var WREG = 0b10010101;
var LCR = 0;
var PC = 0;
// var STATUS = 0;

var regs_PG0 = {
    0x00: 0b00000000,//INDF
    0x01: 0b00000000,//TMR0
    0x02: 0b00000000,//PCL
    0x03: 0b00000000,//STATUS 
    0x04: 0b00000000,//FSR
    0x05: 0b00000000,//PORT
    0x0A: 0b00000000,//PCHBUF
    0x0B: 0b00000000,//INTCON
    0x0C: 0b00000000,//PIR1
    0x0E: 0b00000000,//TMR1L
    0x0F: 0b00000000,//TMR1H    
    0x10: 0b00000000,//T1CON
    0x11: 0b00000000,//DC0AL
    0x12: 0b00000000,//DC0BL
    0x13: 0b00000000,//DC1AL
    0x14: 0b00000000,//DC1AH
    0x15: 0b00000000,//ECPOCON
    0x16: 0b00000000,//PWM0CON
    0x17: 0b00000000,//ECP0AS
    0x18: 0b00000000,//PWM1CON
    0x19: 0b00000000,//VRCON
    0x1A: 0b00000000,//CMCON0
    0x1B: 0b00000000,//ECP1CON
    0x1C: 0b00000000,//CMCON1
    0x1D: 0b00000000,//ECP1AS
}

var regs_PG1 = {
    0x80: 0b00000000,//INDF
    0x81: 0b00000000,//OPTION
    0x82: 0b00000000,//PCL
    0x83: 0b00000000,//STATUS
    0x84: 0b00000000,//FSR
    0x85: 0b00000000,//TRISIO
    0x88: 0b00000000,//PR1L
    0x89: 0b00000000,//PR1H
    0x8A: 0b00000000,//PCHBUF
    0x8B: 0b00000000,//INTCON
    0x8C: 0b00000000,//PIE1
    0x8D: 0b00000000,//TWDR
    0x8E: 0b00000000,//PCON
    0x90: 0b00000000,//OSCTUNE
    0x91: 0b00000000,//T0CON
    0x92: 0b00000000,//PR0L
    0x93: 0b00000000,//DC1BL
    0x94: 0b00000000,//DC1BH
    0x95: 0b00000000,//PUCR
    0x96: 0b00000000,//IOCR
    0x97: 0b00000000,//PDCR
    0x98: 0b00000000,//TWSR
    0x9A: 0b00000000,//EEPDR
    0x9B: 0b00000000,//EEPAR
    0x9C: 0b00000000,//EEPCR
    0x9E: 0b00000000,//TWCR
    0x9F: 0b00000000,//ANSEL
}

// decode
function decoder(code){
    // LCR++;
    switch(code){
        case 0b0://case nop
            return ({code:"nop"})
            break;
        case 0b1://case CLRW
            let tmpW = WREG;
            WREG = 0b00000000;
            return ({code:"CLRW",preW:tmpW.toString(2),CLRW:WREG.toString(2)})
            break;
        case 0b10://case OPTION = W
            regs_PG1[0x81] = WREG;
            return({code:"OPTION",OPTION:WREG})
            break;
        case 0b11://case SLEEP
            //todo
            break;
        case 0b100://case CLRWDT
            break;
        case 0b101://case TRIS5 = W
            regs_PG1[0x85]^WREG;
            return({code:"TRIS",TRIS:5,REG:W})
            break;
        case 0b110://case TRIS6 = W
            regs_PG1[0x85]^WREG;
            return({code:"TRIS",TRIS:5,REG:W})
            break;
        case 0b111://case TRIS5 = W
            regs_PG1[0x85]^WREG;
            return({code:"TRIS",TRIS:5,REG:W})
            break;
        case 0b1000://case RETURN PC=TOS
            break;
        case 0b1001://case RETFIE PC = TOS, GIE = 1
            break;
        case 0b1010://DAA bin to dec after add
            break;
        case 0b1011://DAS bin to dec after sub
            break;
        case 0b1100://MOVWP [W] = PMEM[PCH:FSR]
        0x3<<8^0xA0
            break;
        default:
            break;
    }   
}

console.log(regs_PG1[0x81])