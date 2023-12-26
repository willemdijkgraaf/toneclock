/**
 1* @author Wim Dijkgraaf
 */	

// Declare the object and it's constructor

function ToneClockController( oToneClock ) {
	// public member variables
	this.sNAME = "Tone Clock Controller";
	this.sVERSION = "0.1";
	this.that = this;
	this.toneClock = oToneClock; // reference injection through constructor.
	this.jsonToneClockSheet = "";
	
	// private member variables
}
	
ToneClockController.prototype = {
		
	initializeState: function ( sJSONSource, fCallback) {
		
		$.ajaxSetup({ cache: false });
		$.getJSON("../application/data/" + sJSONSource, function (items){			
			//REFACTOR: references to tcc and tc should be injected, not global.
			tcc.jsonToneClockSheet = items;
			$.ajaxSetup({ cache: true });
			
			tc.setSheetTitle ( items.toneclocksheet.name );
			tc.setClockCanvasSize ( items.toneclocksheet.clockcanvassize );
			tc.setClockSize ( items.toneclocksheet.clocksize );
			tc.setHourSize ( items.toneclocksheet.hoursize );
			tc.setCanvasSize( items.toneclocksheet.clockshorizontal, items.toneclocksheet.clocksvertical );
			tc.setNoteNameStyle ( items.toneclocksheet.notenamestyle );
			tc.setNoteNameDirection (items.toneclocksheet.notenamedirection);
			tc.setNoteNameFlat (items.toneclocksheet.notenameaccidentals);
			tc.setNoteNameMargin ( items.toneclocksheet.notenamemargin );
			tc.setNoteNameFontSize (items.toneclocksheet.notenamefontsize);
			tc.setNoteNameFontName (items.toneclocksheet.notenamefontname);
			tc.setNoteNameRotation( items.toneclocksheet.notenamerotation );
			
			tc.initializeClocks();
			tcc.setPropertiesOfClocks();
			
			if (typeof fCallback === "function") {
				fCallback();
			}
		});
		
		return true;
	},
	
	
	setPropertiesOfClocks: function () {		
		tc.removeHarmoniesFromSheet();
		if (typeof(this.jsonToneClockSheet.toneclocks) === 'object') {
			for (var i = 0; i < this.jsonToneClockSheet.toneclocks.length; i++) {
				this._setClockProperties(this.jsonToneClockSheet.toneclocks[i]);
				this._setHarmonies(this.jsonToneClockSheet.toneclocks[i]);
			}
		}
	},
	
	_setHarmonies: function ( jsonToneClock ) {
		if (typeof(jsonToneClock.harmonies) === 'object') {
			for (var i = 0; i < jsonToneClock.harmonies.length; i++) {
				this._addHarmony( jsonToneClock, jsonToneClock.harmonies[i]);
			}
		}
	},
	

	_setClockProperties: function ( jsonToneClock ) {
		tc.setClockProperties(
				jsonToneClock.id,
				jsonToneClock.name,
				jsonToneClock.displayRoot,
				jsonToneClock.rootNoteNumber);
	},
	
	_addHarmony: function ( jsonToneClock, jsonHarmony ) {
		tc.addHarmony(
				jsonToneClock.id,
				jsonHarmony.id,
				jsonHarmony.color,
				jsonHarmony.fill,
				jsonHarmony.midiNotes);
	}
	
}; // close ToneClockController.prototype

