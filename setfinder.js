/// <reference path="./Scripts/typings/toneclock/toneclock.d.ts" />
define(["require", "exports"], function (require, exports) {
    /**
     * Created by wimdijkgraaf on 09-06-14.
     */
    var ToneClock;
    (function (ToneClock) {
        "use strict";
        var SetFinder = (function () {
            function SetFinder() {
                this.primedata = new Array(352);
                this.cardinality = 0; // cardinality = number of boxes checked
                this.curimg = "i01";
                this.adj = 0;
                // Note: following two arrays contain 2*card elements
                //   the first (0) -> (card-1) elements contain the original check box numbers
                //   the second (card) -> (2*card - 1) elements contain
                //             the original check box numbers plus 12
                //
                // This is done to make it easier to compute rotations (when looking for the normal form)
                this.pcOriginal = new Array(24); // original checked numbers
                this.pcInversion = new Array(24); // inversions of the checked numbers (12-x)
                this.pcForte = "";
                this.pcIVec = "";
                this.pcInv = "";
                this.pcPrime = "";
                this.isForte = true;
                this.pcOrigPPrime = new Array(12);
                this.pcInvPPrime = new Array(12);
                this.pcPPrime = new Array(12);
                this.FORTE = 0;
                this.INTERVALVECTOR = 1;
                this.CURIMAGE = 2;
                this.INVERSE = 3;
                this.primedata["-"] = ["", "", "i01", ""];
                this.primedata["0"] = ["", "", "i11", ""];
                this.primedata["01"] = ["", "<100000>", "i21", ""];
                this.primedata["02"] = ["", "<010000>", "i22", ""];
                this.primedata["03"] = ["", "<001000>", "i23", ""];
                this.primedata["04"] = ["", "<000100>", "i24", ""];
                this.primedata["05"] = ["", "<000010>", "i25", ""];
                this.primedata["06"] = ["", "<000001>", "i26", ""];
                this.primedata["012"] = ["3-1", "<210000>", "i31", ""];
                this.primedata["013"] = ["3-2", "<111000>", "i32", "[0,2,3]"];
                this.primedata["014"] = ["3-3", "<101100>", "i33", "[0,3,4]"];
                this.primedata["015"] = ["3-4", "<100110>", "i34", "[0,4,5]"];
                this.primedata["016"] = ["3-5", "<100011>", "i35", "[0,5,6]"];
                this.primedata["024"] = ["3-6", "<020100>", "i36", ""];
                this.primedata["025"] = ["3-7", "<011010>", "i37", "[0,3,5]"];
                this.primedata["026"] = ["3-8", "<010101>", "i38", "[0,4,6]"];
                this.primedata["027"] = ["3-9", "<010020>", "i39", ""];
                this.primedata["036"] = ["3-10", "<002001>", "i310", ""];
                this.primedata["037"] = ["3-11", "<001110>", "i311", "[0,4,7]"];
                this.primedata["048"] = ["3-12", "<000300>", "i312", ""];
                this.primedata["0123"] = ["4-1", "<321000>", "i41", ""];
                this.primedata["0124"] = ["4-2", "<221100>", "i42", "[0,2,3,4]"];
                this.primedata["0134"] = ["4-3", "<212100>", "i43", ""];
                this.primedata["0125"] = ["4-4", "<211110>", "i44", "[0,3,4,5]"];
                this.primedata["0126"] = ["4-5", "<210111>", "i45", "[0,4,5,6]"];
                this.primedata["0127"] = ["4-6", "<210021>", "i46", ""];
                this.primedata["0145"] = ["4-7", "<201210>", "i47", ""];
                this.primedata["0156"] = ["4-8", "<200121>", "i48", ""];
                this.primedata["0167"] = ["4-9", "<200022>", "i49", ""];
                this.primedata["0235"] = ["4-10", "<122010>", "i410", ""];
                this.primedata["0135"] = ["4-11", "<121110>", "i411", "[0,2,4,5]"];
                this.primedata["0236"] = ["4-12", "<112101>", "i412", "[0,3,4,6]"];
                this.primedata["0136"] = ["4-13", "<112011>", "i413", "[0,3,5,6]"];
                this.primedata["0237"] = ["4-14", "<111120>", "i414", "[0,4,5,7]"];
                this.primedata["0146"] = ["4-Z15", "<111111>", "i4Z15", "[0,2,5,6]"];
                this.primedata["0137"] = ["4-Z29", "<111111>", "i4Z29", "[0,4,6,7]"];
                this.primedata["0157"] = ["4-16", "<110121>", "i416", "[0,2,6,7]"];
                this.primedata["0347"] = ["4-17", "<102210>", "i417", ""];
                this.primedata["0147"] = ["4-18", "<102111>", "i418", "[0,3,6,7]"];
                this.primedata["0148"] = ["4-19", "<101310>", "i419", "[0,3,4,8]"];
                this.primedata["0158"] = ["4-20", "<101220>", "i420", ""];
                this.primedata["0246"] = ["4-21", "<030201>", "i421", ""];
                this.primedata["0247"] = ["4-22", "<021120>", "i422", "[0,3,5,7]"];
                this.primedata["0257"] = ["4-23", "<021030>", "i423", ""];
                this.primedata["0248"] = ["4-24", "<020301>", "i424", ""];
                this.primedata["0268"] = ["4-25", "<020202>", "i425", ""];
                this.primedata["0358"] = ["4-26", "<012120>", "i426", ""];
                this.primedata["0258"] = ["4-27", "<012111>", "i427", "[0,3,6,8]"];
                this.primedata["0369"] = ["4-28", "<004002>", "i428", ""];
                this.primedata["01234"] = ["5-1", "<432100>", "i51", ""];
                this.primedata["01235"] = ["5-2", "<332110>", "i52", "[0,2,3,4,5]"];
                this.primedata["01245"] = ["5-3", "<322210>", "i53", "[0,1,3,4,5]"];
                this.primedata["01236"] = ["5-4", "<322111>", "i54", "[0,3,4,5,6]"];
                this.primedata["01237"] = ["5-5", "<321121>", "i55", "[0,4,5,6,7]"];
                this.primedata["01256"] = ["5-6", "<311221>", "i56", "[0,1,4,5,6]"];
                this.primedata["01267"] = ["5-7", "<310132>", "i57", "[0,1,5,6,7]"];
                this.primedata["02346"] = ["5-8", "<232201>", "i58", ""];
                this.primedata["01246"] = ["5-9", "<231211>", "i59", "[0,2,4,5,6]"];
                this.primedata["01346"] = ["5-10", "<223111>", "i510", "[0,2,3,5,6]"];
                this.primedata["02347"] = ["5-11", "<222220>", "i511", "[0,3,4,5,7]"];
                this.primedata["01356"] = ["5-Z12", "<222121>", "i5Z12", ""];
                this.primedata["01247"] = ["5-Z36", "<222121>", "i5Z36", "[0,3,5,6,7]"];
                this.primedata["01248"] = ["5-13", "<221311>", "i513", "[0,2,3,4,8]"];
                this.primedata["01257"] = ["5-14", "<221131>", "i514", "[0,2,5,6,7]"];
                this.primedata["01268"] = ["5-15", "<220222>", "i515", ""];
                this.primedata["01347"] = ["5-16", "<213211>", "i516", "[0,3,4,6,7]"];
                this.primedata["01348"] = ["5-Z17", "<212320>", "i5Z17", ""];
                this.primedata["03458"] = ["5-Z37", "<212320>", "i5Z37", ""];
                this.primedata["01457"] = ["5-Z18", "<212221>", "i5Z18", "[0,2,3,6,7]"];
                this.primedata["01258"] = ["5-Z38", "<212221>", "i5Z38", "[0,3,6,7,8]"];
                this.primedata["01367"] = ["5-19", "<212122>", "i519", "[0,1,4,6,7]"];
                this.primedata["01378"] = ["5-20", "<211231>", "i520", "[0,1,5,7,8]"];
                this.primedata["01568"] = ["5-20", "<211231>", "i520", "[0,2,3,7,8]"];
                this.primedata["01458"] = ["5-21", "<202420>", "i521", "[0,3,4,7,8]"];
                this.primedata["01478"] = ["5-22", "<202321>", "i522", ""];
                this.primedata["02357"] = ["5-23", "<132130>", "i523", "[0,2,4,5,7]"];
                this.primedata["01357"] = ["5-24", "<131221>", "i524", "[0,2,4,6,7]"];
                this.primedata["02358"] = ["5-25", "<123121>", "i525", "[0,3,5,6,8]"];
                this.primedata["02458"] = ["5-26", "<122311>", "i526", "[0,3,4,6,8]"];
                this.primedata["01358"] = ["5-27", "<122230>", "i527", "[0,3,5,7,8]"];
                this.primedata["02368"] = ["5-28", "<122212>", "i528", "[0,2,5,6,8]"];
                this.primedata["01368"] = ["5-29", "<122131>", "i529", "[0,2,5,7,8]"];
                this.primedata["01468"] = ["5-30", "<121321>", "i530", "[0,2,4,7,8]"];
                this.primedata["01369"] = ["5-31", "<114112>", "i531", "[0,2,3,6,9]"];
                this.primedata["01469"] = ["5-32", "<113221>", "i532", "[0,2,5,6,9]"];
                this.primedata["02468"] = ["5-33", "<040402>", "i533", ""];
                this.primedata["02469"] = ["5-34", "<032221>", "i534", ""];
                this.primedata["02479"] = ["5-35", "<032140>", "i535", ""];
                this.primedata["012345"] = ["6-1", "<543210>", "i61", ""];
                this.primedata["012346"] = ["6-2", "<443211>", "i62", "[0,2,3,4,5,6]"];
                this.primedata["012356"] = ["6-Z3", "<433221>", "i6Z3", "[0,1,3,4,5,6]"];
                this.primedata["012347"] = ["6-Z36", "<433221>", "i6Z36", "[0,3,4,5,6,7]"];
                this.primedata["012456"] = ["6-Z4", "<432321>", "i6Z4", ""];
                this.primedata["012348"] = ["6-Z37", "<432321>", "i6Z37", ""];
                this.primedata["012367"] = ["6-5", "<422232>", "i65", "[0,1,4,5,6,7]"];
                this.primedata["012567"] = ["6-Z6", "<421242>", "i6Z6", ""];
                this.primedata["012378"] = ["6-Z38", "<421242>", "i6Z38", ""];
                this.primedata["012678"] = ["6-7", "<420243>", "i67", ""];
                this.primedata["023457"] = ["6-8", "<343230>", "i68", ""];
                this.primedata["012357"] = ["6-9", "<342231>", "i69", "[0,2,4,5,6,7]"];
                this.primedata["013457"] = ["6-Z10", "<333321>", "i6Z10", "[0,2,3,4,6,7]"];
                this.primedata["023458"] = ["6-Z39", "<333321>", "i6Z39", "[0,3,4,5,6,8]"];
                this.primedata["012457"] = ["6-Z11", "<333231>", "i6Z11", "[0,2,3,5,6,7]"];
                this.primedata["012358"] = ["6-Z40", "<333231>", "i6Z40", "[0,3,5,6,7,8]"];
                this.primedata["012467"] = ["6-Z12", "<332232>", "i6Z12", "[0,1,3,5,6,7]"];
                this.primedata["012368"] = ["6-Z41", "<332232>", "i6Z41", "[0,2,5,6,7,8]"];
                this.primedata["013467"] = ["6-Z13", "<324222>", "i6Z13", ""];
                this.primedata["012369"] = ["6-Z42", "<324222>", "i6Z42", ""];
                this.primedata["013458"] = ["6-14", "<323430>", "i614", "[0,3,4,5,7,8]"];
                this.primedata["012458"] = ["6-15", "<323421>", "i615", "[0,3,4,6,7,8]"];
                this.primedata["014568"] = ["6-16", "<322431>", "i616", "[0,2,3,4,7,8]"];
                this.primedata["012478"] = ["6-Z17", "<322332>", "i6Z17", "[0,1,4,6,7,8]"];
                this.primedata["012568"] = ["6-Z43", "<322332>", "i6Z43", "[0,2,3,6,7,8]"];
                this.primedata["012578"] = ["6-18", "<322242>", "i618", "[0,1,3,6,7,8]"];
                this.primedata["013478"] = ["6-Z19", "<313431>", "i6Z19", "[0,1,4,5,7,8]"];
                this.primedata["012569"] = ["6-Z44", "<313431>", "i6Z44", "[0,1,4,5,6,9]"];
                this.primedata["014589"] = ["6-20", "<303630>", "i620", ""];
                this.primedata["023468"] = ["6-21", "<242412>", "i621", "[0,2,4,5,6,8]"];
                this.primedata["012468"] = ["6-22", "<241422>", "i622", "[0,2,4,6,7,8]"];
                this.primedata["023568"] = ["6-Z23", "<234222>", "i6Z23", ""];
                this.primedata["023469"] = ["6-Z45", "<234222>", "i6Z45", ""];
                this.primedata["013468"] = ["6-Z24", "<233331>", "i6Z24", "[0,2,4,5,7,8]"];
                this.primedata["012469"] = ["6-Z46", "<233331>", "i6Z46", "[0,2,4,5,6,9]"];
                this.primedata["013568"] = ["6-Z25", "<233241>", "i6Z25", "[0,2,3,5,7,8]"];
                this.primedata["012479"] = ["6-Z47", "<233241>", "i6Z47", "[0,2,3,4,7,9]"];
                this.primedata["013578"] = ["6-Z26", "<232341>", "i6Z26", ""];
                this.primedata["012579"] = ["6-Z48", "<232341>", "i6Z48", ""];
                this.primedata["013469"] = ["6-27", "<225222>", "i627", "[0,2,3,5,6,9]"];
                this.primedata["013569"] = ["6-Z28", "<224322>", "i6Z28", ""];
                this.primedata["013479"] = ["6-Z49", "<224322>", "i6Z49", ""];
                this.primedata["013689"] = ["6-Z29", "<224232>", "i6Z29", ""];
                this.primedata["023679"] = ["6-Z29", "<224232>", "i6Z29", ""];
                this.primedata["014679"] = ["6-Z50", "<224232>", "i6Z50", ""];
                this.primedata["013679"] = ["6-30", "<224223>", "i630", "[0,2,3,6,8,9]"];
                this.primedata["013589"] = ["6-31", "<223431>", "i631", "[0,1,4,6,8,9]"];
                this.primedata["014579"] = ["6-31", "<223431>", "i631", "[0,2,4,5,8,9]"];
                this.primedata["024579"] = ["6-32", "<143250>", "i632", ""];
                this.primedata["023579"] = ["6-33", "<143241>", "i633", "[0,2,4,6,7,9]"];
                this.primedata["013579"] = ["6-34", "<142422>", "i634", "[0,2,4,6,8,9]"];
                this.primedata["02468A"] = ["6-35", "<060603>", "i635", ""];
                this.primedata["0123456"] = ["7-1", "<654321>", "i71", ""];
                this.primedata["0123457"] = ["7-2", "<554331>", "i72", "[0,2,3,4,5,6,7]"];
                this.primedata["0123458"] = ["7-3", "<544431>", "i73", "[0,3,4,5,6,7,8]"];
                this.primedata["0123467"] = ["7-4", "<544332>", "i74", "[0,1,3,4,5,6,7]"];
                this.primedata["0123567"] = ["7-5", "<543342>", "i75", "[0,1,2,4,5,6,7]"];
                this.primedata["0123478"] = ["7-6", "<533442>", "i76", "[0,1,4,5,6,7,8]"];
                this.primedata["0123678"] = ["7-7", "<532353>", "i77", "[0,1,2,5,6,7,8]"];
                this.primedata["0234568"] = ["7-8", "<454422>", "i78", ""];
                this.primedata["0123468"] = ["7-9", "<453432>", "i79", "[0,2,4,5,6,7,8]"];
                this.primedata["0123469"] = ["7-10", "<445332>", "i710", "[0,2,3,4,5,6,9]"];
                this.primedata["0134568"] = ["7-11", "<444441>", "i711", "[0,2,3,4,5,7,8]"];
                this.primedata["0123479"] = ["7-Z12", "<444342>", "i7Z12", ""];
                this.primedata["0123568"] = ["7-Z36", "<444342>", "i7Z36", "[0,2,3,5,6,7,8]"];
                this.primedata["0124568"] = ["7-13", "<443532>", "i713", "[0,2,3,4,6,7,8]"];
                this.primedata["0123578"] = ["7-14", "<443352>", "i714", "[0,1,3,5,6,7,8]"];
                this.primedata["0124678"] = ["7-15", "<442443>", "i715", ""];
                this.primedata["0123569"] = ["7-16", "<435432>", "i716", "[0,1,3,4,5,6,9]"];
                this.primedata["0124569"] = ["7-Z17", "<434541>", "i7Z17", ""];
                this.primedata["0134578"] = ["7-Z37", "<434541>", "i7Z37", ""];
                this.primedata["0123589"] = ["7-Z18", "<434442>", "i7Z18", "[0,2,3,4,5,8,9]"];
                this.primedata["0124578"] = ["7-Z38", "<434442>", "i7Z38", "[0,1,3,4,6,7,8]"];
                this.primedata["0123679"] = ["7-19", "<434343>", "i719", "[0,1,2,3,6,8,9]"];
                this.primedata["0124789"] = ["7-20", "<433452>", "i720", "[0,1,2,5,7,8,9]"];
                this.primedata["0125679"] = ["7-20", "<433452>", "i720", "[0,2,3,4,7,8,9]"];
                this.primedata["0124589"] = ["7-21", "<424641>", "i721", "[0,1,3,4,5,8,9]"];
                this.primedata["0125689"] = ["7-22", "<424542>", "i722", ""];
                this.primedata["0234579"] = ["7-23", "<354351>", "i723", "[0,2,4,5,6,7,9]"];
                this.primedata["0123579"] = ["7-24", "<353442>", "i724", "[0,2,4,6,7,8,9]"];
                this.primedata["0234679"] = ["7-25", "<345342>", "i725", "[0,2,3,5,6,7,9]"];
                this.primedata["0134579"] = ["7-26", "<344532>", "i726", "[0,2,4,5,6,8,9]"];
                this.primedata["0124579"] = ["7-27", "<344451>", "i727", "[0,2,4,5,7,8,9]"];
                this.primedata["0135679"] = ["7-28", "<344433>", "i728", "[0,2,3,4,6,8,9]"];
                this.primedata["0124679"] = ["7-29", "<344352>", "i729", "[0,2,3,5,7,8,9]"];
                this.primedata["0124689"] = ["7-30", "<343542>", "i730", "[0,1,3,5,7,8,9]"];
                this.primedata["0134679"] = ["7-31", "<336333>", "i731", "[0,2,3,5,6,8,9]"];
                this.primedata["0134689"] = ["7-32", "<335442>", "i732", "[0,1,3,5,6,8,9]"];
                this.primedata["012468A"] = ["7-33", "<262623>", "i733", ""];
                this.primedata["013468A"] = ["7-34", "<254442>", "i734", ""];
                this.primedata["013568A"] = ["7-35", "<254361>", "i735", ""];
                this.primedata["01234567"] = ["8-1", "<765442>", "i81", ""];
                this.primedata["01234568"] = ["8-2", "<665542>", "i82", "[0,2,3,4,5,6,7,8]"];
                this.primedata["01234569"] = ["8-3", "<656542>", "i83", ""];
                this.primedata["01234578"] = ["8-4", "<655552>", "i84", "[0,1,3,4,5,6,7,8]"];
                this.primedata["01234678"] = ["8-5", "<654553>", "i85", "[0,1,2,4,5,6,7,8]"];
                this.primedata["01235678"] = ["8-6", "<654463>", "i86", ""];
                this.primedata["01234589"] = ["8-7", "<645652>", "i87", ""];
                this.primedata["01234789"] = ["8-8", "<644563>", "i88", ""];
                this.primedata["01236789"] = ["8-9", "<644464>", "i89", ""];
                this.primedata["02345679"] = ["8-10", "<566452>", "i810", ""];
                this.primedata["01234579"] = ["8-11", "<565552>", "i811", "[0,2,4,5,6,7,8,9]"];
                this.primedata["01345679"] = ["8-12", "<556543>", "i812", "[0,2,3,4,5,6,8,9]"];
                this.primedata["01234679"] = ["8-13", "<556453>", "i813", "[0,2,3,5,6,7,8,9]"];
                this.primedata["01245679"] = ["8-14", "<555562>", "i814", "[0,2,3,4,5,7,8,9]"];
                this.primedata["01234689"] = ["8-Z15", "<555553>", "i8Z15", "[0,1,3,5,6,7,8,9]"];
                this.primedata["01235679"] = ["8-Z29", "<555553>", "i8Z29", "[0,2,3,4,6,7,8,9]"];
                this.primedata["01235789"] = ["8-16", "<554563>", "i816", "[0,1,2,4,6,7,8,9]"];
                this.primedata["01345689"] = ["8-17", "<546652>", "i817", ""];
                this.primedata["01235689"] = ["8-18", "<546553>", "i818", "[0,1,3,4,6,7,8,9]"];
                this.primedata["01245689"] = ["8-19", "<545752>", "i819", "[0,1,3,4,5,7,8,9]"];
                this.primedata["01245789"] = ["8-20", "<545662>", "i820", ""];
                this.primedata["0123468A"] = ["8-21", "<474643>", "i821", ""];
                this.primedata["0123568A"] = ["8-22", "<465562>", "i822", "[0,1,3,4,5,6,8,A]"];
                this.primedata["0123578A"] = ["8-23", "<465472>", "i823", ""];
                this.primedata["0124568A"] = ["8-24", "<464743>", "i824", ""];
                this.primedata["0124678A"] = ["8-25", "<464644>", "i825", ""];
                this.primedata["0124579A"] = ["8-26", "<456562>", "i826", ""];
                this.primedata["0134578A"] = ["8-26", "<456562>", "i826", ""];
                this.primedata["0124578A"] = ["8-27", "<456553>", "i827", "[0,1,3,4,6,7,8,A]"];
                this.primedata["0134679A"] = ["8-28", "<448444>", "i828", ""];
                this.primedata["012345678"] = ["9-1", "<876663>", "i91", ""];
                this.primedata["012345679"] = ["9-2", "<777663>", "i92", "[0,2,3,4,5,6,7,8,9]"];
                this.primedata["012345689"] = ["9-3", "<767763>", "i93", "[0,1,3,4,5,6,7,8,9]"];
                this.primedata["012345789"] = ["9-4", "<766773>", "i94", "[0,1,2,4,5,6,7,8,9]"];
                this.primedata["012346789"] = ["9-5", "<766674>", "i95", "[0,1,2,3,5,6,7,8,9]"];
                this.primedata["01234568A"] = ["9-6", "<686763>", "i96", ""];
                this.primedata["01234578A"] = ["9-7", "<677673>", "i97", "[0,1,3,4,5,6,7,8,A]"];
                this.primedata["01234678A"] = ["9-8", "<676764>", "i98", "[0,1,2,4,5,6,7,8,A]"];
                this.primedata["01235678A"] = ["9-9", "<676683>", "i99", ""];
                this.primedata["01234679A"] = ["9-10", "<668664>", "i910", ""];
                this.primedata["01235679A"] = ["9-11", "<667773>", "i911", "[0,1,2,4,5,6,7,9,A]"];
                this.primedata["01245689A"] = ["9-12", "<666963>", "i912", ""];
                this.primedata["0123456789"] = ["", "<988884>", "iA1", ""];
                this.primedata["012345678A"] = ["", "<898884>", "iA2", ""];
                this.primedata["012345679A"] = ["", "<889884>", "iA3", ""];
                this.primedata["012345689A"] = ["", "<888984>", "iA4", ""];
                this.primedata["012345789A"] = ["", "<888894>", "iA5", ""];
                this.primedata["012346789A"] = ["", "<888885>", "iA6", ""];
                this.primedata["0123456789A"] = ["", "<AAAAA5>", "iB1", ""];
                this.primedata["0123456789AB"] = ["", "<CCCCC6>", "iC1", ""];
            }
            SetFinder.prototype.initialize = function () {
                this.pcPrime = "";
                this.pcForte = "";
                this.pcIVec = "";
                this.pcInv = "";
                this.cardinality = 0;
                this.curimg = "i01";
            };
            SetFinder.prototype.getNames = function (pitchClassArray) {
                this.findSet(pitchClassArray);
                var aPcsNames = {
                    "forteCode": this.getForteCode(),
                    "intervalVector": this.getIntervalVector(),
                    "primeForm": this.getPrimeForm(),
                    "primeInversion": this.getInversion()
                };
                return aPcsNames;
            };
            SetFinder.prototype.getIntervalVector = function () {
                return this.pcIVec;
            };
            SetFinder.prototype.getForteCode = function () {
                return this.pcForte;
            };
            SetFinder.prototype.getPrimeForm = function () {
                return this.pcPrime;
            };
            SetFinder.prototype.getInversion = function () {
                return this.pcInv;
            };
            SetFinder.prototype.findSet = function (pitchClassArray) {
                // pitchClassArray : is an array of 12 elements of type boolean. The cardinality represents the pitch class. True will include that pitch class
                // Compute Cardinality and create 1st half of the pcOriginal array
                this.cardinality = 0;
                var i;
                for (i = 0; i < 12; i++) {
                    if (pitchClassArray[i]) {
                        this.pcOriginal[this.cardinality] = i;
                        this.cardinality++;
                    }
                }
                if (this.cardinality == 0) {
                    this.pcForte = "";
                    this.pcIVec = "";
                    this.pcInv = "";
                    this.pcPrime = "";
                    this.curimg = "i01";
                    return;
                }
                for (i = 0; i < this.cardinality; i++) {
                    this.pcOriginal[this.cardinality + i] = this.pcOriginal[i] + 12;
                }
                for (i = 0; i < this.cardinality; i++) {
                    this.pcInversion[i] = 12 - this.pcOriginal[this.cardinality - i - 1];
                    this.pcInversion[this.cardinality + i] = this.pcInversion[i] + 12;
                }
                this.ComputePrime();
            };
            SetFinder.prototype.ComputePrime = function () {
                var pcString = "(";
                var pcCondensed = "";
                var sTmp = "";
                if (this.cardinality == 0) {
                    return;
                }
                this.ComputePartialPrime(this.pcOriginal, this.pcOrigPPrime);
                this.ComputePartialPrime(this.pcInversion, this.pcInvPPrime);
                this.ComparePartialPrimes();
                for (var i = 0; i < this.cardinality; i++) {
                    if (i > 0) {
                        pcString = pcString + "," + this.pcPPrime[i];
                    }
                    else {
                        pcString = pcString + this.pcPPrime[i];
                    }
                }
                pcString = pcString + ")";
                this.pcPrime = pcString;
                for (i = 0; i < this.cardinality; i++) {
                    pcCondensed = pcCondensed + this.pcPPrime[i].toString(16).toUpperCase();
                }
                if (this.cardinality == 0) {
                    pcCondensed = "-";
                }
                sTmp = this.primedata[pcCondensed];
                this.pcForte = sTmp[this.FORTE];
                this.pcIVec = sTmp[this.INTERVALVECTOR];
                this.curimg = sTmp[this.CURIMAGE];
                if (sTmp[this.INVERSE] != "") {
                    this.pcInv = sTmp[this.INVERSE];
                }
                else {
                    this.pcInv = "(same as prime form)";
                }
            };
            SetFinder.prototype.ComputePartialPrime = function (pc, pcout) {
                var best = 0; // The best rotation found so far
                var adj = 0; // Adjustment applied based on the algorithm type (Temp var)
                var cardinality = this.cardinality - 1;
                for (var i = 1; i <= cardinality; i++) {
                    // Test to see if the size of the set is smaller than we've found so far
                    if ((pc[i + cardinality] - pc[i]) < (pc[best + cardinality] - pc[best])) {
                        best = i;
                        continue;
                    }
                    // Test to see if the sizes are the same, if so, we go into tie-breaker mode
                    if ((pc[i + cardinality] - pc[i]) == (pc[best + cardinality] - pc[best])) {
                        for (var j = 1; j < (cardinality); j++) {
                            if (this.isForte) {
                                adj = j;
                            }
                            else {
                                adj = cardinality - j;
                            }
                            // is the new interval better?
                            if ((pc[i + adj] - pc[i]) < (pc[best + adj] - pc[best])) {
                                best = i; // then it becomes the best and we're done
                                break;
                            }
                            else if ((pc[i + adj] - pc[i]) > (pc[best + adj] - pc[best])) {
                                break;
                            }
                        }
                    }
                }
                for (i = 0; i <= cardinality; i++) {
                    pcout[i] = pc[best + i] - pc[best];
                }
            };
            SetFinder.prototype.ComparePartialPrimes = function () {
                var bestPrime = 0; // Assume pcOrigPrime is best until we know otherwise
                for (var i = 0; i < this.cardinality; i++) {
                    if (this.isForte) {
                        this.adj = i;
                    }
                    else {
                        this.adj = this.cardinality - i - 1;
                    }
                    // is the new interval better?
                    if ((this.pcInvPPrime[this.adj] - this.pcInvPPrime[0]) < (this.pcOrigPPrime[this.adj] - this.pcOrigPPrime[0])) {
                        bestPrime = 1; // then inverted form becomes the best and we're done
                        break;
                    }
                    else if ((this.pcInvPPrime[this.adj] - this.pcInvPPrime[0]) > (this.pcOrigPPrime[this.adj] - this.pcOrigPPrime[0])) {
                        break;
                    }
                }
                if (bestPrime == 0) {
                    for (i = 0; i < this.cardinality; i++) {
                        this.pcPPrime[i] = this.pcOrigPPrime[i];
                    }
                }
                else {
                    for (i = 0; i < this.cardinality; i++) {
                        this.pcPPrime[i] = this.pcInvPPrime[i];
                    }
                }
            };
            return SetFinder;
        })();
        ToneClock.SetFinder = SetFinder;
    })(ToneClock = exports.ToneClock || (exports.ToneClock = {}));
});
//# sourceMappingURL=setfinder.js.map