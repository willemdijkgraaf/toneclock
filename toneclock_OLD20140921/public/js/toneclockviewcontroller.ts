/**
 * Created by wimdijkgraaf on 09-06-14.
 */

/// <reference path="jquery.d.ts" />
/// <reference path='jqueryui.d.ts' />

import jquery = require('jquery');
import bootstrap = require ('bootstrap');
import view = require ('toneclockview');
import controller = require ('toneclockcontroller');


export module ToneClock {
    export class ViewController {
        tc:view.ToneClock.View; // ToneClock widget
        tcc:controller.ToneClock.Controller; // ToneClock controller

        private initializeToneClock() {
            this.tc = new view.ToneClock.View("toneClockArea");
            this.tcc = new controller.ToneClock.Controller( this.tc );
            this.getToneClockSheet("peterschat.json");
        }


        public getToneClockSheet (sJSONSource) {
            this.tcc.initializeState( sJSONSource, $.proxy(this.OnNewSheetLoaded, this));
        }

        public OnNewSheetLoaded() {
            this.setValuesOfPreferencesDialog();
        }

        private setValuesOfAboutDialog () {
            var e = document.getElementById("toneClockVersion");
            e.innerText = this.tc.sVERSION;
        }

        private setValuesOfPreferencesDialog() {
            // set sliders
            $( "#sliderClocksHorizontal" ).slider( "option", "value", this.tc.getClocksHorizontal() );
            $( "#sliderClocksHorizontal .ui-slider-handle:first").attr("data-original-title", this.tc.getClocksHorizontal());

            $( "#sliderClocksVertical" ).slider( "option", "value", this.tc.getClocksVertical() );
            $( "#sliderClocksVertical .ui-slider-handle:first").attr("data-original-title", this.tc.getClocksVertical());

            $( "#sliderNoteNameRotation" ).slider( "option", "value", this.tc.getNoteNameRotation() );
            $( "#sliderNoteNameRotation .ui-slider-handle:first").attr("data-original-title", this.tc.getNoteNameRotation());

            $( "#sliderSheetTransposition" ).slider( "option", "value", this.tc.getSheetTransposition() );
            $( "#sliderSheetTransposition .ui-slider-handle:first").attr("data-original-title", this.tc.getSheetTransposition());

            $( "#sliderNoteNameMargin" ).slider( "option", "value", this.tc.getNoteNameMargin() );
            $( "#sliderNoteNameMargin .ui-slider-handle:first").attr("data-original-title", this.tc.getNoteNameMargin());

            $( "#sliderSizeClock" ).slider( "option", "value", this.tc.getClockSize() );
            $( "#sliderSizeClock .ui-slider-handle:first").attr("data-original-title", this.tc.getClockSize());

            $( "#sliderSizeClockCanvas" ).slider( "option", "value", this.tc.getClockCanvasSize() );
            $( "#sliderSizeClockCanvas .ui-slider-handle:first").attr("data-original-title", this.tc.getClockCanvasSize());

            $( "#sliderSizeFont" ).slider( "option", "value", this.tc.getNoteNameFontSize() );
            $( "#sliderSizeFont .ui-slider-handle:first").attr("data-original-title", this.tc.getNoteNameFontSize());

            $( "#sliderSizeHour" ).slider( "option", "value", this.tc.getHourSize() );
            $( "#sliderSizeHour .ui-slider-handle:first").attr("data-original-title", this.tc.getHourSize());

            // set radio buttons: interval
            var sRadioButtonId = "";
            var radio;

            switch ( this.tc.getNoteNameStyle() ) {
                case 0:
                    sRadioButtonId = "#contextRadioFourths";
                    break;
                case 1:
                    sRadioButtonId = "#contextRadioSeconds";
                    break;
            }
            radio = $( sRadioButtonId );
            radio[0].checked = true;

            switch ( this.tc.getNoteNameDirection() ) {
                case true:
                    sRadioButtonId = "#contextRadioClockwise";
                    break;
                case false:
                    sRadioButtonId = "#contextRadioAntiClockwise";
                    break;
            }
            radio = $( sRadioButtonId );
            radio[0].checked = true;

            switch ( this.tc.getNoteNameFlat() ) {
                case true:
                    sRadioButtonId = "#contextRadioFlat";
                    break;
                case false:
                    sRadioButtonId = "#contextRadioSharp";
                    break;
            }
            radio = $( sRadioButtonId );
            radio[0].checked = true;
        }

