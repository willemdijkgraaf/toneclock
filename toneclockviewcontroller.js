﻿/**
* Created by wimdijkgraaf on 09-06-14.
*/
define(["require", "exports", 'toneclockview', 'toneclockcontroller', 'toneclockmath', "bootstrap"], function(require, exports, view, controller, toneclockmath) {
    (function (ToneClock) {
        var ViewController = (function () {
            function ViewController() {
            }
            ViewController.prototype.logEvent = function (event) {
                window.appInsights.logEvent(event);
            };

            ViewController.prototype.initializeToneClock = function () {
                this.tcView = new view.ToneClock.View("toneClockArea", this);
                this.tcController = new controller.ToneClock.Controller(this.tcView);
                this.tcMath = new toneclockmath.ToneClock.Math();

                this.getToneClockSheet("peterschat.json"); // start with this sheet

                // prevent context menu
                window.addEventListener('contextmenu', this.blockContextMenu);

                // show dialog with introductory video
                $("#introductionPopup").modal("show");
            };

            ViewController.prototype.blockContextMenu = function (e) {
                console.log("event intercepted!");
                e.preventDefault();
            };

            ViewController.prototype.getToneClockSheet = function (sJSONSource) {
                this.tcController.initializeState(sJSONSource, $.proxy(this.OnNewSheetLoaded, this));
            };

            ViewController.prototype.OnNewSheetLoaded = function () {
                this.setValuesOfPreferencesDialog();
            };

            ViewController.prototype.setValuesOfAboutDialog = function () {
                var e = document.getElementById("toneClockVersion");
                e.innerText = this.tcView.sVERSION;
            };

            ViewController.prototype.OnHarmonyContextShow = function (x, y, color) {
                // set color of color picker in harmony context menu
                this.SetColorOfHarmonyColorPicker(color);

                // show context menu
                $("#harmonyContextMenu").css({
                    left: x,
                    top: y,
                    position: "absolute",
                    'z-index': 1000,
                    display: "block",
                    'list-style': "none",
                    visibility: "visible",
                    opacity: 1
                });
            };

            ViewController.prototype.SetColorOfHarmonyColorPicker = function (color) {
                console.log("colorpicker: " + document.getElementById("harmonyColorPicker").style.backgroundColor);
                var aElement = document.getElementById("harmonyColorPicker");

                aElement.style.backgroundColor = color;
                aElement.value = color;

                this.logEvent("Set Color of Harmony");
            };

            ViewController.prototype.OnHourContextShow = function (x, y) {
                $("#hourContextMenu").css({
                    left: x,
                    top: y,
                    position: "absolute",
                    'z-index': 1000,
                    display: "block",
                    'list-style': "none",
                    visibility: "visible",
                    opacity: 1
                });
            };

            ViewController.prototype.setValuesOfPreferencesDialog = function () {
                // set sliders
                $("#sliderClocksHorizontal").slider("option", "value", this.tcView.Sheet.getClocksHorizontal());
                $("#sliderClocksHorizontal .ui-slider-handle:first").attr("data-original-title", this.tcView.Sheet.getClocksHorizontal());

                $("#sliderClocksVertical").slider("option", "value", this.tcView.Sheet.getClocksVertical());
                $("#sliderClocksVertical .ui-slider-handle:first").attr("data-original-title", this.tcView.Sheet.getClocksVertical());

                $("#sliderNoteNameRotation").slider("option", "value", this.tcView.Sheet.getNoteNameRotation());
                $("#sliderNoteNameRotation .ui-slider-handle:first").attr("data-original-title", this.tcView.Sheet.getNoteNameRotation());

                $("#sliderSheetTransposition").slider("option", "value", this.tcView.Sheet.getSheetTransposition());
                $("#sliderSheetTransposition .ui-slider-handle:first").attr("data-original-title", this.tcView.Sheet.getSheetTransposition());

                $("#sliderNoteNameMargin").slider("option", "value", this.tcView.Sheet.getNoteNameMargin());
                $("#sliderNoteNameMargin .ui-slider-handle:first").attr("data-original-title", this.tcView.Sheet.getNoteNameMargin());

                $("#sliderSizeClock").slider("option", "value", this.tcView.Sheet.getClockSize());
                $("#sliderSizeClock .ui-slider-handle:first").attr("data-original-title", this.tcView.Sheet.getClockSize());

                $("#sliderSizeClockCanvas").slider("option", "value", this.tcView.Sheet.getClockCanvasSize());
                $("#sliderSizeClockCanvas .ui-slider-handle:first").attr("data-original-title", this.tcView.Sheet.getClockCanvasSize());

                $("#sliderSizeFont").slider("option", "value", this.tcView.Sheet.getNoteNameFontSize());
                $("#sliderSizeFont .ui-slider-handle:first").attr("data-original-title", this.tcView.Sheet.getNoteNameFontSize());

                $("#sliderSizeHour").slider("option", "value", this.tcView.Sheet.getHourSize());
                $("#sliderSizeHour .ui-slider-handle:first").attr("data-original-title", this.tcView.Sheet.getHourSize());

                // set radio buttons: interval
                var sRadioButtonId = "";
                var radio;

                switch (this.tcView.Sheet.getNoteNameStyle()) {
                    case 0:
                        sRadioButtonId = "#contextRadioFourths";
                        break;
                    case 1:
                        sRadioButtonId = "#contextRadioSeconds";
                        break;
                }
                radio = $(sRadioButtonId);
                radio[0].checked = true;

                switch (this.tcView.Sheet.getNoteNameDirection()) {
                    case true:
                        sRadioButtonId = "#contextRadioClockwise";
                        break;
                    case false:
                        sRadioButtonId = "#contextRadioAntiClockwise";
                        break;
                }
                radio = $(sRadioButtonId);
                radio[0].checked = true;

                switch (this.tcView.Sheet.getNoteNameFlat()) {
                    case true:
                        sRadioButtonId = "#contextRadioFlat";
                        break;
                    case false:
                        sRadioButtonId = "#contextRadioSharp";
                        break;
                }
                radio = $(sRadioButtonId);
                radio[0].checked = true;
            };

            ViewController.prototype.loadSheet = function () {
                document.getElementById("loadFile").click();
            };

            ViewController.prototype.hideHarmonyContextMenu = function () {
                document.getElementById("harmonyContextMenu").style.cssText = "opacity:0;visibility:hidden;z-index:0;";
                document.getElementById("harmonyContextMenu").className = "dropdown-menu .contextMenuHide";
            };

            ViewController.prototype.OnHarmonyAddClick = function () {
                this.tcView.addHarmony();
                this.hideHarmonyContextMenu();
                this.logEvent("Harmony.Add");
            };

            ViewController.prototype.OnHarmonyDeleteClick = function () {
                this.tcView.deleteHarmony();
                this.hideHarmonyContextMenu();
                this.logEvent("Harmony.Delete");
            };

            ViewController.prototype.OnHarmonyMoveToFront = function () {
                this.tcView.moveHarmonyToFront();
                this.hideHarmonyContextMenu();
                this.logEvent("Harmony.MoveToFront");
            };

            ViewController.prototype.OnHarmonyMoveToBack = function () {
                this.tcView.moveHarmonyToBack();
                this.hideHarmonyContextMenu();
                this.logEvent("Harmony.MoveToBack");
            };

            ViewController.prototype.OnHarmonyMoveForward = function () {
                this.tcView.moveHarmonyForward();
                this.hideHarmonyContextMenu();
                this.logEvent("Harmony.MoveForward");
            };

            ViewController.prototype.OnHarmonyMoveBackward = function () {
                this.tcView.moveHarmonyBackward();
                this.hideHarmonyContextMenu();
                this.logEvent("Harmony.MoveBackward");
            };

            ViewController.prototype.Initialize = function () {
                this.initializeToneClock();
                this.setValuesOfAboutDialog();
                var that = this;

                // register event handlers
                //add click listener on menu items
                $("#toggleRoot").on('click', $.proxy(this.tcView.toggleRoot, this.tcView));
                $("#addHarmony").on('click', $.proxy(this.OnHarmonyAddClick, this));
                $("#deleteHarmony").on('click', $.proxy(this.OnHarmonyDeleteClick, this));
                $("#bringHarmonyToFront").on('click', $.proxy(this.OnHarmonyMoveToFront, this));
                $("#bringHarmonyForward").on('click', $.proxy(this.OnHarmonyMoveForward, this));
                $("#sendHarmonyBackward").on('click', $.proxy(this.OnHarmonyMoveBackward, this));
                $("#sendHarmonyToBack").on('click', $.proxy(this.OnHarmonyMoveToBack, this));

                // set event handler if harmony Color Picker value changed
                $("#harmonyColorPicker").on("change", function (event) {
                    var color = document.getElementById("harmonyColorPicker").style.backgroundColor;

                    color = that.tcMath.rgbToHex(color);
                    console.log("color: " + color);
                    document.getElementById("harmonyColorPicker").style.backgroundColor = color;

                    that.tcView.OnHarmonyColorChange(color);
                    that.logEvent("Harmony.ChangeColor");
                });

                // set event handler if harmony Color Picker input changed
                $("#harmonyColorPicker").on("input", function (event) {
                    var color = document.getElementById("harmonyColorPicker").style.backgroundColor;

                    color = that.tcMath.rgbToHex(color);
                    console.log("color: " + color);
                    document.getElementById("harmonyColorPicker").style.backgroundColor = color;

                    that.tcView.OnHarmonyColorChange(color);
                    that.logEvent("Harmony.ChangeColor");
                });

                // set event handler if harmony Color Picker close button
                $("#harmonyColorPicker").on("blur", function (event) {
                    document.getElementById("harmonyContextMenu").style.cssText = "opacity:0;visibility:hidden;z-index:0;";
                    document.getElementById("harmonyContextMenu").className = "dropdown-menu .contextMenuHide";
                });

                $(document).bind("click", function (event) {
                    document.getElementById("hourContextMenu").style.cssText = "opacity:0;visibility:hidden;z-index:0;";
                    document.getElementById("hourContextMenu").className = "dropdown-menu .contextMenuHide";
                    // document.getElementById("harmonyContextMenu").style.cssText = "opacity:0;visibility:hidden;z-index:0;";
                    // document.getElementById("harmonyContextMenu").className = "dropdown-menu .contextMenuHide";
                });

                $("#menuSheetEmptyA44x5").click(function (event, ui) {
                    that.getToneClockSheet("emptyA44x5.json");
                    that.logEvent("Sheet.Load.emptyA44x5");
                });

                $("#menu4BasicTriads").click(function (event, ui) {
                    that.getToneClockSheet("4basictriads.json");
                    that.logEvent("Sheet.Load.4basictriads");
                });

                $("#menu5Basic7thChords").click(function (event, ui) {
                    that.getToneClockSheet("5basic7thchords.json");
                    that.logEvent("Sheet.Load.5basic7thchords");
                });

                $("#menuMajorTriadsOverMinorHarmony").click(function (event, ui) {
                    that.getToneClockSheet("majortriadsoverminorharmony.json");
                    that.logEvent("Sheet.Load.majortriadsoverminorharmony");
                });

                $("#menuMajorModes").click(function (event, ui) {
                    that.getToneClockSheet("majormodes.json");
                    that.logEvent("Sheet.Load.majormodes");
                });

                $("#menuMelodicMinorModes").click(function (event, ui) {
                    that.getToneClockSheet("melodicminormodes.json");
                    that.logEvent("Sheet.Load.melodicminormodes");
                });

                $("#menuPeterSchat").click(function (event, ui) {
                    that.getToneClockSheet("peterschat.json");
                    that.logEvent("Sheet.Load.peterschat");
                });

                $("#menuSheetV7").click(function (event, ui) {
                    that.getToneClockSheet("dominant7th.json");
                    that.logEvent("Sheet.Load.dominant7th");
                });

                $("#menuDiminishedScale").click(function (event, ui) {
                    that.getToneClockSheet("diminishedscale.json");
                    that.logEvent("Sheet.Load.diminishedscale");
                });

                $("#menuSheetIntervals").click(function (event, ui) {
                    that.getToneClockSheet("intervals.json");
                    that.logEvent("Sheet.Load.intervals");
                });

                $("#menuSheetTrichords").click(function (event, ui) {
                    that.getToneClockSheet("trichords.json");
                    that.logEvent("Sheet.Load.trichords");
                });

                $("#menuSheetTetrachords").click(function (event, ui) {
                    that.getToneClockSheet("tetrachords.json");
                    that.logEvent("Sheet.Load.tetrachords");
                });

                $("#menuSheetPentachords").click(function (event, ui) {
                    that.getToneClockSheet("pentachords.json");
                    that.logEvent("Sheet.Load.pentachords");
                });

                $("#menuSheetHexachords").click(function (event, ui) {
                    that.getToneClockSheet("hexachords.json");
                    that.logEvent("Sheet.Load.hexachords");
                });

                $("#menuSheetHeptachords").click(function (event, ui) {
                    that.getToneClockSheet("heptachords.json");
                    that.logEvent("Sheet.Load.heptachords");
                });

                $("#menuSheetOctachords").click(function (event, ui) {
                    that.getToneClockSheet("octachords.json");
                    that.logEvent("Sheet.Load.octachords");
                });

                $("#menuSheetMessiaen").click(function (event, ui) {
                    that.getToneClockSheet("messiaen.json");
                    that.logEvent("Sheet.Load.messiaen");
                });

                $("#menuPreferences").click(function (event, ui) {
                    $("#preferencesPopup").modal("show");
                    that.logEvent("Preference.Open");
                });

                $("#menuAbout").click(function (event, ui) {
                    $("#aboutPopup").modal("show");
                    that.logEvent("About.Open");
                });

                $("#menuSave").click(function (event, ui) {
                    that.tcController.saveSheet();
                    that.logEvent("Sheet.Save");
                });

                $("#menuOpen").click(function (event, ui) {
                    that.loadSheet();
                    that.logEvent("Sheet.Open");
                });

                $("#loadFile").change(function (event, ui) {
                    that.tcController.handleFileSelect(event);
                });

                $("#menuPrint").click(function (event, ui) {
                    $("#menu").hide("blind");
                    window.print();
                    $("#menu ").show("blind");
                    that.logEvent("Sheet.Print");
                });

                $("#menuHelpIntroduction").click(function (event, ui) {
                    $("#introductionPopup").modal("show");
                    that.logEvent("Help.Introduction");
                });

                $('#tabNotes a').click(function (e) {
                    e.preventDefault();
                    $(this).tab('show');
                });

                $('#tabSizes a').click(function (e) {
                    e.preventDefault();
                    $(this).tab('show');
                });

                $('#tabCanvas a').click(function (e) {
                    e.preventDefault();
                    $(this).tab('show');
                });

                $("#contextRadioFourths").on('change', function (event, ui) {
                    that.tcView.Sheet.setNoteNameInterval(0);
                    that.tcView.Sheet.draw();
                    that.logEvent("Preference.NoteNames.InFourths");
                });

                $("#contextRadioSeconds").on('change', function (event, ui) {
                    that.tcView.Sheet.setNoteNameInterval(1);
                    that.tcView.Sheet.draw();
                    that.logEvent("Preference.NoteNames.InSeconds");
                });

                $("#contextRadioClockwise").on('change', function (event, ui) {
                    that.tcView.Sheet.setNoteNameDirection(true);
                    that.tcView.Sheet.draw();
                    that.logEvent("Preference.NoteNames.Clockwise");
                });

                $("#contextRadioAntiClockwise").on('change', function (event, ui) {
                    that.tcView.Sheet.setNoteNameDirection(false);
                    that.tcView.Sheet.draw();
                    that.logEvent("Preference.NoteNames.AntiClockwise");
                });

                $("#contextRadioFlat").on('change', function (event, ui) {
                    that.tcView.Sheet.setNoteNameFlat(true);
                    that.tcView.Sheet.draw();
                    that.logEvent("Preference.NoteNames.Flat");
                });

                $("#contextRadioSharp").on('change', function (event, ui) {
                    that.tcView.Sheet.setNoteNameFlat(false);
                    that.tcView.Sheet.draw();
                    that.logEvent("Preference.NoteNames.Sharp");
                });

                $("#contextRadioAlphabet").on('change', function (event, ui) {
                    that.tcView.Sheet.setNoteNameAs(0);
                    that.tcView.Sheet.draw();
                    that.logEvent("Preference.NoteNames.Alphabetical");
                });

                $("#contextRadioPitchClass").on('change', function (event, ui) {
                    that.tcView.Sheet.setNoteNameAs(1);
                    that.tcView.Sheet.draw();
                    that.logEvent("Preference.NoteNames.PitchClasses");
                });

                $("#contextRadioHarmonicaClass").on('change', function (event, ui) {
                    that.tcView.Sheet.setNoteNameAs(2);
                    that.tcView.Sheet.draw();
                    that.logEvent("Preference.NoteNames.Harmonica.Classical");
                });

                $("#contextRadioHarmonicaDimi").on('change', function (event, ui) {
                    that.tcView.Sheet.setNoteNameAs(3);
                    that.tcView.Sheet.draw();
                    that.logEvent("Preference.NoteNames.Harmonica.Diminished");
                });

                $("#contextRadioDoReMi").on('change', function (event, ui) {
                    that.tcView.Sheet.setNoteNameAs(4);
                    that.tcView.Sheet.draw();
                    that.logEvent("Preference.NoteNames.DoReMi");
                });

                $("#chkPrimeForm").on('change', function (event, ui) {
                    that.tcView.Sheet.setDisplayPrimeForm(this.checked);
                    that.tcView.Sheet.draw();
                    that.logEvent("Preference.PitchClassSets.PrimeForm");
                });
                $("#chkForteCode").on('change', function (event, ui) {
                    that.tcView.Sheet.setDisplayForteCode(this.checked);
                    that.tcView.Sheet.draw();
                    that.logEvent("Preference.PitchClassSets.ForteCode");
                });
                $("#chkIntervalVector").on('change', function (event, ui) {
                    that.tcView.Sheet.setDisplayIntervalVector(this.checked);
                    that.tcView.Sheet.draw();
                    that.logEvent("Preference.PitchClassSets.IntervalVector");
                });
                $("#chkPrimeInversion").on('change', function (event, ui) {
                    that.tcView.Sheet.setDisplayPrimeInversion(this.checked);
                    that.tcView.Sheet.draw();
                    that.logEvent("Preference.PitchClassSets.PrimeInversion");
                });

                $("#sliderClocksHorizontal").slider({ min: 1, max: 20 });
                $("#sliderClocksHorizontal .ui-slider-handle:first").hover(function (event) {
                    $("#sliderClocksHorizontal .ui-slider-handle:first").tooltip("show");
                }, function (event) {
                });
                $("#sliderClocksHorizontal").on("slide", function (event, ui) {
                    $("#sliderClocksHorizontal .ui-slider-handle:first").attr("data-original-title", ui.value).tooltip("show");
                    var horClocks = ui.value;
                    var verClocks = that.tcView.Sheet.getClocksVertical();

                    that.tcView.Sheet.setCanvasSize(horClocks, verClocks);
                    that.tcView.Sheet.draw();
                    that.logEvent("Preference.Sheet.Clocks.Horizontal");
                });

                $("#sliderClocksVertical").slider({ min: 1, max: 30 });
                $("#sliderClocksVertical .ui-slider-handle:first").hover(function (event) {
                    $("#sliderClocksVertical .ui-slider-handle:first").tooltip("show");
                }, function (event) {
                });
                $("#sliderClocksVertical").on("slide", function (event, ui) {
                    $("#sliderClocksVertical .ui-slider-handle:first").attr("data-original-title", ui.value).tooltip("show");
                    var horClocks = that.tcView.Sheet.getClocksHorizontal();
                    var verClocks = ui.value;

                    that.tcView.Sheet.getClocksVertical();
                    that.tcView.Sheet.setCanvasSize(horClocks, verClocks);
                    that.tcView.Sheet.draw();
                    that.logEvent("Preference.Sheet.Clocks.Vertical");
                });

                $("#sliderNoteNameRotation").slider({ min: -11, max: 11, orientation: 'horizontal' });
                $("#sliderNoteNameRotation .ui-slider-handle:first").hover(function (event) {
                    $("#sliderNoteNameRotation .ui-slider-handle:first").tooltip("show");
                }, function (event) {
                });
                $("#sliderNoteNameRotation").on("slide", function (event, ui) {
                    $("#sliderNoteNameRotation .ui-slider-handle:first").attr("data-original-title", ui.value).tooltip("show");
                    that.tcView.Sheet.setNoteNameRotation(ui.value);
                    that.tcView.Sheet.draw();
                    that.logEvent("Preference.Notename.Rotation");
                });

                $("#sliderNoteNameMargin").slider({ min: 0, max: 100, orientation: 'horizontal' });
                $("#sliderNoteNameMargin .ui-slider-handle:first").hover(function (event) {
                    $("#sliderNoteNameMargin .ui-slider-handle:first").tooltip("show");
                }, function (event) {
                });
                $("#sliderNoteNameMargin").on("slide", function (event, ui) {
                    $("#sliderNoteNameMargin .ui-slider-handle:first").attr("data-original-title", ui.value).tooltip("show");
                    that.tcView.Sheet.setNoteNameMargin(ui.value);
                    that.tcView.Sheet.draw();
                    that.logEvent("Preference.Notename.Margin");
                });

                $("#sliderSheetTransposition").slider({ min: -6, max: 6, orientation: 'horizontal' });
                $("#sliderSheetTransposition .ui-slider-handle:first").hover(function (event) {
                    $("#sliderSheetTransposition .ui-slider-handle:first").tooltip("show");
                }, function (event) {
                });
                $("#sliderSheetTransposition").on("slide", function (event, ui) {
                    $("#sliderSheetTransposition .ui-slider-handle:first").attr("data-original-title", ui.value).tooltip("show");
                    that.tcView.Sheet.setSheetTransposition(ui.value);
                    that.tcView.Sheet.draw();
                    that.logEvent("Preference.Sheet.Transposition");
                });

                $("#sliderSizeClock").slider({ min: 50, max: 1000 });
                $("#sliderSizeClock .ui-slider-handle:first").hover(function (event) {
                    $("#sliderSizeClock .ui-slider-handle:first").tooltip("show");
                }, function (event) {
                });
                $("#sliderSizeClock").on("slide", function (event, ui) {
                    $("#sliderSizeClock .ui-slider-handle:first").attr("data-original-title", ui.value).tooltip("show");
                    that.tcView.Sheet.setClockSize(ui.value);
                    that.tcView.Sheet.draw();
                    that.logEvent("Preference.Sheet.Clocks.Size");
                });

                $("#sliderSizeClockCanvas").slider({ min: 60, max: 1010 });
                $("#sliderSizeClockCanvas .ui-slider-handle:first").hover(function (event) {
                    $("#sliderSizeClockCanvas .ui-slider-handle:first").tooltip("show");
                }, function (event) {
                });
                $("#sliderSizeClockCanvas").on("slide", function (event, ui) {
                    $("#sliderSizeClockCanvas .ui-slider-handle:first").attr("data-original-title", ui.value).tooltip("show");
                    that.tcView.Sheet.setClockCanvasSize(ui.value);
                    that.tcView.Sheet.draw();
                    that.logEvent("Preference.Sheet.Clocks.Canvas");
                });

                $("#sliderSizeFont").slider({ min: 5, max: 30 });
                $("#sliderSizeFont .ui-slider-handle:first").hover(function (event) {
                    $("#sliderSizeFont .ui-slider-handle:first").tooltip("show");
                }, function (event) {
                });
                $("#sliderSizeFont").on("slide", function (event, ui) {
                    $("#sliderSizeFont .ui-slider-handle:first").attr("data-original-title", ui.value).tooltip("show");
                    that.tcView.Sheet.setNoteNameFontSize(ui.value);
                    that.tcView.Sheet.draw();
                    that.logEvent("Preference.Sheet.Notenames.FontSize");
                });

                $("#sliderSizeHour").slider({ min: 3, max: 30 });
                $("#sliderSizeHour .ui-slider-handle:first").hover(function (event) {
                    $("#sliderSizeHour .ui-slider-handle:first").tooltip("show");
                }, function (event) {
                });
                $("#sliderSizeHour").on("slide", function (event, ui) {
                    $("#sliderSizeHour .ui-slider-handle:first").attr("data-original-title", ui.value).tooltip("show");
                    that.tcView.Sheet.setHourSize(ui.value);
                    that.tcView.Sheet.draw();
                    that.logEvent("Preference.Sheet.Clocks.HourSize");
                });
            };
            return ViewController;
        })();
        ToneClock.ViewController = ViewController;
    })(exports.ToneClock || (exports.ToneClock = {}));
    var ToneClock = exports.ToneClock;
});
//# sourceMappingURL=toneclockviewcontroller.js.map
