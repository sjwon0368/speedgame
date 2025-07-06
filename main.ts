enum RadioMessage {
    message1 = 49434,
    join = 59507,
    join0ack = 5807,
    join_ack = 62752,
    devname_req = 12140,
    dnreq_ack = 64228,
    await_otherdn = 22974,
    exc_finish = 17340,
    exc_finish_ack = 3169,
    req_start = 1928,
    rs_ack_lvselect = 28615
}
radio.onReceivedMessage(RadioMessage.devname_req, function () {
    basic.showLeds(`
        . . . . .
        . . . . .
        # . # . #
        . . . . .
        . . . . .
        `)
    radio.sendMessage(RadioMessage.dnreq_ack)
    connectphase = "exchange_ready"
})
radio.onReceivedMessage(RadioMessage.join_ack, function () {
    basic.showLeds(`
        . . . . .
        . . . . .
        # . # . #
        . . . . .
        . . . . .
        `)
    connectphase = "exchange_names"
    radio.sendMessage(RadioMessage.devname_req)
})
states.addLoopHandler("modeselect", function () {
    if (modeIdx == 2) {
        if (useSound) {
            modeIcons[modeIdx].showImage(0)
        } else {
            modeIcons[3].showImage(0)
        }
    } else {
        modeIcons[modeIdx].showImage(0)
    }
})
input.onButtonPressed(Button.A, function () {
    if (currentmode == 0) {
        if (modeIdx == 0) {
        	
        } else {
            modeIdx += -1
        }
    }
})
// this is not sent from host.
// host gets other microbit device name first, then other microbit gets the host device name.
radio.onReceivedMessage(RadioMessage.dnreq_ack, function () {
    radio.sendString(control.deviceName())
    basic.showLeds(`
        . . . . .
        # . . . #
        # . . . #
        # . # . #
        # # . # #
        `)
    basic.clearScreen()
    connectphase = "sent_dn"
})
function startconnect () {
    radio.setGroup(1)
    radio.sendMessage(RadioMessage.join)
    basic.showLeds(`
        . . . . .
        . . . . #
        . . . # .
        # . # . .
        . # . . .
        `)
    basic.clearScreen()
}
states.setEnterHandler("modeselect", function () {
    currentmode = 0
})
radio.onReceivedMessage(RadioMessage.join, function () {
    basic.showLeds(`
        . . # # .
        # . # . #
        . # # # .
        # . # . #
        . . # # .
        `)
    basic.clearScreen()
    basic.showLeds(`
        . # . . .
        # . # . .
        . # # # .
        . . # . #
        . . . # .
        `)
    basic.clearScreen()
    connectphase = "join_ack"
    radio.sendMessage(RadioMessage.join_ack)
})
states.setEnterHandler("sound", function () {
    useSound = !(useSound)
    states.setState("modeselect")
})
function varSetup () {
    datalogger.mirrorToSerial(true)
    currentmode = 0
    useSound = true
    modeIcons = [
    images.createImage(`
        . . . # .
        . . # # .
        . # # # .
        . . # # .
        . . . # .
        `),
    images.createImage(`
        . # . . .
        # . # . .
        . # # # .
        . . # . #
        . . . # .
        `),
    images.createImage(`
        . . . # .
        . # . . #
        # # . . #
        . # . . #
        . . . # .
        `),
    images.createImage(`
        . . . . .
        . # . . .
        # # . . .
        . # . . .
        . . . . .
        `)
    ]
    modeIdx = 0
}
input.onButtonPressed(Button.AB, function () {
    if (modeIdx == 0) {
        states.setState("game-noconnect")
    }
    if (modeIdx == 1) {
        states.setState("connect")
    }
    if (modeIdx == 2) {
        states.setState("sound")
    }
})
radio.onReceivedString(function (receivedString) {
    if (connectphase == "sent_dn" || connectphase == "exchange_ready") {
        basic.showLeds(`
            . . . . .
            # . . . #
            # . . . #
            # . # . #
            # # . # #
            `)
        basic.clearScreen()
        basic.pause(100)
        basic.showString(receivedString)
        if (connectphase == "exchange_ready") {
            connectphase = "send_hostdn"
            radio.sendString(control.deviceName())
        } else {
            connectphase = "exchange_finish"
            radio.sendMessage(RadioMessage.exc_finish)
        }
    }
})
input.onButtonPressed(Button.B, function () {
    if (currentmode == 0) {
        if (modeIdx == 2) {
        	
        } else {
            modeIdx += 1
        }
    }
})
states.setEnterHandler("connect", function () {
    for (let index = 0; index < 2; index++) {
        loadconnect()
    }
    isconnecting = true
    startconnect()
})
radio.onReceivedMessage(RadioMessage.rs_ack_lvselect, function () {
    basic.showString("Level")
    isconnected = true
})
function loadconnect () {
    basic.showLeds(`
        . . . . .
        . . . . .
        . # . . .
        . . . . .
        . . . . .
        `)
    basic.showLeds(`
        . . . . .
        . . . . .
        . # # . .
        . . . . .
        . . . . .
        `)
    basic.showLeds(`
        . . . . .
        . . . . .
        . # # # .
        . . . . .
        . . . . .
        `)
    basic.showLeds(`
        . . . . .
        . . . . .
        . . # # .
        . . . . .
        . . . . .
        `)
    basic.showLeds(`
        . . . . .
        . . . . .
        . . . # .
        . . . . .
        . . . . .
        `)
    basic.clearScreen()
}
radio.onReceivedMessage(RadioMessage.req_start, function () {
    radio.sendMessage(RadioMessage.rs_ack_lvselect)
    basic.showString("Level")
    isconnected = true
})
radio.onReceivedMessage(RadioMessage.exc_finish, function () {
    radio.sendMessage(RadioMessage.exc_finish_ack)
    basic.showLeds(`
        . . . # .
        . . # # .
        . # # # .
        . . # # .
        . . . # .
        `)
    basic.clearScreen()
    basic.showIcon(IconNames.Yes)
    basic.clearScreen()
})
radio.onReceivedMessage(RadioMessage.exc_finish_ack, function () {
    basic.showLeds(`
        . . . # .
        . . # # .
        . # # # .
        . . # # .
        . . . # .
        `)
    basic.clearScreen()
    basic.showIcon(IconNames.Yes)
    basic.clearScreen()
    radio.sendMessage(RadioMessage.req_start)
})
let isconnected = false
let isconnecting = false
let currentmode = 0
let modeIcons: Image[] = []
let useSound = false
let modeIdx = 0
let connectphase = ""
varSetup()
states.setState("modeselect")
basic.forever(function () {
	
})
