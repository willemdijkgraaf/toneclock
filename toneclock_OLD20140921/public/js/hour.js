/**
* Created by wimdijkgraaf on 11-03-14.
*/
var ToneClock;
(function (ToneClock) {
    (function (Align) {
        Align[Align["LEFT"] = 0] = "LEFT";
        Align[Align["CENTER"] = 1] = "CENTER";
        Align[Align["RIGHT"] = 2] = "RIGHT";
    })(ToneClock.Align || (ToneClock.Align = {}));
    var Align = ToneClock.Align;

    (function (Baseline) {
        Baseline[Baseline["TOP"] = 0] = "TOP";
        Baseline[Baseline["MIDDLE"] = 1] = "MIDDLE";
        Baseline[Baseline["BOTTOM"] = 2] = "BOTTOM";
    })(ToneClock.Baseline || (ToneClock.Baseline = {}));
    var Baseline = ToneClock.Baseline;

    var HourCircle = (function () {
        function HourCircle() {
        }
        return HourCircle;
    })();
    ToneClock.HourCircle = HourCircle;

    var HourName = (function () {
        function HourName() {
        }
        return HourName;
    })();
    ToneClock.HourName = HourName;

    var Hour = (function () {
        function Hour() {
            // global variables
            this.name = "";
            this.pitchClass = 0;
            this.isRoot = false;
            this.hour = 1; // counting hours as 1 to 12
            this.radiusOfClock = 0;
            this.x = 0;
            this.y = 0;
            this.radiusOfHour = 0;
            this.writeText = function () {
            };
            this.drawCircle = function () {
            };
        }
        Hour.prototype.getPitchClass = function () {
            return this.pitchClass;
        };

        Hour.prototype.setPitchClass = function (pitchClass) {
            this.pitchClass = pitchClass % 12; // store as a pitch class
        };

        Hour.prototype.getIsRoot = function () {
            return this.isRoot;
        };

        Hour.prototype.setIsRoot = function (isRoot) {
            this.isRoot = isRoot; // store as a pitch class
        };

        Hour.prototype.getHour = function () {
            return this.hour;
        };

        Hour.prototype.setHour = function (hour) {
            this.hour = hour; // store as a pitch class
        };

        Hour.prototype.getRadiusOfClock = function () {
            return this.radiusOfClock;
        };

        Hour.prototype.setRadiusOfClock = function (radiusOfClock) {
            this.radiusOfClock = radiusOfClock;
        };

        Hour.prototype.setXY = function () {
            var hour;
            var radiusOfClock;

            hour = this.hour;
            radiusOfClock = this.radiusOfClock;
            this.x = this.hourToX(hour, radiusOfClock);
            this.y = this.hourToY(hour, radiusOfClock);
        };

        Hour.prototype.getX = function () {
            return this.x;
        };

        Hour.prototype.getY = function () {
            return this.y;
        };

        Hour.prototype.getName = function () {
            return this.name;
        };

        Hour.prototype.setName = function (name) {
            this.name = name;
        };

        Hour.prototype.getSize = function () {
            return this.radiusOfHour * 2;
        };

        Hour.prototype.setSize = function (size) {
            this.radiusOfHour = size / 2;
        };

        Hour.prototype.draw = function () {
            this.drawHour();
            this.drawName();
        };

        Hour.prototype.drawHour = function () {
            // draw the circle
            var oCircle = new HourCircle();

            oCircle.radius = 0;
            oCircle.color = "#000000";
            oCircle.fill = false;

            oCircle.x = this.x;
            oCircle.y = this.y;

            if (this.isRoot) {
                oCircle.radius = this.radiusOfHour * 1.20; // an hour representing a root is 20% bigger
                oCircle.color = "#ff0000";
                oCircle.fill = true;
            } else {
                oCircle.radius = this.radiusOfClock;
            }

            this.drawCircle(oCircle);
        };

        Hour.prototype.drawName = function () {
            var oName = new HourName();

            oName.color = "#000000";
            oName.align = 1 /* CENTER */;
            oName.baseline = 1 /* MIDDLE */;

            oName.x = this.hourToX(this.hour, this.radiusOfClock + (2 * this.radiusOfHour));
            oName.y = this.hourToY(this.hour, this.radiusOfClock + (2 * this.radiusOfHour));

            this.writeText(oName); // executes stored callback function
        };

        Hour.prototype.onDrawHour = function (drawCircle) {
            this.drawCircle = drawCircle;
        };

        Hour.prototype.onDrawName = function (writeText) {
            this.writeText = writeText;
        };

        Hour.prototype.hourToX = function (hour, radius) {
            var x;
            var radianMultiplier;

            x = 0;
            radianMultiplier = Math.PI / 180;
            x = Math.cos((hour * 30 - 90) * radianMultiplier) * radius;
            return x;
        };

        Hour.prototype.hourToY = function (hour, radius) {
            var y;
            var radianMultiplier;

            y = 0;
            radianMultiplier = Math.PI / 180;
            y = Math.sin((hour * 30 - 90) * radianMultiplier) * radius;
            return y;
        };
        return Hour;
    })();
    ToneClock.Hour = Hour;
})(ToneClock || (ToneClock = {}));
//# sourceMappingURL=hour.js.map
