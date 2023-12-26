/**
 * @author Wim Dijkgraaf
 */

// global variable pointing to instance of ToneClock
	var tc = {}; // ToneClock widget
	var tcc = {}; // ToneClock controller
	
	function initializeToneClock() {
		tc = new ToneClockWidget();
		tcc = new ToneClockController( tc );
		
		tc.createCanvasElement("toneClockArea");
		tcc.initializeState( "emptyA44x5.json", function () {
			tc.drawCanvas();
			setValuesOfPreferencesDialog();
		});
	}
	
	function selectToneClockSheet (sJSONSource) {
		tcc.initializeState( sJSONSource, function () {		
			tc.drawCanvas();
			tc.drawHarmoniesOfClocks();
			setValuesOfPreferencesDialog();
		});
	}
	
	function setValuesOfAboutDialog() {
		var e = document.getElementById("toneClockVersion");

		e.innerText = tc.sVERSION;
	}
	
	function setValuesOfPreferencesDialog() {
		// set sliders
		$( "#sliderClocksHorizontal" ).slider( "option", "value", tc.getClocksHorizontal() );
        $( "#sliderClocksHorizontal .ui-slider-handle:first").attr("data-original-title", tc.getClocksHorizontal());

        $( "#sliderClocksVertical" ).slider( "option", "value", tc.getClocksVertical() );
        $( "#sliderClocksVertical .ui-slider-handle:first").attr("data-original-title", tc.getClocksVertical());

        $( "#sliderNoteNameRotation" ).slider( "option", "value", tc.getNoteNameRotation() );
        $( "#sliderNoteNameRotation .ui-slider-handle:first").attr("data-original-title", tc.getNoteNameRotation());

        $( "#sliderSheetTransposition" ).slider( "option", "value", tc.getSheetTransposition() );
        $( "#sliderSheetTransposition .ui-slider-handle:first").attr("data-original-title", tc.getSheetTransposition());

        $( "#sliderNoteNameMargin" ).slider( "option", "value", tc.getNoteNameMargin() );
        $( "#sliderNoteNameMargin .ui-slider-handle:first").attr("data-original-title", tc.getNoteNameMargin());

        $( "#sliderSizeClock" ).slider( "option", "value", tc.getClockSize() );
        $( "#sliderSizeClock .ui-slider-handle:first").attr("data-original-title", tc.getClockSize());

		$( "#sliderSizeClockCanvas" ).slider( "option", "value", tc.getClockCanvasSize() );
        $( "#sliderSizeClockCanvas .ui-slider-handle:first").attr("data-original-title", tc.getClockCanvasSize());

		$( "#sliderSizeFont" ).slider( "option", "value", tc.getNoteNameFontSize() );
        $( "#sliderSizeFont .ui-slider-handle:first").attr("data-original-title", tc.getNoteNameFontSize());

		$( "#sliderSizeHour" ).slider( "option", "value", tc.getHourSize() );
        $( "#sliderSizeHour .ui-slider-handle:first").attr("data-original-title", tc.getHourSize());
		
		// set radio buttons: interval
		var sRadioButtonId = "";
		
		switch ( tc.getNoteNameStyle() ) {
			case 0:
				sRadioButtonId = "#radioFourths";
				break;
			case 1: 
				sRadioButtonId = "#radioFifths";
				break;
			case 2:
				sRadioButtonId = "#radioSeconds";
				break;
		}
		$( sRadioButtonId ).radio('check');

		// set radio buttons: layout
		switch ( tc.getNoteNameDirection() ) {
		case true:
			sRadioButtonId = "#radioClockwise";
			break;
		case false: 
			sRadioButtonId = "#radioAntiClockwise";
			break;
		}
		$( sRadioButtonId ).radio('check');
		
		// set radio buttons: Accidentals
		switch ( tc.getNoteNameFlat() ) {
		case true:
			sRadioButtonId = "#radioFlat";
			break;
		case false: 
			sRadioButtonId = "#radioSharp";
			break;
		}
		$( sRadioButtonId ).radio('check');
		
		
	}

    function repositionTooltip( e, ui ) {
        var div = $(ui.handle).data("bs.tooltip").$tip[0];
        var pos = $.extend({}, $(ui.handle).offset(), { width: $(ui.handle).get(0).offsetWidth,
            height: $(ui.handle).get(0).offsetHeight
        });

        var actualWidth = div.offsetWidth;

        tp = {left: pos.left + pos.width / 2 - actualWidth / 2}
        $(div).offset(tp);
    }


