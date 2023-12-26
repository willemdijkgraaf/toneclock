/**
 * Created by wimdijkgraaf on 08-06-14.
 */
/// <reference path="./Scripts/typings/jquery/jquery.d.ts" />
/// <reference path="./Scripts/typings/createjs-lib/createjs-lib.d.ts" />
/// <reference path="./Scripts/typings/easeljs/easeljs.d.ts" />
/// <reference path="./../toneclock/Scripts/typings/toneclock/toneclock.d.ts" />
define(["require", "exports"], function (require, exports) {
    var ToneClock;
    (function (ToneClock) {
        "use strict";
        var Canvas = (function () {
            function Canvas(IdOfToneClockArea) {
                this.htmlBackgroundCanvas = document.createElement("canvas");
                this.htmlBackgroundCanvas.setAttribute("class", "foregroundCanvas");
                this.htmlForegroundCanvas = document.createElement("canvas");
                this.htmlForegroundCanvas.setAttribute("class", "foregroundCanvas");
                var myToneClockArea = document.getElementById(IdOfToneClockArea);
                myToneClockArea.appendChild(this.htmlBackgroundCanvas);
                myToneClockArea.appendChild(this.htmlForegroundCanvas);
                // disable browser right click context menu on canvas object
                this.DisableDefaultBrowsersContextMenu(this.htmlBackgroundCanvas);
                this.DisableDefaultBrowsersContextMenu(this.htmlForegroundCanvas);
                this.htmlBackgroundContext = this.htmlBackgroundCanvas.getContext("2d");
                this.htmlForegroundContext = this.htmlForegroundCanvas.getContext("2d");
                this.myBackgroundStage = new createjs.Stage(this.htmlBackgroundCanvas);
                this.myBackgroundStage.enableMouseOver(20);
                this.myForegroundStage = new createjs.Stage(this.htmlForegroundCanvas);
                this.myForegroundStage.enableMouseOver(20);
                // enable touch devices on fore ground stage
                createjs.Touch.enable(this.myForegroundStage);
            }
            Canvas.prototype.DisableDefaultBrowsersContextMenu = function (htmlCanvas) {
                htmlCanvas.oncontextmenu = function (e) {
                    e.preventDefault();
                    return true;
                };
            };
            Canvas.prototype.addEventListener = function (sEvent, fCallback) {
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
            Canvas.prototype.OnHourClick = function (event) {
                // is it the right button?
                if (event.nativeEvent.button === 2) {
                    event.preventDefault();
                    event.stopPropagation();
                    this.OnHourRightClick(event);
                    return false;
                }
                else {
                    this.OnHourLeftClick(event);
                }
            };
            Canvas.prototype.OnHourLeftClick = function (event) {
                if (typeof this.myOnHourClick === "function") {
                    this.myOnHourClick(this.GetObjectId(event));
                }
            };
            Canvas.prototype.OnHourRightClick = function (event) {
                var x = event.stageX;
                var y = event.stageY;
                if (typeof this.myOnHourRightClick === "function") {
                    this.myOnHourRightClick(this.GetObjectId(event), x, y);
                    event.preventDefault();
                    event.stopPropagation();
                    event.cancelBubble = true;
                    event.cancel = true;
                    event.returnValue = false;
                }
            };
            Canvas.prototype.OnHarmonyMouseDown = function (event) {
                // is it the right button?
                if (event.nativeEvent.button === 2) {
                    return false;
                }
                else {
                    this.myHarmonyDragDropX = event.stageX;
                    this.myHarmonyDragDropY = event.stageY;
                }
            };
            Canvas.prototype.OnHarmonyClick = function (event) {
                // is it the right button?
                if (event.nativeEvent.button === 2) {
                    event.preventDefault();
                    event.stopPropagation();
                    this.OnHarmonyRightClick(event);
                    return false;
                }
                else {
                    this.OnHarmonyLeftClick(event);
                }
            };
            Canvas.prototype.OnHarmonyLeftClick = function (event) {
                if (typeof this.myOnHarmonyClick === "function") {
                    this.myOnHarmonyClick(this.GetObjectId(event));
                }
            };
            Canvas.prototype.OnHarmonyRightClick = function (event) {
                var x = event.stageX;
                var y = event.stageY;
                if (typeof this.myOnHarmonyRightClick === "function") {
                    event.preventDefault();
                    event.stopPropagation();
                    this.myOnHarmonyRightClick(this.GetObjectId(event), x, y);
                }
            };
            Canvas.prototype.GetObjectId = function (event) {
                var target = event.target;
                var objectId = target["objectId"];
                return objectId;
            };
            Canvas.prototype.OnHourMouseOver = function (event) {
                var x = event.target["objectX"];
                var y = event.target["objectY"];
                var radius = this.myHighlightedHourRadius;
                var circle = new createjs.Shape();
                circle.graphics.beginFill("#aaaaaa");
                circle.graphics.drawCircle(x, y, radius);
                this.myForegroundStage.addChild(circle);
                this.myForegroundStage.updateCache();
                this.myForegroundStage.update();
                // remember this circle for MouseOut event
                this.myHighlightedHour = circle;
            };
            Canvas.prototype.OnHourMouseOut = function (event) {
                this.myForegroundStage.removeChild(this.myHighlightedHour);
                this.myForegroundStage.updateCache();
                this.myForegroundStage.update();
            };
            Canvas.prototype.OnHourPressMove = function (event) {
                console.log("OnCirclePressMove");
                var stageX = event.stageX;
                var stageY = event.stageY;
                // var distanceX:number = stageX - this.myHourDragDropY;
                // var distanceY:number = stageY - this.myHourDragDropY;
                if (typeof this.myOnHourDragDrop === "function") {
                    this.myOnHourDragDrop(this.GetObjectId(event), stageX, stageY);
                }
            };
            Canvas.prototype.OnHourPressUp = function (event) {
                console.log("OnCirclePressUp");
            };
            Canvas.prototype.OnHarmonyPressMove = function (event) {
                var stageY = event.stageY;
                var distanceY = stageY - this.myHarmonyDragDropY;
                var numberOfSteps = Math.round(distanceY % 20); // in case the browser is zooming in or out
                if ((distanceY > 20) || (distanceY < -20)) {
                    this.myHarmonyDragDropY = stageY;
                    if (typeof this.myOnHarmonyDragDrop === "function") {
                        this.myOnHarmonyDragDrop(this.GetObjectId(event), numberOfSteps, this.myHarmonyDragDropX);
                    }
                }
            };
            Canvas.prototype.OnHarmonyPressUp = function (event) {
                console.log("OnHarmonyPressUp");
            };
            Canvas.prototype.OnHarmonyMouseOver = function (event) {
                event.target.alpha = 0.5;
                this.myForegroundStage.updateCache();
                this.myForegroundStage.update();
            };
            Canvas.prototype.OnHarmonyMouseOut = function (event) {
                event.target.alpha = 0.8;
                this.myForegroundStage.updateCache();
                this.myForegroundStage.update();
            };
            Canvas.prototype.setSize = function (width, height) {
                this.htmlBackgroundCanvas.setAttribute("width", width.toString());
                this.htmlBackgroundCanvas.setAttribute("height", height.toString());
                this.htmlForegroundCanvas.setAttribute("width", width.toString());
                this.htmlForegroundCanvas.setAttribute("height", height.toString());
            };
            Canvas.prototype.updateCacheAndCanvas = function () {
                if (this.myBackgroundChanged === true) {
                    this.myBackgroundStage.updateCache(); // draw all changes in the cache
                    this.myBackgroundStage.update(); // display cache
                    this.myBackgroundChanged = false;
                }
                if (this.myForegroundChanged === true) {
                    this.myForegroundStage.updateCache(); // draw all changes in the cache
                    this.myForegroundStage.update(); // display cache
                    this.myForegroundChanged = false;
                }
            };
            Canvas.prototype.clear = function () {
                this.myBackgroundStage.removeAllChildren();
                this.myForegroundStage.removeAllChildren();
                this.myBackgroundChanged = true;
                this.myForegroundChanged = true;
            };
            Canvas.prototype.setCacheArea = function (x, y, width, height) {
                this.myForegroundStage.cache(x, y, width, height);
                this.myBackgroundStage.cache(x, y, width, height);
            };
            Canvas.prototype.drawCircle = function (x, y, radius, sColor, bFill, id) {
                if (typeof id === "object") {
                    this.deleteChildByObjectId(this.myForegroundStage, id);
                }
                // store the radius for hour highlighting on mouseover event
                this.myHighlightedHourRadius = radius;
                var circle = new createjs.Shape();
                if (bFill) {
                    circle.graphics.beginFill(sColor);
                }
                else {
                    circle.graphics.beginStroke(sColor);
                    circle.graphics.beginFill("#ffffff"); // fill white to make click event work.
                    circle.graphics.setStrokeStyle(0.5);
                }
                circle.graphics.drawCircle(x, y, radius);
                // apply  transparency
                circle.alpha = 0.5;
                // register the id, x and y with the object for event handling
                circle["objectId"] = id;
                circle["objectX"] = x;
                circle["objectY"] = y;
                circle.name = id.toString(); // store for easy retreavel when using function stage.getChildByName(id)
                // register the event handlers
                circle.addEventListener("click", $.proxy(this.OnHourClick, this));
                circle.addEventListener("mouseover", $.proxy(this.OnHourMouseOver, this));
                circle.addEventListener("mouseout", $.proxy(this.OnHourMouseOut, this));
                circle.addEventListener("pressmove", $.proxy(this.OnHourPressMove, this));
                circle.addEventListener("pressup", $.proxy(this.OnHourPressUp, this));
                this.myForegroundStage.addChild(circle);
                this.myForegroundChanged = true;
            };
            Canvas.prototype.drawHarmony = function (aClock, midiNotes, bFill, sColor, id) {
                var toX = 0;
                var toY = 0;
                var endX = 0;
                var endY = 0;
                var bFirstFound = false;
                console.log("harmonyId: " + id);
                if (typeof id === "object") {
                    this.deleteChildByObjectId(this.myForegroundStage, id);
                }
                var g = new createjs.Graphics();
                g.moveTo(endX, endY);
                if (bFill) {
                    g.beginFill(sColor);
                }
                g.beginStroke(sColor);
                for (var i = 0; i < 12; i++) {
                    for (var j = 0; j < midiNotes.length; j++) {
                        if (midiNotes[j] === aClock.hours[i].midiNoteNumber) {
                            toX = aClock.hours[i].xpos;
                            toY = aClock.hours[i].ypos;
                            if (bFirstFound) {
                                g.lineTo(toX, toY);
                                break;
                            }
                            else {
                                g.moveTo(toX, toY);
                                endX = toX;
                                endY = toY;
                                bFirstFound = true;
                                break;
                            }
                        }
                    }
                }
                // a harmonic structure of 1 element should show as a dot
                if (midiNotes.length === 1) {
                    endX += 2;
                    endY += 2;
                }
                g.lineTo(endX, endY);
                g.setStrokeStyle(10);
                var s = new createjs.Shape(g);
                s.alpha = 0.8; // standard alpha for all harmonies.
                // register the id with the  object for event handling
                s["objectId"] = id;
                s.name = id.toString(); // store for easy retreavel when using function stage.getChildByName(id)
                // register the event handlers
                s.addEventListener("mousedown", $.proxy(this.OnHarmonyMouseDown, this));
                s.addEventListener("click", $.proxy(this.OnHarmonyClick, this));
                s.addEventListener("mouseover", $.proxy(this.OnHarmonyMouseOver, this));
                s.addEventListener("mouseout", $.proxy(this.OnHarmonyMouseOut, this));
                s.addEventListener("pressmove", $.proxy(this.OnHarmonyPressMove, this));
                s.addEventListener("pressup", $.proxy(this.OnHarmonyPressUp, this));
                // add the shape to the stage
                this.myForegroundStage.addChild(s);
                this.myForegroundChanged = true;
            };
            Canvas.prototype.writeNoteName = function (objectId, x, y, text, sFontName, iFontSize, sTextAlign, sTextBaseline, sColor) {
                this.writeText(objectId, x, y, text, sFontName, iFontSize, sTextAlign, sTextBaseline, sColor);
                this.myBackgroundChanged = true;
            };
            Canvas.prototype.writeSheetTitle = function (x, y, text, sFontName, iFontSize, sTextAlign, sTextBaseline, sColor) {
                var objectId;
                this.writeText(objectId, x, y, text, sFontName, iFontSize, sTextAlign, sTextBaseline, sColor);
                this.myBackgroundChanged = true;
            };
            Canvas.prototype.writeToneClockId = function (x, y, objectId, sFontName, iFontSize, sTextAlign, sTextBaseline, sColor) {
                var id = objectId.getId1();
                var text = id.toString();
                this.writeText(objectId, x, y, text, sFontName, iFontSize, sTextAlign, sTextBaseline, sColor);
                this.myForegroundChanged = true;
            };
            // public writeToneClockName(id: toneclock.ObjectId , x:number, y:number, text:string, sFontName:string, iFontSize:number, sTextAlign:string, sTextBaseline:string, sColor:string ) {
            //     this.writeText (this.myForegroundStage,id,x,y,text,sFontName,iFontSize,sTextAlign,sTextBaseline,sColor);
            //     this.myForegroundChanged = true;
            // }
            Canvas.prototype.writeText = function (objectId, x, y, text, sFontName, iFontSize, sTextAlign, sTextBaseline, sColor) {
                if (typeof objectId === "object") {
                    this.deleteChildByObjectId(this.myForegroundStage, objectId);
                    this.deleteChildByObjectId(this.myBackgroundStage, objectId);
                }
                var aStage;
                switch (objectId.getObjectType()) {
                    case 7 /* CLOCKNAME */:
                        aStage = this.myBackgroundStage;
                        this.myBackgroundChanged = true;
                        break;
                    case 6 /* CLOCKID */:
                        aStage = this.myForegroundStage;
                        this.myForegroundChanged = true;
                        break;
                    case 3 /* HARMONICFUNCTION */:
                        aStage = this.myBackgroundStage;
                        this.myForegroundChanged = true;
                        break;
                    case 2 /* NOTENAME */:
                        aStage = this.myForegroundStage;
                        this.myForegroundChanged = true;
                        break;
                    case 8 /* PCSETNAME */:
                        aStage = this.myBackgroundStage;
                        this.myBackgroundChanged = true;
                        break;
                }
                var myText = new createjs.Text(text, iFontSize + "px " + sFontName, sColor);
                myText.name = objectId.toString();
                myText.x = x;
                myText.y = y;
                myText.textBaseline = sTextBaseline;
                myText.textAlign = sTextAlign;
                myText.alpha = 1;
                aStage.addChild(myText);
            };
            Canvas.prototype.deleteChildByObjectId = function (aStage, objectId) {
                // Is there an object with the same id as this id in the foreground or in the background?
                var oChild = this.myForegroundStage.getChildByName(objectId.toString());
                // If child exists, delete the it before drawing a new item
                if (oChild != null) {
                    this.myForegroundStage.removeChild(oChild);
                }
                oChild = this.myBackgroundStage.getChildByName(objectId.toString());
                // If child exists, delete it before drawing a new item
                if (oChild != null) {
                    this.myBackgroundStage.removeChild(oChild);
                }
            };
            Canvas.prototype.remove = function (objectId) {
                if (typeof objectId === "object") {
                    this.deleteChildByObjectId(this.myForegroundStage, objectId);
                    this.myForegroundChanged = true;
                    this.deleteChildByObjectId(this.myBackgroundStage, objectId);
                    this.myBackgroundChanged = true;
                }
            };
            return Canvas;
        })();
        ToneClock.Canvas = Canvas;
    })(ToneClock = exports.ToneClock || (exports.ToneClock = {}));
});
//# sourceMappingURL=canvaseaseljs.js.map