/**
 * Created by wimdijkgraaf on 11-03-14.
 */
module ToneClock {

    export enum Align {
        LEFT,
        CENTER,
        RIGHT
    }

    export enum Baseline {
        TOP,
        MIDDLE,
        BOTTOM
    }

    export class HourCircle {
        x: number;
        y: number;
        radius: number;
        color: string;
        fill: boolean;
        drawCircle: Function;
    }

    export class HourName {
        x: number;
        y: number;
        color: string;
        align: Align;
        baseline: Baseline;
        writeText: () => {};
    }

    export class Hour {
        name: string;
        pitchClass: number;
        isRoot: boolean;
        hour: number;
        radiusOfClock: number;
        x: number;
        y: number;
        radiusOfHour: number;
        drawCircle: Function;
        writeText: Function;

        constructor() {
            // global variables
            this.name = "";
            this.pitchClass = 0;
            this.isRoot = false;
            this.hour = 1; // counting hours as 1 to 12
            this.radiusOfClock = 0;
            this.x = 0;
            this.y = 0;
            this.radiusOfHour = 0;
            this.writeText = function () {};
            this.drawCircle = function () {};
        }

        getPitchClass() {
            return this.pitchClass;
        }

        setPitchClass(pitchClass:number) {
            this.pitchClass = pitchClass % 12; // store as a pitch class
        }

        getIsRoot() {
            return this.isRoot;
        }

        setIsRoot(isRoot:boolean) {
            this.isRoot = isRoot; // store as a pitch class
        }

        getHour() {
            return this.hour;
        }

        setHour(hour: number) {
            this.hour = hour; // store as a pitch class
        }

        getRadiusOfClock() {
            return this.radiusOfClock;
        }

        setRadiusOfClock(radiusOfClock: number) {
            this.radiusOfClock = radiusOfClock;
        }

        setXY() {
            var hour: number;
            var radiusOfClock: number;

            hour = this.hour;
            radiusOfClock = this.radiusOfClock;
            this.x = this.hourToX(hour, radiusOfClock);
            this.y = this.hourToY(hour, radiusOfClock);
        }

        getX() {
            return this.x;
        }

        getY() {
            return this.y;
        }

        getName() {
            return this.name;
        }

        setName(name:string) {
            this.name = name;
        }

        getSize() {
            return this.radiusOfHour * 2;
        }

        setSize(size: number) {
            this.radiusOfHour = size / 2;
        }

        draw() {
            this.drawHour();
            this.drawName();
        }

        private drawHour() {
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
            }
            else {
                oCircle.radius = this.radiusOfClock;
            }

            this.drawCircle(oCircle);
        }

        private drawName() {
            var oName = new HourName();

            oName.color = "#000000";
            oName.align = Align.CENTER;
            oName.baseline = Baseline.MIDDLE;

            oName.x = this.hourToX(this.hour, this.radiusOfClock + (2 * this.radiusOfHour));
            oName.y = this.hourToY(this.hour, this.radiusOfClock + (2 * this.radiusOfHour));

            this.writeText(oName); // executes stored callback function
        }

        onDrawHour(drawCircle:Function) {
            this.drawCircle = drawCircle;
        }

        onDrawName(writeText:Function) {
            this.writeText = writeText;
        }

        hourToX(hour:number, radius:number) {
            var x: number;
            var radianMultiplier: number;

            x = 0;
            radianMultiplier = Math.PI / 180;
            x = Math.cos((hour * 30 - 90) * radianMultiplier) * radius;
            return x;
        }

        hourToY(hour:number, radius:number) {
            var y: number;
            var radianMultiplier:number;

            y = 0;
            radianMultiplier = Math.PI / 180;
            y = Math.sin((hour * 30 - 90) * radianMultiplier) * radius;
            return y;
        }
    }
}
