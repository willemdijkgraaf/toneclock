/**
 * Created by wimdijkgraaf on 08-06-14.
 */
export module ToneClock {
    export class Canvas {
        htmlCanvas: HTMLCanvasElement;
        htmlContext: CanvasRenderingContext2D;

        public constructor ( toneClockArea:string ) {

            this.htmlCanvas = document.createElement("canvas");
            var myToneClockArea = document.getElementById( toneClockArea );
            myToneClockArea.appendChild(this.htmlCanvas);
            this.htmlContext = this.htmlCanvas.getContext("2d");

        }

        public drawCircle ( x:number, y:number, radius:number, color:string, bFill:boolean ) {
            this.htmlContext.beginPath();
            this.htmlContext.arc(x, y, radius, 0, 2*Math.PI);
            this.htmlContext.lineWidth = 1;
            this.htmlContext.strokeStyle = color;
            if (bFill) {
                this.htmlContext.fillStyle = color;
                this.htmlContext.fill();
            }
            this.htmlContext.stroke();
        }

        public setSize ( width: number, height: number ) {
            this.htmlCanvas.setAttribute( "width", width.toString() );
            this.htmlCanvas.setAttribute( "height", height.toString() );
        }

        public clearCanvas ( width: number, height: number ) {
            this.htmlContext.clearRect( 0, 0, width, height);
        }

        public drawHarmony ( aClock, arrayHarmony, bFill:boolean, sColor:string ) {
            var toX:number = 0;
            var toY:number = 0;
            var endX:number = 0;
            var endY:number = 0;
            var bFirstFound:boolean = false;

            this.htmlContext.beginPath();
            this.htmlContext.moveTo(endX, endY);

            for (var i = 0; i <= 11; i++){
                for (var j = 0; j < arrayHarmony.length ; j++) {
                    // transpose first

                    if ( arrayHarmony[j] === aClock.hours[i].midiNoteNumber ) {
                        toX = aClock.hours[i].xpos;
                        toY = aClock.hours[i].ypos;
                        if (bFirstFound) {
                            this.htmlContext.lineTo(toX, toY);
                            break;
                        }
                        else {
                            this.htmlContext.moveTo(toX, toY);
                            endX = toX;
                            endY = toY;
                            bFirstFound = true;
                            break;
                        }
                    }
                }
            }

            this.htmlContext.lineTo(endX, endY);
            if (bFill) {
                this.htmlContext.fillStyle = sColor;
                this.htmlContext.fill();
            }
            this.htmlContext.lineWidth = 5;
            this.htmlContext.strokeStyle = sColor;
            // this.myContext.lineCap = 'round';
            this.htmlContext.stroke();
        }

        public writeText ( x:number, y:number, text:string, sFontName:string, iFontSize:number, sTextAlign:string, sTextBaseline:string, color:string ) {
            this.htmlContext.font = "" + iFontSize + "px " + sFontName;
            this.htmlContext.textAlign = sTextAlign;
            this.htmlContext.textBaseline = sTextBaseline;
            this.htmlContext.save();
            this.htmlContext.restore();
            this.htmlContext.fillStyle = color;
            this.htmlContext.beginPath();
            this.htmlContext.fillText( text, x, y);
            this.htmlContext.stroke();
        }
    }
}