        public loadSheet() {
            document.getElementById("loadFile").click();
        }

        public Initialize () {
            this.initializeToneClock();
            this.setValuesOfAboutDialog();
            var that = this;

            // register event handlers

            $(document).bind("click", function(event) {
                document.getElementById("hourContextMenu").style.cssText = "opacity:0;visibility:hidden;z-index:0;";
                document.getElementById("hourContextMenu").className = "dropdown-menu .contextMenuHide";

                // document.getElementById("harmonyContextMenu").style.cssText = "opacity:0;visibility:hidden;z-index:0;";
                // document.getElementById("harmonyContextMenu").className = "dropdown-menu .contextMenuHide";
            });

            $( "#menuSheetEmptyA44x5" ).click(function( event, ui ) {
                that.getToneClockSheet ("emptyA44x5.json");
            });

            $( "#menu4BasicTriads" ).click(function( event, ui ) {
                that.getToneClockSheet ("4basictriads.json");
            });

            $( "#menu5Basic7thChords" ).click(function( event, ui ) {
                that.getToneClockSheet ("5basic7thchords.json");
            });

            $( "#menuMajorTriadsOverMinorHarmony" ).click(function( event, ui ) {
                that.getToneClockSheet ("majortriadsoverminorharmony.json");
            });

            $( "#menuMajorModes" ).click(function( event, ui ) {
                that.getToneClockSheet ("majormodes.json");
            });

            $( "#menuMelodicMinorModes" ).click(function( event, ui ) {
                that.getToneClockSheet ("melodicminormodes.json");
            });

            $( "#menuPeterSchat" ).click(function( event, ui ) {
                that.getToneClockSheet ("peterschat.json");
            });

            $( "#menuSheetV7" ).click(function( event, ui ) {
                that.getToneClockSheet ("dominant7th.json");
            });

            $( "#menuDiminishedScale" ).click(function( event, ui ) {
                that.getToneClockSheet ("diminishedscale.json");
            });

            $( "#menuSheetIntervals" ).click(function( event, ui ) {
                that.getToneClockSheet ("intervals.json");
            });

            $( "#menuSheetTrichords" ).click(function( event, ui ) {
                that.getToneClockSheet ("trichords.json");
            });

            $( "#menuSheetTetrachords" ).click(function( event, ui ) {
                that.getToneClockSheet ("tetrachords.json");
            });

            $( "#menuSheetPentachords" ).click(function( event, ui ) {
                that.getToneClockSheet ("pentachords.json");
            });

            $( "#menuSheetHexachords" ).click(function( event, ui ) {
                that.getToneClockSheet ("hexachords.json");
            });

            $( "#menuSheetHeptachords" ).click(function( event, ui ) {
                that.getToneClockSheet ("heptachords.json");
            });


            $( "#menuSheetOctachords" ).click(function( event, ui ) {
                that.getToneClockSheet ("octachords.json");
            });

            $( "#menuSheetMessiaen" ).click(function( event, ui ) {
                that.getToneClockSheet ("messiaen.json");
            });

            $( "#menuPreferences" ).click(function( event, ui ) {
                $( "#preferencesPopup" ).modal( "show" );
            });

            $( "#menuAbout" ).click(function( event, ui ) {
                $( "#aboutPopup" ).modal( "show" );
            });

            $( "#menuSave" ).click(function( event, ui ) {
                that.tcc.saveSheet();
            });

            $( "#menuOpen" ).click(function( event, ui ) {
                that.loadSheet();
            });

            $( "#loadFile" ).change(function( event, ui ) {
                that.tcc.handleFileSelect(event);
            });

            $( "#menuPrint" ).click(function( event, ui ) {
                $( "#menu" ).hide( "blind" );
                window.print();
                $( "#menu ").show( "blind" );
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

            $( "#contextRadioFourths" ).on('toggle',function( event, ui ) {
                that.tc.setNoteNameStyle(0);
                that.tc.drawSheet();
            });

            $( "#contextRadioSeconds" ).on('toggle',function( event, ui ) {
                that.tc.setNoteNameStyle(1);
                that.tc.drawSheet();
            });

            $( "#contextRadioClockwise" ).on('toggle', function( event, ui ) {
                that.tc.setNoteNameDirection (true);
                that.tc.drawSheet();
            });

            $( "#contextRadioAntiClockwise" ).on('toggle',function( event, ui ) {
                that.tc.setNoteNameDirection (false);
                that.tc.drawSheet();
            });

            $( "#contextRadioFlat" ).on('toggle',function( event, ui ) {
                that.tc.setNoteNameFlat (true);
                that.tc.drawSheet();
            });

            $( "#contextRadioSharp" ).on('toggle',function( event, ui ) {
                that.tc.setNoteNameFlat (false);
                that.tc.drawSheet();
            });

            $( "#contextRadioAlphabet" ).on('toggle',function( event, ui ) {
                that.tc.setNoteNameAs (0);
                that.tc.drawSheet();
            });

            $( "#contextRadioPitchClass" ).on('toggle',function( event, ui ) {
                that.tc.setNoteNameAs (1);
                that.tc.drawSheet();
            });

            $( "#contextRadioHarmonicaClass" ).on('toggle',function( event, ui ) {
                that.tc.setNoteNameAs (2);
                that.tc.drawSheet();
            });

            $( "#contextRadioHarmonicaDimi" ).on('toggle',function( event, ui ) {
                that.tc.setNoteNameAs (3);
                that.tc.drawSheet();
            });

            $( "#contextRadioDoReMi" ).on('toggle',function( event, ui ) {
                that.tc.setNoteNameAs (4);
                that.tc.drawSheet();
            });

            $( "#chkPrimeForm" ).on('change',function( event, ui ) {
                that.tc.setDisplayPrimeForm(this.checked);
                that.tc.drawSheet();
            });
            $( "#chkForteCode" ).on('change',function( event, ui ) {
                that.tc.setDisplayForteCode(this.checked);
                that.tc.drawSheet();
            });
            $( "#chkIntervalVector" ).on('change',function( event, ui ) {
                that.tc.setDisplayIntervalVector(this.checked);
                that.tc.drawSheet();
            });
            $( "#chkPrimeInversion" ).on('change',function( event, ui ) {
                that.tc.setDisplayPrimeInversion(this.checked);
                that.tc.drawSheet();
            });


            $( "#sliderClocksHorizontal" ).slider( { min: 1, max: 20 });
            $( "#sliderClocksHorizontal .ui-slider-handle:first").hover(function (event){$( "#sliderClocksHorizontal .ui-slider-handle:first").tooltip("show");},function (event){});
            $( "#sliderClocksHorizontal" ).on( "slide", function( event, ui ) {
                $( "#sliderClocksHorizontal .ui-slider-handle:first").attr("data-original-title", ui.value).tooltip("show");
                var horClocks = ui.value;
                var verClocks = that.tc.getClocksVertical();

                that.tc.setCanvasSize( horClocks, verClocks );
                that.tc.drawSheet();
            });

            $( "#sliderClocksVertical" ).slider( { min: 1, max: 30 });
            $( "#sliderClocksVertical .ui-slider-handle:first").hover(function (event){$( "#sliderClocksVertical .ui-slider-handle:first").tooltip("show");},function (event){});
            $( "#sliderClocksVertical" ).on( "slide", function( event, ui ) {
                $( "#sliderClocksVertical .ui-slider-handle:first").attr("data-original-title", ui.value).tooltip("show");
                var horClocks = that.tc.getClocksHorizontal();
                var verClocks = ui.value;

                that.tc.getClocksVertical();
                that.tc.setCanvasSize( horClocks, verClocks );
                that.tc.drawSheet();
            });


            $( "#sliderNoteNameRotation").slider( {  min: -11, max: 11, orientation: 'horizontal' } );
            $( "#sliderNoteNameRotation .ui-slider-handle:first").hover(function (event){$( "#sliderNoteNameRotation .ui-slider-handle:first").tooltip("show");},function (event){});
            $( "#sliderNoteNameRotation" ).on( "slide", function( event, ui ) {
                $( "#sliderNoteNameRotation .ui-slider-handle:first").attr("data-original-title", ui.value).tooltip("show");
                that.tc.setNoteNameRotation( ui.value );
                that.tc.drawSheet();
            } );

            $( "#sliderNoteNameMargin").slider( {  min: 0, max: 100, orientation: 'horizontal' } );
            $( "#sliderNoteNameMargin .ui-slider-handle:first").hover(function (event){$( "#sliderNoteNameMargin .ui-slider-handle:first").tooltip("show");},function (event){});
            $( "#sliderNoteNameMargin" ).on( "slide", function( event, ui ) {
                $( "#sliderNoteNameMargin .ui-slider-handle:first").attr("data-original-title", ui.value).tooltip("show");
                that.tc.setNoteNameMargin( ui.value );
                that.tc.drawSheet();
            } );

            $( "#sliderSheetTransposition").slider( {  min: -6, max: 6, orientation: 'horizontal' } );
            $( "#sliderSheetTransposition .ui-slider-handle:first").hover(function (event){$( "#sliderSheetTransposition .ui-slider-handle:first").tooltip("show");},function (event){});
            $( "#sliderSheetTransposition" ).on( "slide", function( event, ui ) {
                $( "#sliderSheetTransposition .ui-slider-handle:first").attr("data-original-title", ui.value).tooltip("show");
                that.tc.setSheetTransposition( ui.value );
                that.tc.drawSheet();
            } );

            $( "#sliderSizeClock" ).slider( { min: 50, max: 1000 } );
            $( "#sliderSizeClock .ui-slider-handle:first").hover(function (event){$( "#sliderSizeClock .ui-slider-handle:first").tooltip("show");},function (event){});
            $( "#sliderSizeClock" ).on( "slide", function( event, ui ) {
                $( "#sliderSizeClock .ui-slider-handle:first").attr("data-original-title", ui.value).tooltip("show");
                that.tc.setClockSize( ui.value );
                that.tc.drawSheet();
            } );

            $( "#sliderSizeClockCanvas" ).slider( { min: 60, max: 1010 } );
            $( "#sliderSizeClockCanvas .ui-slider-handle:first").hover(function (event){$( "#sliderSizeClockCanvas .ui-slider-handle:first").tooltip("show");},function (event){});
            $( "#sliderSizeClockCanvas" ).on( "slide", function( event, ui ) {
                $( "#sliderSizeClockCanvas .ui-slider-handle:first").attr("data-original-title", ui.value).tooltip("show");
                that.tc.setClockCanvasSize( ui.value );
                that.tc.drawSheet();
            } );

            $( "#sliderSizeFont" ).slider( { min: 5, max: 30 } );
            $( "#sliderSizeFont .ui-slider-handle:first").hover(function (event){$( "#sliderSizeFont .ui-slider-handle:first").tooltip("show");},function (event){});
            $( "#sliderSizeFont" ).on( "slide", function( event, ui ) {
                $( "#sliderSizeFont .ui-slider-handle:first").attr("data-original-title", ui.value).tooltip("show");
                that.tc.setNoteNameFontSize( ui.value );
                that.tc.drawSheet();
            } );

            $( "#sliderSizeHour" ).slider( { min: 3, max: 30 } );
            $( "#sliderSizeHour .ui-slider-handle:first").hover(function (event){$( "#sliderSizeHour .ui-slider-handle:first").tooltip("show");},function (event){});
            $( "#sliderSizeHour" ).on( "slide", function( event, ui ) {
                $( "#sliderSizeHour .ui-slider-handle:first").attr("data-original-title", ui.value).tooltip("show");
                that.tc.setHourSize( ui.value );
                that.tc.drawSheet();
            } );
        }
    }
}