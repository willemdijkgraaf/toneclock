define(["require", "exports"], function(require, exports) {
    (function (ToneClock) {
        var CanvasEaselJS = (function () {
            function CanvasEaselJS(toneClockArea) {
                this.htmlBackgroundCanvas = document.createElement("canvas");
                this.htmlBackgroundCanvas.setAttribute("class", "foregroundCanvas");

                this.htmlForegroundCanvas = document.createElement("canvas");
                this.htmlForegroundCanvas.setAttribute("class", "foregroundCanvas");

                var myToneClockArea = document.getElementById(toneClockArea);
                myToneClockArea.appendChild(this.htmlBackgroundCanvas);
                myToneClockArea.appendChild(this.htmlForegroundCanvas);

                this.DisableDefaultBrowsersContextMenu(this.htmlBackgroundCanvas);
                this.DisableDefaultBrowsersContextMenu(this.htmlForegroundCanvas);

                this.htmlBackgroundContext = this.htmlBackgroundCanvas.getContext("2d");
                this.htmlForegroundContext = this.htmlForegroundCanvas.getContext("2d");

                this.myBackgroundStage = new createjs.Stage(this.htmlBackgroundCanvas);
                this.myBackgroundStage.enableMouseOver(20);
                this.myForegroundStage = new createjs.Stage(this.htmlForegroundCanvas);
                this.myForegroundStage.enableMouseOver(20);

                createjs.Touch.enable(this.myForegroundStage);
            }
            CanvasEaselJS.prototype.DisableDefaultBrowsersContextMenu = function (htmlCanvas) {
                htmlCanvas.oncontextmenu = function (e) {
                    e.preventDefault();
                    return true;
                };
            };

            CanvasEaselJS.prototype.addEventListener = function (sEvent, fCallback) {
                switch (sEvent) {
                    case "OnHourClick":
                        this.myOnHourClick = fCallback;
                        break;
                    case "OnHourRightClick":
                        this.myOnHourRightClick = fCallback;
                        break;
                    case "OnHourDragDrop":
                        this.myOnHourDragDrop = fCallback;
                        break;

                    case "OnHarmonyClick":
                        this.myOnHarmonyClick = fCallback;
                        break;
                    case "OnHarmonyRightClick":
                        this.myOnHarmonyRightClick = fCallback;
                        break;
                    case "OnHarmonyDragDrop":
                        this.myOnHarmonyDragDrop = fCallback;
                        break;
                }
            };

            CanvasEaselJS.prototype.OnCircleClick = function (event) {
                if (event.nativeEvent.button == 2) {
                    event.preventDefault();
                    event.stopPropagation();
                    this.OnCircleRightClick(event);
                    return false;
                } else {
                    this.OnCircleLeftClick(event);
                }
            };
            CanvasEaselJS.prototype.OnCircleLeftClick = function (event) {
                if (typeof this.myOnHourClick === 'function') {
                    this.myOnHourClick(this.GetObjectId(event));
                }
            };

            CanvasEaselJS.prototype.OnCircleRightClick = function (event) {
                var x = event.stageX;
                var y = event.stageY;

                if (typeof this.myOnHourRightClick === 'function') {
                    this.myOnHourRightClick(this.GetObjectId(event), x, y);
                }
            };

            CanvasEaselJS.prototype.OnHarmonyMouseDown = function (event) {
                if (event.nativeEvent.button == 2) {
                    return false;
                } else {
                    this.myHarmonyDragDropX = event.stageX;
                    this.myHarmonyDragDropY = event.stageY;
                }
            };

            CanvasEaselJS.prototype.OnHarmonyClick = function (event) {
                if (event.nativeEvent.button == 2) {
                    event.preventDefault();
                    event.stopPropagation();
                    this.OnHarmonyRightClick(event);
                    return false;
                } else {
                    this.OnHarmonyLeftClick(event);
                }
            };

            CanvasEaselJS.prototype.OnHarmonyLeftClick = function (event) {
                if (typeof this.myOnHarmonyClick === 'function') {
                    this.myOnHarmonyClick(this.GetObjectId(event));
                }
            };

            CanvasEaselJS.prototype.OnHarmonyRightClick = function (event) {
                var x = event.stageX;
                var y = event.stageY;

                if (typeof this.myOnHarmonyRightClick === 'function') {
                    this.myOnHarmonyRightClick(this.GetObjectId(event), x, y);
                }
            };

            CanvasEaselJS.prototype.GetObjectId = function (event) {
                var target = event.target;
                var objectId = target["objectId"];

                return objectId;
            };

            CanvasEaselJS.prototype.OnCircleMouseOver = function (event) {
                var x = event.target['objectX'];
                var y = event.target['objectY'];
                var radius = this.myHighlightedHourRadius;

                var circle = new createjs.Shape();
                circle.graphics.beginFill("#aaaaaa");
                circle.graphics.drawCircle(x, y, radius);

                this.myForegroundStage.addChild(circle);
                this.myForegroundStage.updateCache();
                this.myForegroundStage.update();

                this.myHighlightedHour = circle;
            };

            CanvasEaselJS.prototype.OnCircleMouseOut = function (event) {
                this.myForegroundStage.removeChild(this.myHighlightedHour);
                this.myForegroundStage.updateCache();
                this.myForegroundStage.update();
            };

            CanvasEaselJS.prototype.OnCirclePressMove = function (event) {
                console.log("OnCirclePressMove");

                var stageX = event.stageX;
                var stageY = event.stageY;

                if (typeof this.myOnHourDragDrop === 'function') {
                    this.myOnHourDragDrop(this.GetObjectId(event), stageX, stageY);
                }
            };

            CanvasEaselJS.prototype.OnCirclePressUp = function (event) {
                console.log("OnCirclePressUp");
            };

            CanvasEaselJS.prototype.OnHarmonyPressMove = function (event) {
                var stageY = event.stageY;
                var distanceY = stageY - this.myHarmonyDragDropY;
                var numberOfSteps = Math.round(distanceY % 20);

                if ((distanceY > 20) || (distanceY < -20)) {
                    this.myHarmonyDragDropY = stageY;

                    if (typeof this.myOnHarmonyDragDrop === 'function') {
                        this.myOnHarmonyDragDrop(this.GetObjectId(event), numberOfSteps, this.myHarmonyDragDropX);
                    }
                }
            };

            CanvasEaselJS.prototype.OnHarmonyPressUp = function (event) {
                console.log("OnHarmonyPressUp");
            };

            CanvasEaselJS.prototype.OnHarmonyMouseOver = function (event) {
                event.target.alpha = 0.5;
                this.myForegroundStage.updateCache();
                this.myForegroundStage.update();
            };

            CanvasEaselJS.prototype.OnHarmonyMouseOut = function (event) {
                event.target.alpha = 0.8;
                this.myForegroundStage.updateCache();
                this.myForegroundStage.update();
            };

            CanvasEaselJS.prototype.setSize = function (width, height) {
                this.htmlBackgroundCanvas.setAttribute("width", width.toString());
                this.htmlBackgroundCanvas.setAttribute("height", height.toString());
                this.htmlForegroundCanvas.setAttribute("width", width.toString());
                this.htmlForegroundCanvas.setAttribute("height", height.toString());
            };

            CanvasEaselJS.prototype.updateCacheAndCanvas = function () {
                if (this.myBackgroundChanged === true) {
                    this.myBackgroundStage.updateCache();
                    this.myBackgroundStage.update();
                    this.myBackgroundChanged = false;
                }
                if (this.myForegroundChanged === true) {
                    this.myForegroundStage.updateCache();
                    this.myForegroundStage.update();
                    this.myForegroundChanged = false;
                }
            };

            CanvasEaselJS.prototype.clearCanvas = function () {
                this.myBackgroundStage.removeAllChildren();
                this.myForegroundStage.removeAllChildren();

                this.myBackgroundChanged = true;
                this.myForegroundChanged = true;
            };

            CanvasEaselJS.prototype.SetCanvasCacheArea = function (x, y, width, height) {
                this.myForegroundStage.cache(x, y, width, height);
                this.myBackgroundStage.cache(x, y, width, height);
            };

            CanvasEaselJS.prototype.drawCircle = function (x, y, radius, sColor, bFill, id) {
                if (id != "") {
                    this.deleteChildByName(this.myForegroundStage, id);
                }

                this.myHighlightedHourRadius = radius;

                var circle = new createjs.Shape();

                if (bFill) {
                    circle.graphics.beginFill(sColor);
                } else {
                    circle.graphics.beginStroke(sColor);
                    circle.graphics.beginFill("#ffffff");
                    circle.graphics.setStrokeStyle(0.5);
                }
                circle.graphics.drawCircle(x, y, radius);

                circle.alpha = 0.5;

                circle['objectId'] = id;
                circle['objectX'] = x;
                circle['objectY'] = y;
                circle.name = id;

                circle.addEventListener("click", $.proxy(this.OnCircleClick, this));
                circle.addEventListener("mouseover", $.proxy(this.OnCircleMouseOver, this));
                circle.addEventListener("mouseout", $.proxy(this.OnCircleMouseOut, this));
                circle.addEventListener("pressmove", $.proxy(this.OnCirclePressMove, this));
                circle.addEventListener("pressup", $.proxy(this.OnCirclePressUp, this));

                this.myForegroundStage.addChild(circle);
                this.myForegroundChanged = true;
            };

            CanvasEaselJS.prototype.drawHarmony = function (aClock, arrayHarmony, bFill, sColor, id) {
                var toX = 0;
                var toY = 0;
                var endX = 0;
                var endY = 0;
                var bFirstFound = false;

                if (id != "") {
                    this.deleteChildByName(this.myForegroundStage, id);
                }

                this.myForegroundStage.removeChild(this.myForegroundStage.getChildByName(id));

                var g = new createjs.Graphics();

                g.moveTo(endX, endY);

                if (bFill) {
                    g.beginFill(sColor);
                }

                g.beginStroke(sColor);

                for (var i = 0; i < 12; i++) {
                    for (var j = 0; j < arrayHarmony.length; j++) {
                        if (arrayHarmony[j] === aClock.hours[i].midiNoteNumber) {
                            toX = aClock.hours[i].xpos;
                            toY = aClock.hours[i].ypos;
                            if (bFirstFound) {
                                g.lineTo(toX, toY);
                                break;
                            } else {
                                g.moveTo(toX, toY);
                                endX = toX;
                                endY = toY;
                                bFirstFound = true;
                                break;
                            }
                        }
                    }
                }

                if (arrayHarmony.length === 1) {
                    endX += 2;
                    endY += 2;
                }

                g.lineTo(endX, endY);
                g.setStrokeStyle(10);

                var s = new createjs.Shape(g);
                s.alpha = 0.8;

                s['objectId'] = id;
                s.name = id;

                s.addEventListener("mousedown", $.proxy(this.OnHarmonyMouseDown, this));
                s.addEventListener("click", $.proxy(this.OnHarmonyClick, this));
                s.addEventListener("mouseover", $.proxy(this.OnHarmonyMouseOver, this));
                s.addEventListener("mouseout", $.proxy(this.OnHarmonyMouseOut, this));
                s.addEventListener("pressmove", $.proxy(this.OnHarmonyPressMove, this));
                s.addEventListener("pressup", $.proxy(this.OnHarmonyPressUp, this));

                this.myForegroundStage.addChild(s);
                this.myForegroundChanged = true;
            };

            CanvasEaselJS.prototype.writeNoteName = function (x, y, text, sFontName, iFontSize, sTextAlign, sTextBaseline, sColor) {
                this.writeText(this.myBackgroundStage, "", x, y, text, sFontName, iFontSize, sTextAlign, sTextBaseline, sColor);
                this.myBackgroundChanged = true;
            };

            CanvasEaselJS.prototype.writeSheetTitle = function (x, y, text, sFontName, iFontSize, sTextAlign, sTextBaseline, sColor) {
                this.writeText(this.myBackgroundStage, "", x, y, text, sFontName, iFontSize, sTextAlign, sTextBaseline, sColor);
                this.myBackgroundChanged = true;
            };

            CanvasEaselJS.prototype.writeToneClockId = function (x, y, text, sFontName, iFontSize, sTextAlign, sTextBaseline, sColor) {
                this.writeText(this.myForegroundStage, "", x, y, text, sFontName, iFontSize, sTextAlign, sTextBaseline, sColor);
                this.myForegroundChanged = true;
            };

            CanvasEaselJS.prototype.writeToneClockName = function (sId, x, y, text, sFontName, iFontSize, sTextAlign, sTextBaseline, sColor) {
                this.writeText(this.myForegroundStage, sId, x, y, text, sFontName, iFontSize, sTextAlign, sTextBaseline, sColor);
                this.myForegroundChanged = true;
            };

            CanvasEaselJS.prototype.writeText = function (aStage, sId, x, y, text, sFontName, iFontSize, sTextAlign, sTextBaseline, sColor) {
                if (sId != "") {
                    this.deleteChildByName(aStage, sId);
                }
                var myText = new createjs.Text(text, iFontSize + "px " + sFontName, sColor);
                myText.name = sId;
                myText.x = x;
                myText.y = y;
                myText.textBaseline = sTextBaseline;
                myText.textAlign = sTextAlign;
                myText.alpha = 1;

                aStage.addChild(myText);
            };

            CanvasEaselJS.prototype.deleteChildByName = function (aStage, sName) {
                var oChild = this.myForegroundStage.getChildByName(sName);

                if (oChild != null) {
                    aStage.removeChild(oChild);
                }
            };
            return CanvasEaselJS;
        })();
        ToneClock.CanvasEaselJS = CanvasEaselJS;
    })(exports.ToneClock || (exports.ToneClock = {}));
    var ToneClock = exports.ToneClock;
});
