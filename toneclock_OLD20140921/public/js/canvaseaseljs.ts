/**
 * Created by wimdijkgraaf on 08-06-14.
 */
/// <reference path="easeljs.d.ts" />

// import createjs = require ("createjs");
import jquery = require ("jquery");

export module ToneClock {
    export class CanvasEaselJS {
        htmlBackgroundCanvas: HTMLCanvasElement;
        htmlForegroundCanvas: HTMLCanvasElement;
        htmlBackgroundContext: CanvasRenderingContext2D;
        htmlForegroundContext: CanvasRenderingContext2D;

        myBackgroundStage:createjs.Stage;
        myForegroundStage:createjs.Stage;
        myBackgroundChanged;boolean; // true if background has been changed and should be updated
        myForegroundChanged:boolean; // true if foreground has been changed and should be updated

        // drag & drop start coordinates
        myHourDragDropY:number;
        myHourDragDropX:number;
        myHarmonyDragDropY:number;
        myHarmonyDragDropX:number;



        // observers
        myOnHourClick:Function;
        myOnHourRightClick:Function;
        myOnHourDragDrop:Function;

        myOnHarmonyClick:Function;
        myOnHarmonyRightClick:Function;
        myOnHarmonyDragDrop:Function;


        // mouse over highlighting
        myHighlightedHour:createjs.Shape;
        myHighlightedHourRadius:number;

        public constructor ( toneClockArea:string ) {
            this.htmlBackgroundCanvas = document.createElement("canvas");
            this.htmlBackgroundCanvas.setAttribute("class","foregroundCanvas");

            this.htmlForegroundCanvas = document.createElement("canvas");
            this.htmlForegroundCanvas.setAttribute("class","foregroundCanvas");

            var myToneClockArea = document.getElementById( toneClockArea );
            myToneClockArea.appendChild(this.htmlBackgroundCanvas);
            myToneClockArea.appendChild(this.htmlForegroundCanvas);

            // disable browser right click context menu on canvas object
            this.DisableDefaultBrowsersContextMenu(this.htmlBackgroundCanvas);
            this.DisableDefaultBrowsersContextMenu(this.htmlForegroundCanvas);


            this.htmlBackgroundContext = this.htmlBackgroundCanvas.getContext("2d");
            this.htmlForegroundContext = this.htmlForegroundCanvas.getContext("2d");


            this.myBackgroundStage = new createjs.Stage( this.htmlBackgroundCanvas );
            this.myBackgroundStage.enableMouseOver(20);
            this.myForegroundStage = new createjs.Stage( this.htmlForegroundCanvas );
            this.myForegroundStage.enableMouseOver(20);
        }

        private DisableDefaultBrowsersContextMenu (htmlCanvas: HTMLCanvasElement) {
            htmlCanvas.oncontextmenu=function(e){
                e.preventDefault();
                return true;
            }
        }

        public addEventListener(sEvent: string, fCallback:Function) {
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
        }

        public OnCircleClick (event) {
            // is it the right button?
            if ( event.nativeEvent.button == 2 ) {
                event.preventDefault();
                event.stopPropagation();
                this.OnCircleRightClick (event);
                return false;
            } else {
                this.OnCircleLeftClick (event);
            }
        }
        public OnCircleLeftClick ( event ) {

            if (typeof this.myOnHourClick === 'function') {
                this.myOnHourClick( this.GetObjectId ( event ));
            }
        }

        public OnCircleRightClick ( event ) {
            var x:number = event.stageX;
            var y:number = event.stageY;

            if (typeof this.myOnHourRightClick === 'function') {
                this.myOnHourRightClick( this.GetObjectId ( event ), x, y);
            }
        }

        public OnHarmonyMouseDown (event) {
            // is it the right button?
            if ( event.nativeEvent.button == 2 ) {
                return false;
            } else {
                this.myHarmonyDragDropX = event.stageX;
                this.myHarmonyDragDropY = event.stageY;
            }
        }

        public OnHarmonyClick (event) {
            // is it the right button?
            if ( event.nativeEvent.button == 2 ) {
                event.preventDefault();
                event.stopPropagation();
                this.OnHarmonyRightClick (event);
                return false;
            } else {
                this.OnHarmonyLeftClick (event);
            }
        }

        public OnHarmonyLeftClick ( event ) {

            if (typeof this.myOnHarmonyClick === 'function') {
                this.myOnHarmonyClick( this.GetObjectId ( event ));
            }
        }

        public OnHarmonyRightClick ( event ) {
            var x:number = event.stageX;
            var y:number = event.stageY;

            if (typeof this.myOnHarmonyRightClick === 'function') {
                this.myOnHarmonyRightClick( this.GetObjectId ( event ), x, y);
            }
        }


