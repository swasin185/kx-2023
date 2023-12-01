<script lang="ts">
export default defineComponent({
    name: "Mandelbrot"
})
</script>

<script lang="ts" setup>
import { defineComponent, onMounted } from "vue"

class ComplexNumber {
    private re: number
    private im: number
    public constructor(re: number, im: number) {
        this.re = re
        this.im = im
    }
    public absolute(): number {
        // return Math.hypot(this.re, this.im);
        return this.re * this.re + this.im * this.im
    }

    public add(x: ComplexNumber): void {
        this.re = this.re + x.re
        this.im = this.im + x.im
    }

    public getImage(): number {
        return this.im
    }
    public getReal(): number {
        return this.re
    }

    public multiply(x: ComplexNumber): void {
        let re = this.re * x.re - this.im * x.im
        let im = this.re * x.im + this.im * x.re
        this.re = re
        this.im = im
    }

    public power2(): void {
        this.multiply(this)
    }
}
let canvas: HTMLCanvasElement
let ctx: CanvasRenderingContext2D

let boxReal: HTMLInputElement
let boxImage: HTMLInputElement
let boxBoundary: HTMLInputElement
let txtRunTime: HTMLLabelElement

let WIDTH: number
let HEIGHT: number
let MID_WIDTH: number
let MID_HEIGHT: number

let WIDTH_J: number
let HEIGHT_J: number

const MAX_N = 500
const PALETTE: number[][] = new Array(MAX_N + 1)

for (let i = 0; i <= MAX_N; i++) {
    PALETTE[i] = new Array(3)
    PALETTE[i][0] = (i * 35) % 250
    PALETTE[i][1] = (i * 20) % 200
    PALETTE[i][2] = (i * 10) % 250
}

const RATIO = 2

const frontier = 4

var imgData: any
var data: any

var boundary: number
var center_real: number
var center_image: number

let ctxJulia: CanvasRenderingContext2D
var imgDataJulia: any
var dataJulia: any

function calculate() {
    let time: number = Date.now()
    boundary = Number(boxBoundary.value)
    center_real = Number(boxReal.value)
    center_image = -Number(boxImage.value)

    let cr = center_real - boundary / 2
    let ci = center_image - boundary / 2
    let C: ComplexNumber
    let Zn: ComplexNumber
    let im: number
    let re: number
    let step = boundary / WIDTH
    im = ci
    for (let y = 0; y < HEIGHT; y++) {
        re = cr
        for (let x = 0; x < WIDTH; x++) {
            C = new ComplexNumber(re, im)
            Zn = new ComplexNumber(re, im)
            let n: number = 0
            let re0: number = 0
            let im0: number = 0
            while (
                n < MAX_N &&
                Zn.absolute() < frontier &&
                !(re0 == Zn.getReal() && im0 == Zn.getImage())
            ) {
                re0 = Zn.getReal()
                im0 = Zn.getImage()
                Zn.power2()
                Zn.add(C)
                n++
            }
            if (re0 == Zn.getReal() && im0 == Zn.getImage()) n = MAX_N
            let coor = (y * WIDTH + x) * 4
            data[coor] = PALETTE[n][0] // RED
            data[++coor] = PALETTE[n][1] // GREEN
            data[++coor] = PALETTE[n][2] // BLUE
            //data[++coor] = 255 // ALPHA
            re += step
        }
        im += step
    }
    ctx.putImageData(imgData, 0, 0)
    time = Date.now() - time
    txtRunTime.innerHTML = "run time = " + time / 1000 + " seconds"
}

function mandel(re: number, im: number): { x: number; y: number }[] {
    let C = new ComplexNumber(re, im)
    let Zn = new ComplexNumber(re, im)
    let arr: { x: number; y: number }[] = [
        {
            x: ((re - center_real) * WIDTH) / boundary + MID_WIDTH,
            y: ((-im - center_image) * HEIGHT) / boundary + MID_HEIGHT
        }
    ]
    let n: number = 0
    let re0: number = 0
    let im0: number = 0
    while (
        n < MAX_N &&
        Zn.absolute() < frontier &&
        !(re0 == Zn.getReal() && im0 == Zn.getImage())
    ) {
        re0 = Zn.getReal()
        im0 = Zn.getImage()
        Zn.power2()
        Zn.add(C)
        arr.push({
            x: ((Zn.getReal() - center_real) * WIDTH) / boundary + MID_WIDTH,
            y: ((-Zn.getImage() - center_image) * HEIGHT) / boundary + MID_HEIGHT
        })
        n++
    }
    return arr
}

function calcJulia() {
    let boundary_julia = 4
    center_real = Number(boxReal.value)
    center_image = -Number(boxImage.value)
    let cr = -boundary_julia / 2
    let ci = -boundary_julia / 2
    let C: ComplexNumber = new ComplexNumber(center_real, center_image)
    let Zn: ComplexNumber
    let im: number
    let re: number
    let step = boundary_julia / WIDTH_J
    im = ci
    for (let y = 0; y < HEIGHT_J; y++) {
        re = cr
        for (let x = 0; x < WIDTH_J; x++) {
            Zn = new ComplexNumber(re, im)
            let n: number = 0
            let re0: number = 0
            let im0: number = 0
            while (
                n < MAX_N &&
                Zn.absolute() < frontier &&
                !(re0 == Zn.getReal() && im0 == Zn.getImage())
            ) {
                re0 = Zn.getReal()
                im0 = Zn.getImage()
                Zn.power2()
                Zn.add(C)
                n++
            }
            if (re0 == Zn.getReal() && im0 == Zn.getImage()) n = MAX_N
            let coor = (y * WIDTH_J + x) * 4
            dataJulia[coor] = PALETTE[n][0] // RED
            dataJulia[++coor] = PALETTE[n][1] // GREEN
            dataJulia[++coor] = PALETTE[n][2] // BLUE
            re += step
        }
        im += step
    }
    ctxJulia.putImageData(imgDataJulia, 0, 0)
}

