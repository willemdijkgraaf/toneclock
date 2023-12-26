/**
 * Created by wimdijkgraaf on 09-06-14.
 */
define(["require", "exports", "./canvasviewcontroller", "./jsonsheetpersistence", "./canvaseaseljs", "./sheet", "./harmony", "./harmonypainter", "./clockpainter", "./setfinder", "./hour", "./hourpainter", "./midinotenumber", "bootstrap"], function (require, exports, view, sheetPersistence, canvas, sheet, harmony, harmonypainter, clockpainter, setfinder, hour, hourpainter, midinotenumber) {
    var ToneClock;
    (function (ToneClock) {
        var HtmlViewController = (function () {
            function HtmlViewController() {
            }
            // AppInsights function call
            HtmlViewController.prototype.logEvent = function (event) {
                var appIns = window["appInsights"];
                appIns["logEvent"].call(event);
            };
            HtmlViewController.prototype.rgbToHex = function (color) {
                var hex;
                if (color.indexOf("#") > -1) {
                    //for IE
                    hex = color;
                }
                else {
                    var rgb = color.match(/\d+/g);
                    hex = "#" + ("0" + parseInt(rgb[0], 10).toString(16)).slice(-2) + ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) + ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2);
                }
                return hex;
            };
            HtmlViewController.prototype.blockContextMenu = function (e) {
                e.preventDefault();
            };
            HtmlViewController.prototype.getJSONSheet = function (sJSONSource) {
                // make canvas element invisible for testing purposes
                var e = document.getElementById("toneClockArea");
                e.setAttribute("style", "visibility: hidden");
                // load new sheet
                this.mySheetPersistence = new sheetPersistence.ToneClock.JsonSheetPersistence();
                this.mySheetPersistence.loadSheet(sJSONSource, $.proxy(this.OnNewSheetLoaded, this));
            };
            HtmlViewController.prototype.OnNewSheetLoaded = function (aJSONSheet) {
                if (typeof this.myCanvasViewController === "undefined") {
                    // first time startup
                    // create objects to be injected
                    var aCanvas = new canvas.ToneClock.Canvas("toneClockArea");
                    var aSetFinder = new setfinder.ToneClock.SetFinder();
                    var aHour = new hour.ToneClock.Hour();
                    var aMidiNoteNumber = new midinotenumber.ToneClock.MidiNoteNumber();
                    var aHourPainter = new hourpainter.ToneClock.HourPainter(aCanvas, aMidiNoteNumber, aHour);
                    var aHarmony = new harmony.ToneClock.Harmony(aCanvas, aSetFinder, aHour, aMidiNoteNumber);
                    var aHarmonyPainter = new harmonypainter.ToneClock.HarmonyPainter(aCanvas, aMidiNoteNumber);
                    var aClockPainter = new clockpainter.ToneClock.ClockPainter(aCanvas, aHarmony, aHour);
                    var aSheet = new sheet.ToneClock.Sheet(aCanvas, aJSONSheet);
                    // inject dependencies
                    this.myCanvasViewController = new view.ToneClock.CanvasViewController(aSheet, aHarmony, aHarmonyPainter, aClockPainter, aCanvas, aHour, aHourPainter, this);
                    // disable browser's standard context menu
                    window.addEventListener("contextmenu", this.blockContextMenu);
                    // show dialog with introductory video
                    $("#introductionPopup").modal("show");
                    // set default color
                    document.getElementById("defaultColorPicker").style.backgroundColor = "#000000";
                    this.setVersionNumbersInAboutDialog();
                    this.setEventHandlers();
                }
                else {
                    this.myCanvasViewController.setSheet(aJSONSheet);
                }
                this.setValuesOfPreferencesDialog();
                this.displaySheetName(aJSONSheet.name);
                this.myCanvasViewController.draw();
            };
            HtmlViewController.prototype.displaySheetName = function (sheetName) {
                $("#sheetName").val(sheetName);
            };
            HtmlViewController.prototype.setVersionNumbersInAboutDialog = function () {
                var e = document.getElementById("toneClockVersion");
                e.innerText = this.myCanvasViewController.sVERSION;
            };
            HtmlViewController.prototype.OnHarmonyContextShow = function (x, y, color, pcsNames) {
                // set color of color picker in harmony context menu
                this.setColorOfHarmonyColorPicker(color);
                // make sure that nothing of the menu is positioned behind the menu bar
                if (y < 120) {
                    y = 135;
                }
                ;
                // set names of pitch class sets in the context menu
                this.setHarmonyContextPitchClassSetNames(pcsNames);
                // show context menu
                $("#harmonyContextMenu").css({
                    left: x,
                    top: y,
                    position: "absolute",
                    "z-index": 1000,
                    display: "block",
                    "list-style": "none",
                    visibility: "visible",
                    opacity: 1
                });
            };
            HtmlViewController.prototype.setHarmonyContextPitchClassSetNames = function (pcsNames) {
                $("#showPrimeForm").attr("value", pcsNames.primeForm);
                $("#showForteCode").attr("value", pcsNames.forteCode);
                $("#showIntervalVector").attr("value", pcsNames.intervalVector);
                $("#showPrimeInversion").attr("value", pcsNames.primeInversion);
            };
            HtmlViewController.prototype.setColorOfHarmonyColorPicker = function (color) {
                var aElement = document.getElementById("harmonyColorPicker");
                aElement.style.backgroundColor = color;
                aElement.value = color;
                this.logEvent("Harmony.setColor");
            };
            HtmlViewController.prototype.OnHourContextShow = function (x, y) {
                // make sure that nothing of the menu is positioned behind the menu bar
                if (y < 120) {
                    y = 135;
                }
                ;
                $("#hourContextMenu").css({
                    left: x,
                    top: y,
                    position: "absolute",
                    "z-index": 1000,
                    display: "block",
                    "list-style": "none",
                    visibility: "visible",
                    opacity: 1
                });
            };
            HtmlViewController.prototype.setValuesOfPreferencesDialog = function () {
                // set sliders
                $("#sliderClocksHorizontal").slider("option", "value", this.myCanvasViewController.getClocksHorizontal());
                $("#sliderClocksHorizontal .ui-slider-handle:first").attr("data-original-title", this.myCanvasViewController.getClocksHorizontal());
                $("#sliderClocksVertical").slider("option", "value", this.myCanvasViewController.getClocksVertical());
                $("#sliderClocksVertical .ui-slider-handle:first").attr("data-original-title", this.myCanvasViewController.getClocksVertical());
                $("#sliderNoteNameRotation").slider("option", "value", this.myCanvasViewController.getNoteNameRotation());
                $("#sliderNoteNameRotation .ui-slider-handle:first").attr("data-original-title", this.myCanvasViewController.getNoteNameRotation());
                $("#sliderSheetTransposition").slider("option", "value", this.myCanvasViewController.getSheetTransposition());
                $("#sliderSheetTransposition .ui-slider-handle:first").attr("data-original-title", this.myCanvasViewController.getSheetTransposition());
                $("#sliderNoteNameMargin").slider("option", "value", this.myCanvasViewController.getNoteNameMargin());
                $("#sliderNoteNameMargin .ui-slider-handle:first").attr("data-original-title", this.myCanvasViewController.getNoteNameMargin());
                $("#sliderSizeClock").slider("option", "value", this.myCanvasViewController.getClockSize());
                $("#sliderSizeClock .ui-slider-handle:first").attr("data-original-title", this.myCanvasViewController.getClockSize());
                $("#sliderSizeFont").slider("option", "value", this.myCanvasViewController.getNoteNameFontSize());
                $("#sliderSizeFont .ui-slider-handle:first").attr("data-original-title", this.myCanvasViewController.getNoteNameFontSize());
                $("#sliderSizeHour").slider("option", "value", this.myCanvasViewController.getHourSize());
                $("#sliderSizeHour .ui-slider-handle:first").attr("data-original-title", this.myCanvasViewController.getHourSize());
                // set radio buttons: interval
                var sRadioButtonId = "";
                var radio;
                switch (this.myCanvasViewController.getNoteNameStyle()) {
                    case 0:
                        sRadioButtonId = "#contextRadioFourths";
                        break;
                    case 1:
                        sRadioButtonId = "#contextRadioSeconds";
                        break;
                }
                radio = $(sRadioButtonId);
                radio[0].checked = true;
                switch (this.myCanvasViewController.getNoteNameDirection()) {
                    case true:
                        sRadioButtonId = "#contextRadioClockwise";
                        break;
                    case false:
                        sRadioButtonId = "#contextRadioAntClockwise";
                        break;
                }
                radio = $(sRadioButtonId);
                radio[0].checked = true;
                switch (this.myCanvasViewController.getNoteNameFlat()) {
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
            HtmlViewController.prototype.OnLoadSheet = function () {
                document.getElementById("loadFile").click();
            };
            HtmlViewController.prototype.hideHarmonyContextMenu = function () {
                document.getElementById("harmonyContextMenu").style.cssText = "opacity:0;visibility:hidden;z-index:0;";
                document.getElementById("harmonyContextMenu").className = "dropdown-menu .contextMenuHide";
            };
            HtmlViewController.prototype.OnHarmonyAddClick = function () {
                this.myCanvasViewController.addHarmony();
                this.hideHarmonyContextMenu();
                this.logEvent("Harmony.Add");
            };
            HtmlViewController.prototype.OnHarmonyDeleteClick = function () {
                this.myCanvasViewController.removeHarmony();
                this.hideHarmonyContextMenu();
                this.logEvent("Harmony.Delete");
            };
            HtmlViewController.prototype.OnHarmonyMoveToFront = function () {
                this.myCanvasViewController.moveHarmonyToFront();
                this.hideHarmonyContextMenu();
                this.logEvent("Harmony.MoveToFront");
            };
            HtmlViewController.prototype.OnHarmonyMoveToBack = function () {
                this.myCanvasViewController.moveHarmonyToBack();
                this.hideHarmonyContextMenu();
                this.logEvent("Harmony.MoveToBack");
            };
            HtmlViewController.prototype.OnHarmonyMoveForward = function () {
                this.myCanvasViewController.moveHarmonyForward();
                this.hideHarmonyContextMenu();
                this.logEvent("Harmony.MoveForward");
            };
            HtmlViewController.prototype.OnHarmonyMoveBackward = function () {
                this.myCanvasViewController.moveHarmonyBackward();
                this.hideHarmonyContextMenu();
                this.logEvent("Harmony.MoveBackward");
            };
            HtmlViewController.prototype.setEventHandlers = function () {
                var that = this;
                // register event handlers
                //add click listener on menu items
                $("#toggleRoot").on("click", $.proxy(this.myCanvasViewController.toggleRoot, this.myCanvasViewController));
                $("#addHarmony").on("click", $.proxy(this.OnHarmonyAddClick, this));
                $("#deleteHarmony").on("click", $.proxy(this.OnHarmonyDeleteClick, this));
                $("#bringHarmonyToFront").on("click", $.proxy(this.OnHarmonyMoveToFront, this));
                $("#bringHarmonyForward").on("click", $.proxy(this.OnHarmonyMoveForward, this));
                $("#sendHarmonyBackward").on("click", $.proxy(this.OnHarmonyMoveBackward, this));
                $("#sendHarmonyToBack").on("click", $.proxy(this.OnHarmonyMoveToBack, this));
                // set event handler if harmony Color Picker value changed
                $("#harmonyColorPicker").on("change", function (event) {
                    var color = document.getElementById("harmonyColorPicker").style.backgroundColor;
                    color = that.rgbToHex(color);
                    document.getElementById("harmonyColorPicker").style.backgroundColor = color;
                    that.myCanvasViewController.OnHarmonyColorChange(color);
                    that.logEvent("Harmony.ChangeColor");
                });
                // set event handler if default harmony Color Picker value changed
                $("#defaultColorPicker").on("change", function (event) {
                    var color = document.getElementById("defaultColorPicker").style.backgroundColor;
                    color = that.rgbToHex(color);
                    that.myCanvasViewController.setDefaultColor(color);
                    that.logEvent("Sheet.DefaultColorChange");
                });
                // set event handler if harmony Color Picker input changed
                $("#harmonyColorPicker").on("input", function (event) {
                    var color = document.getElementById("harmonyColorPicker").style.backgroundColor;
                    color = that.rgbToHex(color);
                    console.log("color: " + color);
                    document.getElementById("harmonyColorPicker").style.backgroundColor = color;
                    that.myCanvasViewController.OnHarmonyColorChange(color);
                    that.logEvent("Harmony.ChangeColor");
                });
                $(document).bind("click", function (event) {
                    document.getElementById("hourContextMenu").style.cssText = "opacity:0;visibility:hidden;z-index:0;";
                    document.getElementById("hourContextMenu").className = "dropdown-menu .contextMenuHide";
                    if (event.target['id'] === "") {
                        document.getElementById("harmonyContextMenu").style.cssText = "opacity:0;visibility:hidden;z-index:0;";
                        document.getElementById("harmonyContextMenu").className = "dropdown-menu .contextMenuHide";
                    }
                });
                $("#menuSheetEmptyA44x5").click(function (event, ui) {
                    that.getJSONSheet("emptyA44x5.json");
                    that.logEvent("Sheet.Load.emptyA44x5");
                });
                $("#menu4BasicTriads").click(function (event, ui) {
                    that.getJSONSheet("4basictriads.json");
                    that.logEvent("Sheet.Load.4basictriads");
                });
                $("#menu5Basic7thChords").click(function (event, ui) {
                    that.getJSONSheet("5basic7thchords.json");
                    that.logEvent("Sheet.Load.5basic7thchords");
                });
                $("#menuMajorTriadsOverMinorHarmony").click(function (event, ui) {
                    that.getJSONSheet("majortriadsoverminorharmony.json");
                    that.logEvent("Sheet.Load.majortriadsoverminorharmony");
                });
                $("#menuMajorModes").click(function (event, ui) {
                    that.getJSONSheet("majormodes.json");
                    that.logEvent("Sheet.Load.majormodes");
                });
                $("#menuMelodicMinorModes").click(function (event, ui) {
                    that.getJSONSheet("melodicminormodes.json");
                    that.logEvent("Sheet.Load.melodicminormodes");
                });
                $("#menuPeterSchat").click(function (event, ui) {
                    that.getJSONSheet("peterschat.json");
                    that.logEvent("Sheet.Load.peterschat");
                });
                $("#menuSheetV7").click(function (event, ui) {
                    that.getJSONSheet("dominant7th.json");
                    that.logEvent("Sheet.Load.dominant7th");
                });
                $("#menuDiminishedScale").click(function (event, ui) {
                    that.getJSONSheet("diminishedscale.json");
                    that.logEvent("Sheet.Load.diminishedscale");
                });
                $("#menuSheetIntervals").click(function (event, ui) {
                    that.getJSONSheet("intervals.json");
                    that.logEvent("Sheet.Load.intervals");
                });
                $("#menuSheetTrichords").click(function (event, ui) {
                    that.getJSONSheet("trichords.json");
                    that.logEvent("Sheet.Load.trichords");
                });
                $("#menuSheetTetrachords").click(function (event, ui) {
                    that.getJSONSheet("tetrachords.json");
                    that.logEvent("Sheet.Load.tetrachords");
                });
                $("#menuSheetPentachords").click(function (event, ui) {
                    that.getJSONSheet("pentachords.json");
                    that.logEvent("Sheet.Load.pentachords");
                });
                $("#menuSheetHexachords").click(function (event, ui) {
                    that.getJSONSheet("hexachords.json");
                    that.logEvent("Sheet.Load.hexachords");
                });
                $("#menuSheetHeptachords").click(function (event, ui) {
                    that.getJSONSheet("heptachords.json");
                    that.logEvent("Sheet.Load.heptachords");
                });
                $("#menuSheetOctachords").click(function (event, ui) {
                    that.getJSONSheet("octachords.json");
                    that.logEvent("Sheet.Load.octachords");
                });
                $("#menuSheetMessiaen").click(function (event, ui) {
                    that.getJSONSheet("messiaen.json");
                    that.logEvent("Sheet.Load.messiaen");
                });
                $("#menuTestBasis1").click(function (event, ui) {
                    that.getJSONSheet("testbasis1.json");
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
                    that.mySheetPersistence.saveSheet(that.myCanvasViewController.getSheet());
                    that.logEvent("Sheet.Save");
                });
                $("#menuOpen").click(function (event, ui) {
                    that.OnLoadSheet();
                    that.logEvent("Sheet.Open");
                });
                $("#loadFile").change(function (event, ui) {
                    that.mySheetPersistence.handleSelectedFile(event);
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
                $("#tabNotes a").click(function (e) {
                    e.preventDefault();
                    $(this).tab("show");
                });
                $("#tabSizes a").click(function (e) {
                    e.preventDefault();
                    $(this).tab("show");
                });
                $("#tabCanvas a").click(function (e) {
                    e.preventDefault();
                    $(this).tab("show");
                });
                $("#contextRadioFourths").on("change", function (event, ui) {
                    that.myCanvasViewController.setNoteNameInterval(0);
                    that.myCanvasViewController.draw();
                    that.logEvent("Preference.NoteNames.InFourths");
                });
                $("#contextRadioSeconds").on("change", function (event, ui) {
                    that.myCanvasViewController.setNoteNameInterval(1);
                    that.myCanvasViewController.draw();
                    that.logEvent("Preference.NoteNames.InSeconds");
                });
                $("#contextRadioClockwise").on("change", function (event, ui) {
                    that.myCanvasViewController.setNoteNameDirection(true);
                    that.myCanvasViewController.draw();
                    that.logEvent("Preference.NoteNames.Clockwise");
                });
                $("#contextRadioAntClockwise").on("change", function (event, ui) {
                    that.myCanvasViewController.setNoteNameDirection(false);
                    that.myCanvasViewController.draw();
                    that.logEvent("Preference.NoteNames.AntClockwise");
                });
                $("#contextRadioFlat").on("change", function (event, ui) {
                    that.myCanvasViewController.setNoteNameFlat(true);
                    that.myCanvasViewController.draw();
                    that.logEvent("Preference.NoteNames.Flat");
                });
                $("#contextRadioSharp").on("change", function (event, ui) {
                    that.myCanvasViewController.setNoteNameFlat(false);
                    that.myCanvasViewController.draw();
                    that.logEvent("Preference.NoteNames.Sharp");
                });
                $("#contextRadioAlphabet").on("change", function (event, ui) {
                    that.myCanvasViewController.setNoteNameAs(0);
                    that.myCanvasViewController.draw();
                    that.logEvent("Preference.NoteNames.Alphabetical");
                });
                $("#contextRadioPitchClass").on("change", function (event, ui) {
                    that.myCanvasViewController.setNoteNameAs(1);
                    that.myCanvasViewController.draw();
                    that.logEvent("Preference.NoteNames.PitchClasses");
                });
                $("#contextRadioHarmonicaClass").on("change", function (event, ui) {
                    that.myCanvasViewController.setNoteNameAs(2);
                    that.myCanvasViewController.draw();
                    that.logEvent("Preference.NoteNames.Harmonica.Classical");
                });
                $("#contextRadioHarmonicaDimi").on("change", function (event, ui) {
                    that.myCanvasViewController.setNoteNameAs(3);
                    that.myCanvasViewController.draw();
                    that.logEvent("Preference.NoteNames.Harmonica.Diminished");
                });
                $("#contextRadioDoReMi").on("change", function (event, ui) {
                    that.myCanvasViewController.setNoteNameAs(4);
                    that.myCanvasViewController.draw();
                    that.logEvent("Preference.NoteNames.DoReMi");
                });
                $("#chkPrimeForm").on("change", function (event, ui) {
                    that.myCanvasViewController.setDisplayPrimeForm(this.checked);
                    that.myCanvasViewController.draw();
                    that.logEvent("Preference.PitchClassSets.PrimeForm");
                });
                $("#chkForteCode").on("change", function (event, ui) {
                    that.myCanvasViewController.setDisplayForteCode(this.checked);
                    that.myCanvasViewController.draw();
                    that.logEvent("Preference.PitchClassSets.ForteCode");
                });
                $("#chkIntervalVector").on("change", function (event, ui) {
                    that.myCanvasViewController.setDisplayIntervalVector(this.checked);
                    that.myCanvasViewController.draw();
                    that.logEvent("Preference.PitchClassSets.IntervalVector");
                });
                $("#chkPrimeInversion").on("change", function (event, ui) {
                    that.myCanvasViewController.setDisplayPrimeInversion(this.checked);
                    that.myCanvasViewController.draw();
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
                    var verClocks = that.myCanvasViewController.getClocksVertical();
                    that.myCanvasViewController.setCanvasSize(horClocks, verClocks);
                    that.myCanvasViewController.draw();
                    that.logEvent("Preference.Clocks.Horizontal");
                });
                $("#sliderClocksVertical").slider({ min: 1, max: 30 });
                $("#sliderClocksVertical .ui-slider-handle:first").hover(function (event) {
                    $("#sliderClocksVertical .ui-slider-handle:first").tooltip("show");
                }, function (event) {
                });
                $("#sliderClocksVertical").on("slide", function (event, ui) {
                    $("#sliderClocksVertical .ui-slider-handle:first").attr("data-original-title", ui.value).tooltip("show");
                    var horClocks = that.myCanvasViewController.getClocksHorizontal();
                    var verClocks = ui.value;
                    that.myCanvasViewController.getClocksVertical();
                    that.myCanvasViewController.setCanvasSize(horClocks, verClocks);
                    that.myCanvasViewController.draw();
                    that.logEvent("Preference.Clocks.Vertical");
                });
                $("#sliderNoteNameRotation").slider({ min: -11, max: 11, orientation: "horizontal" });
                $("#sliderNoteNameRotation .ui-slider-handle:first").hover(function (event) {
                    $("#sliderNoteNameRotation .ui-slider-handle:first").tooltip("show");
                }, function (event) {
                });
                $("#sliderNoteNameRotation").on("slide", function (event, ui) {
                    $("#sliderNoteNameRotation .ui-slider-handle:first").attr("data-original-title", ui.value).tooltip("show");
                    that.myCanvasViewController.setNoteNameRotation(ui.value);
                    that.myCanvasViewController.draw();
                    that.logEvent("Preference.Notename.Rotation");
                });
                $("#sliderNoteNameMargin").slider({ min: 0, max: 100, orientation: "horizontal" });
                $("#sliderNoteNameMargin .ui-slider-handle:first").hover(function (event) {
                    $("#sliderNoteNameMargin .ui-slider-handle:first").tooltip("show");
                }, function (event) {
                });
                $("#sliderNoteNameMargin").on("slide", function (event, ui) {
                    $("#sliderNoteNameMargin .ui-slider-handle:first").attr("data-original-title", ui.value).tooltip("show");
                    that.myCanvasViewController.setNoteNameMargin(ui.value);
                    that.myCanvasViewController.draw();
                    that.logEvent("Preference.Notename.Margin");
                });
                $("#sliderSheetTransposition").slider({ min: -6, max: 6, orientation: "horizontal" });
                $("#sliderSheetTransposition .ui-slider-handle:first").hover(function (event) {
                    $("#sliderSheetTransposition .ui-slider-handle:first").tooltip("show");
                }, function (event) {
                });
                $("#sliderSheetTransposition").on("slide", function (event, ui) {
                    $("#sliderSheetTransposition .ui-slider-handle:first").attr("data-original-title", ui.value).tooltip("show");
                    that.myCanvasViewController.setSheetTransposition(ui.value);
                    that.myCanvasViewController.draw();
                    that.logEvent("Preference.Sheet.Transposition");
                });
                $("#sliderSizeClock").slider({ min: 50, max: 1000 });
                $("#sliderSizeClock .ui-slider-handle:first").hover(function (event) {
                    $("#sliderSizeClock .ui-slider-handle:first").tooltip("show");
                }, function (event) {
                });
                $("#sliderSizeClock").on("slide", function (event, ui) {
                    $("#sliderSizeClock .ui-slider-handle:first").attr("data-original-title", ui.value).tooltip("show");
                    that.myCanvasViewController.setClockSize(ui.value);
                    that.myCanvasViewController.draw();
                    that.logEvent("Preference.Sheet.Clocks.Size");
                });
                $("#sliderSizeFont").slider({ min: 5, max: 30 });
                $("#sliderSizeFont .ui-slider-handle:first").hover(function (event) {
                    $("#sliderSizeFont .ui-slider-handle:first").tooltip("show");
                }, function (event) {
                });
                $("#sliderSizeFont").on("slide", function (event, ui) {
                    $("#sliderSizeFont .ui-slider-handle:first").attr("data-original-title", ui.value).tooltip("show");
                    that.myCanvasViewController.setNoteNameFontSize(ui.value);
                    that.myCanvasViewController.draw();
                    that.logEvent("Preference.Sheet.Notenames.FontSize");
                });
                $("#sliderSizeHour").slider({ min: 3, max: 30 });
                $("#sliderSizeHour .ui-slider-handle:first").hover(function (event) {
                    $("#sliderSizeHour .ui-slider-handle:first").tooltip("show");
                }, function (event) {
                });
                $("#sliderSizeHour").on("slide", function (event, ui) {
                    $("#sliderSizeHour .ui-slider-handle:first").attr("data-original-title", ui.value).tooltip("show");
                    that.myCanvasViewController.setHourSize(ui.value);
                    that.myCanvasViewController.draw();
                    that.logEvent("Preference.Sheet.Clocks.HourSize");
                });
                $("#sheetName").on("change", function (event, ui) {
                    var sheetName = $("#sheetName").val();
                    that.myCanvasViewController.setSheetTitle(sheetName);
                    that.logEvent("Sheet.SetSheetTitle");
                });
            };
            return HtmlViewController;
        })();
        ToneClock.HtmlViewController = HtmlViewController;
    })(ToneClock = exports.ToneClock || (exports.ToneClock = {}));
});
//# sourceMappingURL=htmlviewcontroller.js.map