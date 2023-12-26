/// <reference path="./../toneclock/Scripts/typings/toneclock/toneclock.d.ts" />
define(["require", "exports"], function (require, exports) {
    var ToneClock;
    (function (ToneClock) {
        "use strict";
        var ObjectId = (function () {
            // constructor(id1: number, id2: number);
            // constructor(id: string);
            function ObjectId(id1Orid, id2, objectType) {
                if (typeof id1Orid === "number") {
                    this.id1 = id1Orid;
                    this.id2 = id2;
                    this.objectType = objectType;
                }
                else {
                    var aId = this.stringToArray(id1Orid);
                    this.id1 = aId[0];
                    this.id2 = aId[1];
                    this.objectType = aId[2];
                }
            }
            ObjectId.prototype.getObjectType = function () {
                return this.objectType;
            };
            ObjectId.prototype.getId1 = function () {
                return this.id1;
            };
            ObjectId.prototype.getId2 = function () {
                return this.id2;
            };
            ObjectId.prototype.toString = function () {
                var id;
                id = "[" + this.id1 + "," + this.id2 + "," + this.objectType + "]";
                return id;
            };
            ObjectId.prototype.toArray = function () {
                return [this.id1, this.id2, this.objectType];
            };
            ObjectId.prototype.stringToArray = function (objectId) {
                var aId = JSON.parse(objectId);
                return aId;
            };
            return ObjectId;
        })();
        ToneClock.ObjectId = ObjectId;
    })(ToneClock = exports.ToneClock || (exports.ToneClock = {}));
});
//# sourceMappingURL=objectid.js.map