function clickXY(event: MouseEvent) {
    if (event.button == 0) {
        let x = event.offsetX
        let y = event.offsetY
        boxReal.value = String(mapReal(x))
        boxImage.value = String(mapImage(y))
        calculate()
        calcJulia()
    }
}

function moveXY(event: MouseEvent) {
    let x = event.offsetX
    let y = event.offsetY
    paint(mapReal(x), mapImage(y))
}

function mapReal(x: number): number {
    return center_real + ((x - MID_WIDTH) * boundary) / WIDTH
}

function mapImage(y: number): number {
    return -center_image - ((y - MID_HEIGHT) * boundary) / HEIGHT
}

function reset() {
    boxBoundary.value = "3"
    boxReal.value = "-0.75"
    boxImage.value = "0"
    calculate()
}

function zoomIn() {
    boxBoundary.value = String(boundary / RATIO)
    calculate()
}

function zoomOut() {
    boxBoundary.value = String(boundary * RATIO)
    calculate()
}

function paint(re: number, im: number) {
    ctx.putImageData(imgData, 0, 0)
    let points: { x: number; y: number }[] = mandel(re, im)
    if (points.length > 0) {
        ctx.beginPath()
        ctx.moveTo(points[0].x, points[0].y)
        for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y)
        ctx.stroke()
        ctx.closePath()
    }
    ctx.beginPath()
    ctx.moveTo(0, MID_HEIGHT)
    ctx.lineTo(WIDTH, MID_HEIGHT)
    ctx.moveTo(MID_WIDTH, 0)
    ctx.lineTo(MID_WIDTH, HEIGHT)
    ctx.stroke()
    ctx.closePath()
}

onMounted(() => {
    canvas = document.getElementById("cpxCanvas") as HTMLCanvasElement
    WIDTH = canvas.width
    HEIGHT = canvas.height
    MID_WIDTH = canvas.width / 2
    MID_HEIGHT = canvas.height / 2
    ctx = canvas.getContext("2d") as CanvasRenderingContext2D
    ctx.strokeStyle = "darkgrey"
    imgData = ctx.createImageData(WIDTH, HEIGHT)
    data = imgData.data
    data.fill(0xff)

    boxReal = document.getElementById("realValue") as HTMLInputElement
    boxImage = document.getElementById("imageValue") as HTMLInputElement
    boxBoundary = document.getElementById("boundary") as HTMLInputElement
    txtRunTime = document.getElementById("runTime") as HTMLLabelElement

    canvas = document.getElementById("cpxJuliaSet") as HTMLCanvasElement
    ctxJulia = canvas.getContext("2d") as CanvasRenderingContext2D
    WIDTH_J = canvas.width
    HEIGHT_J = canvas.height
    imgDataJulia = ctxJulia.createImageData(WIDTH_J, HEIGHT_J)
    dataJulia = imgDataJulia.data
    dataJulia.fill(0xff)

    calculate()
})
</script>

<template>
    <table style="border: 0; padding: 5px">
        <tr>
            <td width="400" style="vertical-align: top; padding: 20px">
                <input
                    type="button"
                    class="button"
                    style="width: 50px; height: 25px; margin: 10px"
                    value="+"
                    @click="zoomIn"
                />
                <input
                    type="button"
                    class="button"
                    style="width: 100px; height: 25px; margin: 10px"
                    value="Reset"
                    @click="reset"
                />
                <input
                    type="button"
                    class="button"
                    style="width: 50px; height: 25px; margin: 10px"
                    value="-"
                    @click="zoomOut"
                />
                <h1>Mandelbrot Set</h1>
                <label id="runTime">run time = </label>
                <hr />
                <table>
                    <tr>
                        <td>จุดกึ่งกลาง Real :</td>
                        <td>
                            <input
                                id="realValue"
                                type="text"
                                value="-0.75"
                                style="width: 200px; text-align: right"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>จุดกึ่งกลาง Imaginary :</td>
                        <td>
                            <input
                                id="imageValue"
                                type="text"
                                value="0"
                                style="width: 200px; text-align: right"
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>ขนาด :</td>
                        <td>
                            <input
                                id="boundary"
                                type="text"
                                value="3"
                                style="width: 200px; text-align: right"
                            />
                        </td>
                    </tr>
                </table>
                <hr />
                <br />
                <h1>Julia Set</h1>
                <canvas
                    id="cpxJuliaSet"
                    width="320"
                    height="320"
                    style="border: 1px solid #fff"
                ></canvas>
            </td>
            <td>
                <canvas
                    id="cpxCanvas"
                    width="680"
                    height="680"
                    style="border: 1px solid #fff"
                    @mousemove="moveXY"
                    @click="clickXY"
                ></canvas>
            </td>
        </tr>
    </table>
</template>
