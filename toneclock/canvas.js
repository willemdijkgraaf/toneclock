define(["require", "exports"], function(require, exports) {
    (function (ToneClock) {
        var Canvas = (function () {
            function Canvas(toneClockArea) {
                this.htmlCanvas = document.createElement("canvas");
                var myToneClockArea = document.getElementById(toneClockArea);
                myToneClockArea.appendChild(this.htmlCanvas);
                this.htmlContext = this.htmlCanvas.getContext("2d");
            }
            Canvas.prototype.drawCircle = function (x, y, radius, color, bFill) {
                this.htmlContext.beginPath();
                this.htmlContext.arc(x, y, radius, 0, 2 * Math.PI);
                this.htmlContext.lineWidth = 1;
                this.htmlContext.strokeStyle = color;
                if (bFill) {
                    this.htmlContext.fillStyle = color;
                    this.htmlContext.fill();
                }
                this.htmlContext.stroke();
            };

            Canvas.prototype.setSize = function (width, height) {
                this.htmlCanvas.setAttribute("width", width.toString());
                this.htmlCanvas.setAttribute("height", height.toString());
            };

            Canvas.prototype.clearCanvas = function (width, height) {
                this.htmlContext.clearRect(0, 0, width, height);
            };

            Canvas.prototype.drawHarmony = function (aClock, arrayHarmony, bFill, sColor) {
                var toX = 0;
                var toY = 0;
                var endX = 0;
                var endY = 0;
                var bFirstFound = false;

                this.htmlContext.beginPath();
                this.htmlContext.moveTo(endX, endY);

                for (var i = 0; i <= 11; i++) {
                    for (var j = 0; j < arrayHarmony.length; j++) {
                        if (arrayHarmony[j] === aClock.hours[i].midiNoteNumber) {
                            toX = aClock.hours[i].xpos;
                            toY = aClock.hours[i].ypos;
                            if (bFirstFound) {
                                this.htmlContext.lineTo(toX, toY);
                                break;
                            } else {
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

                this.htmlContext.stroke();
            };

            Canvas.prototype.writeText = function (x, y, text, sFontName, iFontSize, sTextAlign, sTextBaseline, color) {
                this.htmlContext.font = "" + iFontSize + "px " + sFontName;
                this.htmlContext.textAlign = sTextAlign;
                this.htmlContext.textBaseline = sTextBaseline;
                this.htmlContext.save();
                this.htmlContext.restore();
                this.htmlContext.fillStyle = color;
                this.htmlContext.beginPath();
                this.htmlContext.fillText(text, x, y);
                this.htmlContext.stroke();
            };
            return Canvas;
        })();
        ToneClock.Canvas = Canvas;
    })(exports.ToneClock || (exports.ToneClock = {}));
    var ToneClock = exports.ToneClock;
});