        private GetObjectId ( event ) {
            var target:Object = event.target;
            var objectId:string = target["objectId"];

            return objectId;
        }

        public OnCircleMouseOver (event) {
            var x:number = event.target['objectX'];
            var y:number = event.target['objectY'];
            var radius:number = this.myHighlightedHourRadius;


            var circle = new createjs.Shape();
            circle.graphics.beginFill("#aaaaaa");
            circle.graphics.drawCircle( x, y, radius);

            this.myForegroundStage.addChild(circle);
            this.myForegroundStage.updateCache();
            this.myForegroundStage.update();

            // remember this circle for MouseOut event
            this.myHighlightedHour = circle;
        }

        public OnCircleMouseOut (event) {
            this.myForegroundStage.removeChild(this.myHighlightedHour);
            this.myForegroundStage.updateCache();
            this.myForegroundStage.update();
        }

        public OnCirclePressMove (event) {
            console.log("OnCirclePressMove");

            var stageX:number = event.stageX;
            var stageY:number = event.stageY;
            // var distanceX:number = stageX - this.myHourDragDropY;
            // var distanceY:number = stageY - this.myHourDragDropY;

            if (typeof this.myOnHourDragDrop === 'function') {
                this.myOnHourDragDrop( this.GetObjectId ( event ), stageX, stageY);
            }
        }

        public OnCirclePressUp (event) {
            console.log("OnCirclePressUp");
        }

        public OnHarmonyPressMove (event) {
            var stageY:number = event.stageY;
            var distanceY:number = stageY - this.myHarmonyDragDropY;
            var numberOfSteps = Math.round(distanceY%20); // in case the browser is zooming in or out

            if (( distanceY > 20) || (distanceY < -20)) {
                this.myHarmonyDragDropY = stageY;

                if (typeof this.myOnHarmonyDragDrop === 'function') {
                    this.myOnHarmonyDragDrop( this.GetObjectId ( event ), numberOfSteps, this.myHarmonyDragDropX);
                }
            }
        }

        public OnHarmonyPressUp (event) {
            console.log("OnHarmonyPressUp");
        }

        public OnHarmonyMouseOver (event) {
            event.target.alpha = 0.5;
            this.myForegroundStage.updateCache();
            this.myForegroundStage.update();
        }

        public OnHarmonyMouseOut (event) {
            event.target.alpha = 0.8;
            this.myForegroundStage.updateCache();
            this.myForegroundStage.update();
        }

        public setSize ( width: number, height: number ) {
            this.htmlBackgroundCanvas.setAttribute( "width", width.toString() );
            this.htmlBackgroundCanvas.setAttribute( "height", height.toString() );
            this.htmlForegroundCanvas.setAttribute( "width", width.toString() );
            this.htmlForegroundCanvas.setAttribute( "height", height.toString() );
        }

        public updateCacheAndCanvas () {
            if (this.myBackgroundChanged === true) {
                this.myBackgroundStage.updateCache(); // draw all changes in the cache
                this.myBackgroundStage.update();      // display cache
                this.myBackgroundChanged = false;
            }
            if (this.myForegroundChanged === true) {
                this.myForegroundStage.updateCache(); // draw all changes in the cache
                this.myForegroundStage.update();      // display cache
                this.myForegroundChanged = false;
            }
        }

        public clearCanvas () {
            this.myBackgroundStage.removeAllChildren();
            this.myForegroundStage.removeAllChildren();

            this.myBackgroundChanged = true;
            this.myForegroundChanged = true;

        }

        public SetCanvasCacheArea ( x: number, y: number, width: number, height: number) {
            this.myForegroundStage.cache (x, y, width, height);
            this.myBackgroundStage.cache (x, y, width, height);
        }

        public drawCircle ( x:number, y:number, radius:number, sColor:string, bFill:boolean, id:string) {

            if (id != "") {
                this.deleteChildByName(this.myForegroundStage, id);
            }

            // store the radius for hour highlighting on mouseover event
            this.myHighlightedHourRadius = radius;

            var circle = new createjs.Shape();

            if (bFill) {
                circle.graphics.beginFill(sColor);
            } else {
                circle.graphics.beginStroke(sColor);
                circle.graphics.beginFill("#ffffff"); // fill white to make click event work.
                circle.graphics.setStrokeStyle(0.5);
            }
            circle.graphics.drawCircle( x, y, radius);
            // apply  transparency
            circle.alpha = 0.5;

            // register the id, x and y with the object for event handling
            circle['objectId'] = id;
            circle['objectX'] = x;
            circle['objectY'] = y;
            circle.name = id; // store for easy retreavel when using function stage.getChildByName(id)

            // register the event handlers
            circle.addEventListener("click", $.proxy(this.OnCircleClick, this ));
            circle.addEventListener("mouseover", $.proxy(this.OnCircleMouseOver, this ));
            circle.addEventListener("mouseout", $.proxy(this.OnCircleMouseOut, this ));
            circle.addEventListener("pressmove", $.proxy(this.OnCirclePressMove, this ));
            circle.addEventListener("pressup", $.proxy(this.OnCirclePressUp, this ));

            this.myForegroundStage.addChild(circle);
            this.myForegroundChanged = true;
        }