// initializers and event handlers

	$(document).ready(function(){

		initializeToneClock();
		setValuesOfAboutDialog();
	
		// register event handlers
		
		$( "#menuSheetEmptyA44x5" ).click(function( event, ui ) {
			console.log("#menuSheetIntervals::click");
			selectToneClockSheet ("emptyA44x5.json");
		});

		$( "#menu4BasicTriads" ).click(function( event, ui ) {
			console.log("#menu4BasicTriads::click");
			selectToneClockSheet ("4basictriads.json");
		});
		
		$( "#menu5Basic7thChords" ).click(function( event, ui ) {
			console.log("#menu5Basic7thChords::click");
			selectToneClockSheet ("5basic7thchords.json");
		});
		
		$( "#menuMajorTriadsOverMinorHarmony" ).click(function( event, ui ) {
			console.log("#menuMajorTriadsOverMinorHarmony::click");
			selectToneClockSheet ("majortriadsoverminorharmony.json");
		});
		
		$( "#menuMajorModes" ).click(function( event, ui ) {
			console.log("#menuMajorModes::click");
			selectToneClockSheet ("majormodes.json");
		});

		$( "#menuMelodicMinorModes" ).click(function( event, ui ) {
			console.log("#menuMelodicMinorModes::click");
			selectToneClockSheet ("melodicminormodes.json");
		});
		
		$( "#menuPeterSchat" ).click(function( event, ui ) {
			console.log("#menuPeterSchat::click");
			selectToneClockSheet ("peterschat.json");
		});
		
		$( "#menuSheetV7" ).click(function( event, ui ) {
			console.log("#menuSheetV7::click");
			selectToneClockSheet ("dominant7th.json");
		});

		$( "#menuDiminishedScale" ).click(function( event, ui ) {
			console.log("#menuDiminishedScale::click");
			selectToneClockSheet ("diminishedscale.json");
		});
		
		$( "#menuSheetIntervals" ).click(function( event, ui ) {
			console.log("#menuSheetIntervals::click");
			selectToneClockSheet ("intervals.json");
		});

		$( "#menuSheetTrichords" ).click(function( event, ui ) {
			console.log("#menuSheetTrichords::click");
			selectToneClockSheet ("trichords.json");
		});

		$( "#menuSheetTetrachords" ).click(function( event, ui ) {
			console.log("#menuSheetTetrachords::click");
			selectToneClockSheet ("tetrachords.json");
		});
		
		$( "#menuSheetPentachords" ).click(function( event, ui ) {
			console.log("#menuSheetPentachords::click");
			selectToneClockSheet ("pentachords.json");
		});
		
		$( "#menuSheetHexachords" ).click(function( event, ui ) {
			console.log("#menuSheetHexachords::click");
			selectToneClockSheet ("hexachords.json");
		});
		
		$( "#menuSheetHeptachords" ).click(function( event, ui ) {
			console.log("#menuSheetHeptachords::click");
			selectToneClockSheet ("heptachords.json");
		});
		
		
		$( "#menuSheetOctachords" ).click(function( event, ui ) {
			console.log("#menuSheetOctachords::click");
			selectToneClockSheet ("octachords.json");
		});

		$( "#menuSheetMessiaen" ).click(function( event, ui ) {
			console.log("#menuSheetMessiaen::click");
			selectToneClockSheet ("messiaen.json");
		});
		
		$( "#menuPreferences" ).click(function( event, ui ) {
			$( "#preferencesPopup" ).modal( "show" );
		});
		
		$( "#menuAbout" ).click(function( event, ui ) {
			$( "#aboutPopup" ).modal( "show" );
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
		
		$( "#radioFourths" ).on('toggle',function( event, ui ) {
			tc.setNoteNameStyle(0);
			tc.drawCanvas();
			tc.drawHarmoniesOfClocks();
		});
		
		$( "#radioFifths" ).on('toggle',function( event, ui ) {
			tc.setNoteNameStyle(1);
			tc.drawCanvas();
			tc.drawHarmoniesOfClocks();
		});
		
		$( "#radioSeconds" ).on('toggle',function( event, ui ) {
			tc.setNoteNameStyle(2);
			tc.drawCanvas();
			tc.drawHarmoniesOfClocks();
		});
		
		$( "#radioClockwise" ).on('toggle', function( event, ui ) {
			tc.setNoteNameDirection (true);
			tc.drawCanvas();
			tc.drawHarmoniesOfClocks();
		});

		$( "#radioAntiClockwise" ).on('toggle',function( event, ui ) {
			tc.setNoteNameDirection (false);
			tc.drawCanvas();
			tc.drawHarmoniesOfClocks();
		});
		
		$( "#radioFlat" ).on('toggle',function( event, ui ) {
			tc.setNoteNameFlat (true);
			tc.drawCanvas();
			tc.drawHarmoniesOfClocks();
		});

		$( "#radioSharp" ).on('toggle',function( event, ui ) {
			tc.setNoteNameFlat (false);
			tc.drawCanvas();
			tc.drawHarmoniesOfClocks();
		});
			

		$( "#radioAlphabet" ).on('toggle',function( event, ui ) {
			tc.setNoteNameAs (0);
			tc.drawCanvas();
			tc.drawHarmoniesOfClocks();
		});

		$( "#radioPitchClass" ).on('toggle',function( event, ui ) {
			tc.setNoteNameAs (1);
			tc.drawCanvas();
			tc.drawHarmoniesOfClocks();
		});

        $( "#radioHarmonicaClass" ).on('toggle',function( event, ui ) {
            tc.setNoteNameAs (2);
            tc.drawCanvas();
            tc.drawHarmoniesOfClocks();
        });

        $( "#chkPrimeForm" ).on('change',function( event, ui ) {
            tc.setDisplayPrimeForm(this.checked);
            tc.drawCanvas();
            tc.drawHarmoniesOfClocks();
        });
        $( "#chkForteCode" ).on('change',function( event, ui ) {
            tc.setDisplayForteCode(this.checked);
            tc.drawCanvas();
            tc.drawHarmoniesOfClocks();
        });
        $( "#chkIntervalVector" ).on('change',function( event, ui ) {
            tc.setDisplayIntervalVector(this.checked);
            tc.drawCanvas();
            tc.drawHarmoniesOfClocks();
        });
        $( "#chkPrimeInversion" ).on('change',function( event, ui ) {
            tc.setDisplayPrimeInversion(this.checked);
            tc.drawCanvas();
            tc.drawHarmoniesOfClocks();
        });


		$( "#sliderClocksHorizontal" ).slider( { min: 1, max: 20 });
        $( "#sliderClocksHorizontal .ui-slider-handle:first").hover(function (event){$( "#sliderClocksHorizontal .ui-slider-handle:first").tooltip("show");},function (event){});
        $( "#sliderClocksHorizontal" ).on( "slide", function( event, ui ) {
            $( "#sliderClocksHorizontal .ui-slider-handle:first").attr("data-original-title", ui.value).tooltip("show");
			var horClocks = ui.value;
			var verClocks = tc.getClocksVertical();
			
			tc.setCanvasSize( horClocks, verClocks );
			tc.drawCanvas();
			tc.drawHarmoniesOfClocks();
		});
		
		$( "#sliderClocksVertical" ).slider( { min: 1, max: 30 });
        $( "#sliderClocksVertical .ui-slider-handle:first").hover(function (event){$( "#sliderClocksVertical .ui-slider-handle:first").tooltip("show");},function (event){});
        $( "#sliderClocksVertical" ).on( "slide", function( event, ui ) {
            $( "#sliderClocksVertical .ui-slider-handle:first").attr("data-original-title", ui.value).tooltip("show");
			var horClocks = tc.getClocksHorizontal();
			var verClocks = ui.value;
			
			tc.getClocksVertical();
			tc.setCanvasSize( horClocks, verClocks );
			tc.drawCanvas();
			tc.drawHarmoniesOfClocks();
		});
		
		
		$( "#sliderNoteNameRotation").slider( {  min: -11, max: 11, orientation: 'horizontal' } );
        $( "#sliderNoteNameRotation .ui-slider-handle:first").hover(function (event){$( "#sliderNoteNameRotation .ui-slider-handle:first").tooltip("show");},function (event){});
		$( "#sliderNoteNameRotation" ).on( "slide", function( event, ui ) {
            $( "#sliderNoteNameRotation .ui-slider-handle:first").attr("data-original-title", ui.value).tooltip("show");
            tc.setNoteNameRotation( ui.value );
			tc.drawCanvas();
			tc.drawHarmoniesOfClocks();
		} );

        $( "#sliderNoteNameMargin").slider( {  min: 0, max: 100, orientation: 'horizontal' } );
        $( "#sliderNoteNameMargin .ui-slider-handle:first").hover(function (event){$( "#sliderNoteNameMargin .ui-slider-handle:first").tooltip("show");},function (event){});
        $( "#sliderNoteNameMargin" ).on( "slide", function( event, ui ) {
            $( "#sliderNoteNameMargin .ui-slider-handle:first").attr("data-original-title", ui.value).tooltip("show");
            tc.setNoteNameMargin( ui.value );
            tc.drawCanvas();
            tc.drawHarmoniesOfClocks();
        } );
		
		$( "#sliderSheetTransposition").slider( {  min: -6, max: 6, orientation: 'horizontal' } );
        $( "#sliderSheetTransposition .ui-slider-handle:first").hover(function (event){$( "#sliderSheetTransposition .ui-slider-handle:first").tooltip("show");},function (event){});
        $( "#sliderSheetTransposition" ).on( "slide", function( event, ui ) {
            $( "#sliderSheetTransposition .ui-slider-handle:first").attr("data-original-title", ui.value).tooltip("show");
            tc.setSheetTransposition( ui.value );
			tc.drawCanvas();
			tc.drawHarmoniesOfClocks();
		} );
		
		$( "#sliderSizeClock" ).slider( { min: 50, max: 1000 } );
        $( "#sliderSizeClock .ui-slider-handle:first").hover(function (event){$( "#sliderSizeClock .ui-slider-handle:first").tooltip("show");},function (event){});
        $( "#sliderSizeClock" ).on( "slide", function( event, ui ) {
            $( "#sliderSizeClock .ui-slider-handle:first").attr("data-original-title", ui.value).tooltip("show");
            tc.setClockSize( ui.value );
			tc.drawCanvas();
			tc.drawHarmoniesOfClocks();
		} );
		
		$( "#sliderSizeClockCanvas" ).slider( { min: 60, max: 1010 } );
        $( "#sliderSizeClockCanvas .ui-slider-handle:first").hover(function (event){$( "#sliderSizeClockCanvas .ui-slider-handle:first").tooltip("show");},function (event){});
        $( "#sliderSizeClockCanvas" ).on( "slide", function( event, ui ) {
            $( "#sliderSizeClockCanvas .ui-slider-handle:first").attr("data-original-title", ui.value).tooltip("show");
            tc.setClockCanvasSize( ui.value );
			tc.drawCanvas();
			tc.drawHarmoniesOfClocks();
		} );
		
		$( "#sliderSizeFont" ).slider( { min: 5, max: 30 } );
        $( "#sliderSizeFont .ui-slider-handle:first").hover(function (event){$( "#sliderSizeFont .ui-slider-handle:first").tooltip("show");},function (event){});
        $( "#sliderSizeFont" ).on( "slide", function( event, ui ) {
            $( "#sliderSizeFont .ui-slider-handle:first").attr("data-original-title", ui.value).tooltip("show");
            tc.setNoteNameFontSize( ui.value );
			tc.drawCanvas();
			tc.drawHarmoniesOfClocks();
		} );
		
		$( "#sliderSizeHour" ).slider( { min: 3, max: 30 } );
        $( "#sliderSizeHour .ui-slider-handle:first").hover(function (event){$( "#sliderSizeHour .ui-slider-handle:first").tooltip("show");},function (event){});
        $( "#sliderSizeHour" ).on( "slide", function( event, ui ) {
            $( "#sliderSizeHour .ui-slider-handle:first").attr("data-original-title", ui.value).tooltip("show");
            tc.setHourSize( ui.value );
			tc.drawCanvas();
			tc.drawHarmoniesOfClocks();
		} );
	});