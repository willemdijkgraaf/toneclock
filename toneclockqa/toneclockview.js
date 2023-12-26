define(["require", "exports", 'canvaseaseljs', 'sheet', 'clock', 'toneclockmath'], function(require, exports, canvas, sheet, clock, toneclockmath) {
    (function (ToneClock) {
        var View = (function () {
            function View(IdOfParentElement, subscriber) {
                this.sNAME = "Tone Clock";
                this.sVERSION = "1.2";
                this.myCanvas = new canvas.ToneClock.Canvas(IdOfParentElement);
                this.myMath = new toneclockmath.ToneClock.Math();

                // register event handlers
                this.myCanvas.addEventListener("OnHourRightClick", $.proxy(this.OnHourRightClick, this));
                this.myCanvas.addEventListener("OnHourClick", $.proxy(this.OnHourLeftClick, this));
                this.myCanvas.addEventListener("OnHarmonyDragDrop", $.proxy(this.OnHarmonyDragDrop, this));
                this.myCanvas.addEventListener("OnHarmonyRightClick", $.proxy(this.OnHarmonyRightClick, this));

                // register subscriber
                this.mySubscriber = subscriber;
            }
            View.prototype.addHarmony = function () {
                var toneClockId = this.myOnHarmonyRightClickObjectId;
                var harmonyId = this.Sheet.getUniqueHarmonyId(toneClockId);
                var sColor = "#000000";
                var bFill = true;
                var aMidiNotes = [0, 4, 8];

                this.Sheet.addHarmony(toneClockId, harmonyId, sColor, bFill, aMidiNotes);
                this.myCanvas.updateCacheAndCanvas();
            };

            View.prototype.deleteHarmony = function () {
                var harmonyId = this.myOnHarmonyRightClickObjectId;

                this.Sheet.deleteHarmony(harmonyId);
                this.myCanvas.updateCacheAndCanvas();
            };

            View.prototype.moveHarmonyToFront = function () {
                var harmonyId = this.myOnHarmonyRightClickObjectId;

                this.Sheet.moveHarmony(harmonyId, 0 /* TO_FRONT */);
                this.myCanvas.updateCacheAndCanvas();
            };

            View.prototype.moveHarmonyToBack = function () {
                var harmonyId = this.myOnHarmonyRightClickObjectId;

                this.Sheet.moveHarmony(harmonyId, 3 /* TO_BACK */);
                this.myCanvas.updateCacheAndCanvas();
            };

            View.prototype.moveHarmonyBackward = function () {
                var harmonyId = this.myOnHarmonyRightClickObjectId;

                this.Sheet.moveHarmony(harmonyId, 2 /* BACKWARD */);
                this.myCanvas.updateCacheAndCanvas();
            };

            View.prototype.moveHarmonyForward = function () {
                var harmonyId = this.myOnHarmonyRightClickObjectId;

                this.Sheet.moveHarmony(harmonyId, 1 /* FORWARD */);
                this.myCanvas.updateCacheAndCanvas();
            };

            View.prototype.setSheet = function (aJSONSheet) {
                this.Sheet = new sheet.ToneClock.Sheet(this.myCanvas, aJSONSheet);
            };

            View.prototype.toggleRoot = function () {
                this.Sheet.toggleRoot(this.myOnHourRightClickObjectId);
            };

            View.prototype.OnHarmonyRightClick = function (objectId, x, y) {
                // store the objectId for later usage
                console.log("harmonyId rightClock: " + objectId);
                this.myOnHarmonyRightClickObjectId = objectId;

                // get the toneclock
                var aObjectId = this.myMath.ObjectIdToArray(objectId);
                var aClock = this.Sheet.getClock(aObjectId[0]);

                // get the color
                var color = this.Sheet.Clock.getColorOfHarmony(objectId, aClock);

                // call subscriber to handle event
                this.mySubscriber.OnHarmonyContextShow(x, y, color);

                return false;
            };

            View.prototype.OnHarmonyColorChange = function (color) {
                var objectId = this.myOnHarmonyRightClickObjectId;

                this.Sheet.setColorOfHarmony(objectId, color);
                this.myCanvas.updateCacheAndCanvas();
            };

            View.prototype.OnHourRightClick = function (objectId, x, y) {
                // store the objectId for later usage
                this.myOnHourRightClickObjectId = objectId;

                // call subscriber to handle event
                this.mySubscriber.OnHourContextShow(x, y);

                return false;
            };

            View.prototype.OnHourContextMenuClick = function (invokedOn, selectedMenu) {
                switch (selectedMenu.id) {
                    case "toggleRoot":
                        this.Sheet.toggleRoot(this.myOnHourRightClickObjectId);
                        break;
                }
            };

            View.prototype.OnHourLeftClick = function (objectId) {
                this.Sheet.toggleHour(objectId);
            };

            View.prototype.OnHarmonyDragDrop = function (objectId, steps, x, aNNPrefs) {
                // only transpose in small steps
                if (Math.abs(steps) < 4) {
                    var aObjectId = this.myMath.ObjectIdToArray(objectId);
                    var clockIndex = aObjectId[0];
                    var harmonyId = aObjectId[1];

                    var theClock = this.Sheet.getClock(clockIndex);

                    // if the drag&drop x is higher than the middle of the clock, than the transposition should be reversed
                    var middleX = theClock.xpos + this.Sheet.getClockCanvasSize() / 2;
                    if (x < middleX) {
                        steps = steps * -1;
                    }

                    var styleId = this.Sheet.getNoteNameStyle();
                    this.Sheet.transposeHarmony(objectId, steps);

                    this.myCanvas.updateCacheAndCanvas();
                }
            };

            View.prototype.setClockProperties = function (toneClockId, sToneClockName, bDisplayRoot, iRootNoteNumber) {
                var aClock = this.Sheet.getClock(toneClockId);
                if (typeof (aClock) !== "undefined") {
                    aClock.id = toneClockId;
                    aClock.name = sToneClockName;
                    aClock.displayRoot = bDisplayRoot;
                    aClock.rootNoteNumber = iRootNoteNumber;
                }
            };

            View.prototype.removeHarmoniesFromSheet = function () {
                this.Sheet.removeHarmoniesFromSheet(this.Sheet.getClocksVertical(), this.Sheet.getClocksHorizontal());
            };
            return View;
        })();
        ToneClock.View = View;
    })(exports.ToneClock || (exports.ToneClock = {}));
    var ToneClock = exports.ToneClock;
});
//# sourceMappingURL=toneclockview.js.map
