define(["require", "exports", 'toneclockview', 'toneclockcontroller', "bootstrap"], function(require, exports, view, controller) {
    (function (ToneClock) {
        var ViewController = (function () {
            function ViewController() {
            }
            ViewController.prototype.initializeToneClock = function () {
                this.tcView = new view.ToneClock.View("toneClockArea");
                this.tcController = new controller.ToneClock.Controller(this.tcView);
                this.getToneClockSheet("peterschat.json");
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

            ViewController.prototype.setValuesOfPreferencesDialog = function () {
                $("#sliderClocksHorizontal").slider("option", "value", this.tcView.getClocksHorizontal());
                $("#sliderClocksHorizontal .ui-slider-handle:first").attr("data-original-title", this.tcView.getClocksHorizontal());

                $("#sliderClocksVertical").slider("option", "value", this.tcView.getClocksVertical());
                $("#sliderClocksVertical .ui-slider-handle:first").attr("data-original-title", this.tcView.getClocksVertical());

                $("#sliderNoteNameRotation").slider("option", "value", this.tcView.getNoteNameRotation());
                $("#sliderNoteNameRotation .ui-slider-handle:first").attr("data-original-title", this.tcView.getNoteNameRotation());

                $("#sliderSheetTransposition").slider("option", "value", this.tcView.getSheetTransposition());
                $("#sliderSheetTransposition .ui-slider-handle:first").attr("data-original-title", this.tcView.getSheetTransposition());

                $("#sliderNoteNameMargin").slider("option", "value", this.tcView.getNoteNameMargin());
                $("#sliderNoteNameMargin .ui-slider-handle:first").attr("data-original-title", this.tcView.getNoteNameMargin());

                $("#sliderSizeClock").slider("option", "value", this.tcView.getClockSize());
                $("#sliderSizeClock .ui-slider-handle:first").attr("data-original-title", this.tcView.getClockSize());

                $("#sliderSizeClockCanvas").slider("option", "value", this.tcView.getClockCanvasSize());
                $("#sliderSizeClockCanvas .ui-slider-handle:first").attr("data-original-title", this.tcView.getClockCanvasSize());

                $("#sliderSizeFont").slider("option", "value", this.tcView.getNoteNameFontSize());
                $("#sliderSizeFont .ui-slider-handle:first").attr("data-original-title", this.tcView.getNoteNameFontSize());

                $("#sliderSizeHour").slider("option", "value", this.tcView.getHourSize());
                $("#sliderSizeHour .ui-slider-handle:first").attr("data-original-title", this.tcView.getHourSize());

                var sRadioButtonId = "";
                var radio;

                switch (this.tcView.getNoteNameStyle()) {
                    case 0:
                        sRadioButtonId = "#contextRadioFourths";
                        break;
                    case 1:
                        sRadioButtonId = "#contextRadioSeconds";
                        break;
                }
                radio = $(sRadioButtonId);
                radio[0].checked = true;

                switch (this.tcView.getNoteNameDirection()) {
                    case true:
                        sRadioButtonId = "#contextRadioClockwise";
                        break;
                    case false:
                        sRadioButtonId = "#contextRadioAntiClockwise";
                        break;
                }
                radio = $(sRadioButtonId);
                radio[0].checked = true;

                switch (this.tcView.getNoteNameFlat()) {
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

            ViewController.prototype.Initialize = function () {
                this.initializeToneClock();
                this.setValuesOfAboutDialog();
                var that = this;

                $(document).bind("click", function (event) {
                    document.getElementById("hourContextMenu").style.cssText = "opacity:0;visibility:hidden;z-index:0;";
                    document.getElementById("hourContextMenu").className = "dropdown-menu .contextMenuHide";
                });

                $("#menuSheetEmptyA44x5").click(function (event, ui) {
                    that.getToneClockSheet("emptyA44x5.json");
                });

                $("#menu4BasicTriads").click(function (event, ui) {
                    that.getToneClockSheet("4basictriads.json");
                });

                $("#menu5Basic7thChords").click(function (event, ui) {
                    that.getToneClockSheet("5basic7thchords.json");
                });

                $("#menuMajorTriadsOverMinorHarmony").click(function (event, ui) {
                    that.getToneClockSheet("majortriadsoverminorharmony.json");
                });

                $("#menuMajorModes").click(function (event, ui) {
                    that.getToneClockSheet("majormodes.json");
                });

                $("#menuMelodicMinorModes").click(function (event, ui) {
                    that.getToneClockSheet("melodicminormodes.json");
                });

                $("#menuPeterSchat").click(function (event, ui) {
                    that.getToneClockSheet("peterschat.json");
                });

                $("#menuSheetV7").click(function (event, ui) {
                    that.getToneClockSheet("dominant7th.json");
                });

                $("#menuDiminishedScale").click(function (event, ui) {
                    that.getToneClockSheet("diminishedscale.json");
                });

                $("#menuSheetIntervals").click(function (event, ui) {
                    that.getToneClockSheet("intervals.json");
                });

                $("#menuSheetTrichords").click(function (event, ui) {
                    that.getToneClockSheet("trichords.json");
                });

                $("#menuSheetTetrachords").click(function (event, ui) {
                    that.getToneClockSheet("tetrachords.json");
                });

                $("#menuSheetPentachords").click(function (event, ui) {
                    that.getToneClockSheet("pentachords.json");
                });

                $("#menuSheetHexachords").click(function (event, ui) {
                    that.getToneClockSheet("hexachords.json");
                });

                $("#menuSheetHeptachords").click(function (event, ui) {
                    that.getToneClockSheet("heptachords.json");
                });

                $("#menuSheetOctachords").click(function (event, ui) {
                    that.getToneClockSheet("octachords.json");
                });

                $("#menuSheetMessiaen").click(function (event, ui) {
                    that.getToneClockSheet("messiaen.json");
                });

                $("#menuPreferences").click(function (event, ui) {
                    $("#preferencesPopup").modal("show");
                });

                $("#menuAbout").click(function (event, ui) {
                    $("#aboutPopup").modal("show");
                });

                $("#menuSave").click(function (event, ui) {
                    that.tcController.saveSheet();
                });

                $("#menuOpen").click(function (event, ui) {
                    that.loadSheet();
                });

                $("#loadFile").change(function (event, ui) {
                    that.tcController.handleFileSelect(event);
                });

                $("#menuPrint").click(function (event, ui) {
                    $("#menu").hide("blind");
                    window.print();
                    $("#menu ").show("blind");
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
                    that.tcView.setNoteNameStyle(0);
                    that.tcView.drawSheet();
                });

                $("#contextRadioSeconds").on('change', function (event, ui) {
                    that.tcView.setNoteNameStyle(1);
                    that.tcView.drawSheet();
                });

                $("#contextRadioClockwise").on('change', function (event, ui) {
                    that.tcView.setNoteNameDirection(true);
                    that.tcView.drawSheet();
                });

                $("#contextRadioAntiClockwise").on('change', function (event, ui) {
                    that.tcView.setNoteNameDirection(false);
                    that.tcView.drawSheet();
                });

                $("#contextRadioFlat").on('change', function (event, ui) {
                    that.tcView.setNoteNameFlat(true);
                    that.tcView.drawSheet();
                });

                $("#contextRadioSharp").on('change', function (event, ui) {
                    that.tcView.setNoteNameFlat(false);
                    that.tcView.drawSheet();
                });

                $("#contextRadioAlphabet").on('change', function (event, ui) {
                    that.tcView.setNoteNameAs(0);
                    that.tcView.drawSheet();
                });

                $("#contextRadioPitchClass").on('change', function (event, ui) {
                    that.tcView.setNoteNameAs(1);
                    that.tcView.drawSheet();
                });

                $("#contextRadioHarmonicaClass").on('change', function (event, ui) {
                    that.tcView.setNoteNameAs(2);
                    that.tcView.drawSheet();
                });

                $("#contextRadioHarmonicaDimi").on('change', function (event, ui) {
                    that.tcView.setNoteNameAs(3);
                    that.tcView.drawSheet();
                });

                $("#contextRadioDoReMi").on('change', function (event, ui) {
                    that.tcView.setNoteNameAs(4);
                    that.tcView.drawSheet();
                });

                $("#chkPrimeForm").on('change', function (event, ui) {
                    that.tcView.setDisplayPrimeForm(this.checked);
                    that.tcView.drawSheet();
                });
                $("#chkForteCode").on('change', function (event, ui) {
                    that.tcView.setDisplayForteCode(this.checked);
                    that.tcView.drawSheet();
                });
                $("#chkIntervalVector").on('change', function (event, ui) {
                    that.tcView.setDisplayIntervalVector(this.checked);
                    that.tcView.drawSheet();
                });
                $("#chkPrimeInversion").on('change', function (event, ui) {
                    that.tcView.setDisplayPrimeInversion(this.checked);
                    that.tcView.drawSheet();
                });

                $("#sliderClocksHorizontal").slider({ min: 1, max: 20 });
                $("#sliderClocksHorizontal .ui-slider-handle:first").hover(function (event) {
                    $("#sliderClocksHorizontal .ui-slider-handle:first").tooltip("show");
                }, function (event) {
                });
                $("#sliderClocksHorizontal").on("slide", function (event, ui) {
                    $("#sliderClocksHorizontal .ui-slider-handle:first").attr("data-original-title", ui.value).tooltip("show");
                    var horClocks = ui.value;
                    var verClocks = that.tcView.getClocksVertical();

                    that.tcView.setCanvasSize(horClocks, verClocks);
                    that.tcView.drawSheet();
                });

                $("#sliderClocksVertical").slider({ min: 1, max: 30 });
                $("#sliderClocksVertical .ui-slider-handle:first").hover(function (event) {
                    $("#sliderClocksVertical .ui-slider-handle:first").tooltip("show");
                }, function (event) {
                });
                $("#sliderClocksVertical").on("slide", function (event, ui) {
                    $("#sliderClocksVertical .ui-slider-handle:first").attr("data-original-title", ui.value).tooltip("show");
                    var horClocks = that.tcView.getClocksHorizontal();
                    var verClocks = ui.value;

                    that.tcView.getClocksVertical();
                    that.tcView.setCanvasSize(horClocks, verClocks);
                    that.tcView.drawSheet();
                });

                $("#sliderNoteNameRotation").slider({ min: -11, max: 11, orientation: 'horizontal' });
                $("#sliderNoteNameRotation .ui-slider-handle:first").hover(function (event) {
                    $("#sliderNoteNameRotation .ui-slider-handle:first").tooltip("show");
                }, function (event) {
                });
                $("#sliderNoteNameRotation").on("slide", function (event, ui) {
                    $("#sliderNoteNameRotation .ui-slider-handle:first").attr("data-original-title", ui.value).tooltip("show");
                    that.tcView.setNoteNameRotation(ui.value);
                    that.tcView.drawSheet();
                });

                $("#sliderNoteNameMargin").slider({ min: 0, max: 100, orientation: 'horizontal' });
                $("#sliderNoteNameMargin .ui-slider-handle:first").hover(function (event) {
                    $("#sliderNoteNameMargin .ui-slider-handle:first").tooltip("show");
                }, function (event) {
                });
                $("#sliderNoteNameMargin").on("slide", function (event, ui) {
                    $("#sliderNoteNameMargin .ui-slider-handle:first").attr("data-original-title", ui.value).tooltip("show");
                    that.tcView.setNoteNameMargin(ui.value);
                    that.tcView.drawSheet();
                });

                $("#sliderSheetTransposition").slider({ min: -6, max: 6, orientation: 'horizontal' });
                $("#sliderSheetTransposition .ui-slider-handle:first").hover(function (event) {
                    $("#sliderSheetTransposition .ui-slider-handle:first").tooltip("show");
                }, function (event) {
                });
                $("#sliderSheetTransposition").on("slide", function (event, ui) {
                    $("#sliderSheetTransposition .ui-slider-handle:first").attr("data-original-title", ui.value).tooltip("show");
                    that.tcView.setSheetTransposition(ui.value);
                    that.tcView.drawSheet();
                });

                $("#sliderSizeClock").slider({ min: 50, max: 1000 });
                $("#sliderSizeClock .ui-slider-handle:first").hover(function (event) {
                    $("#sliderSizeClock .ui-slider-handle:first").tooltip("show");
                }, function (event) {
                });
                $("#sliderSizeClock").on("slide", function (event, ui) {
                    $("#sliderSizeClock .ui-slider-handle:first").attr("data-original-title", ui.value).tooltip("show");
                    that.tcView.setClockSize(ui.value);
                    that.tcView.drawSheet();
                });

                $("#sliderSizeClockCanvas").slider({ min: 60, max: 1010 });
                $("#sliderSizeClockCanvas .ui-slider-handle:first").hover(function (event) {
                    $("#sliderSizeClockCanvas .ui-slider-handle:first").tooltip("show");
                }, function (event) {
                });
                $("#sliderSizeClockCanvas").on("slide", function (event, ui) {
                    $("#sliderSizeClockCanvas .ui-slider-handle:first").attr("data-original-title", ui.value).tooltip("show");
                    that.tcView.setClockCanvasSize(ui.value);
                    that.tcView.drawSheet();
                });

                $("#sliderSizeFont").slider({ min: 5, max: 30 });
                $("#sliderSizeFont .ui-slider-handle:first").hover(function (event) {
                    $("#sliderSizeFont .ui-slider-handle:first").tooltip("show");
                }, function (event) {
                });
                $("#sliderSizeFont").on("slide", function (event, ui) {
                    $("#sliderSizeFont .ui-slider-handle:first").attr("data-original-title", ui.value).tooltip("show");
                    that.tcView.setNoteNameFontSize(ui.value);
                    that.tcView.drawSheet();
                });

                $("#sliderSizeHour").slider({ min: 3, max: 30 });
                $("#sliderSizeHour .ui-slider-handle:first").hover(function (event) {
                    $("#sliderSizeHour .ui-slider-handle:first").tooltip("show");
                }, function (event) {
                });
                $("#sliderSizeHour").on("slide", function (event, ui) {
                    $("#sliderSizeHour .ui-slider-handle:first").attr("data-original-title", ui.value).tooltip("show");
                    that.tcView.setHourSize(ui.value);
                    that.tcView.drawSheet();
                });
            };
            return ViewController;
        })();
        ToneClock.ViewController = ViewController;
    })(exports.ToneClock || (exports.ToneClock = {}));
    var ToneClock = exports.ToneClock;
});