        public drawHarmony ( aClock, arrayHarmony, bFill:boolean, sColor:string, id:string ) {
            var toX:number = 0;
            var toY:number = 0;
            var endX:number = 0;
            var endY:number = 0;
            var bFirstFound:boolean = false;

            if (id != "") {
                this.deleteChildByName(this.myForegroundStage, id);
            }

            this.myForegroundStage.removeChild(this.myForegroundStage.getChildByName(id));
            // var path = new createjs.Shape();
            var g = new createjs.Graphics();

            g.moveTo(endX, endY);

            if (bFill) {
                g.beginFill(sColor);
            }

            g.beginStroke(sColor);

            for (var i = 0; i < 12; i++){
                for (var j = 0; j < arrayHarmony.length ; j++) {

                    if ( arrayHarmony[j] === aClock.hours[i].midiNoteNumber ) {
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
            if (arrayHarmony.length === 1) {
                endX += 2;
                endY += 2;
            }

            g.lineTo(endX, endY);
            g.setStrokeStyle(10);

            var s = new createjs.Shape(g);
            s.alpha = 0.8; // standard alpha for all harmonies.

            // register the id with the  object for event handling
            s['objectId'] = id;
            s.name = id; // store for easy retreavel when using function stage.getChildByName(id)

            // register the event handlers
            s.addEventListener("mousedown", $.proxy(this.OnHarmonyMouseDown, this ));
            s.addEventListener("click", $.proxy(this.OnHarmonyClick, this ));
            s.addEventListener("mouseover", $.proxy(this.OnHarmonyMouseOver, this ));
            s.addEventListener("mouseout", $.proxy(this.OnHarmonyMouseOut, this ));
            s.addEventListener("pressmove", $.proxy(this.OnHarmonyPressMove, this ));
            s.addEventListener("pressup", $.proxy(this.OnHarmonyPressUp, this ));

            // add the shape to the stage
            this.myForegroundStage.addChild(s);
            this.myForegroundChanged = true;
        }

        public writeNoteName ( x:number, y:number, text:string, sFontName:string, iFontSize:number, sTextAlign:string, sTextBaseline:string, sColor:string ) {
            this.writeText (this.myBackgroundStage,"", x,y,text,sFontName,iFontSize,sTextAlign,sTextBaseline,sColor);
            this.myBackgroundChanged = true;
        }

        public writeSheetTitle (  x:number, y:number, text:string, sFontName:string, iFontSize:number, sTextAlign:string, sTextBaseline:string, sColor:string ) {
            this.writeText (this.myBackgroundStage,"", x,y,text,sFontName,iFontSize,sTextAlign,sTextBaseline,sColor);
            this.myBackgroundChanged = true;
        }

        public writeToneClockId ( x:number, y:number, text:string, sFontName:string, iFontSize:number, sTextAlign:string, sTextBaseline:string, sColor:string ) {
            this.writeText (this.myForegroundStage,"", x,y,text,sFontName,iFontSize,sTextAlign,sTextBaseline,sColor);
            this.myForegroundChanged = true;
        }

        public writeToneClockName ( sId:string, x:number, y:number, text:string, sFontName:string, iFontSize:number, sTextAlign:string, sTextBaseline:string, sColor:string ) {
            this.writeText (this.myForegroundStage,sId,x,y,text,sFontName,iFontSize,sTextAlign,sTextBaseline,sColor);
            this.myForegroundChanged = true;
        }

        public writeText ( aStage, sId:string, x:number, y:number, text:string, sFontName:string, iFontSize:number, sTextAlign:string, sTextBaseline:string, sColor:string ) {
            if (sId != "") {
                this.deleteChildByName(aStage, sId);
            }
            var myText = new createjs.Text(text, iFontSize + "px " + sFontName, sColor);
            myText.name = sId;
            myText.x = x;
            myText.y= y;
            myText.textBaseline = sTextBaseline;
            myText.textAlign = sTextAlign;
            myText.alpha = 1;

            aStage.addChild(myText);
        }

        private deleteChildByName (aStage, sName ) {
            // Is there an object with the same id as this id.
            var oChild:createjs.DisplayObject = this.myForegroundStage.getChildByName(sName)
            // If child exists, delete the old harmony before drawing a new harmony
            if ( oChild != null ) {
                aStage.removeChild(oChild);
            }
        }
    }
}