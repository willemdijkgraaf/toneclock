/**
 * @author Wim Dijkgraaf
 */

// Declare the object and it's constructor
function ToneClockWidget() {
	// public member variables
	this.sNAME = "Tone Clock";
	this.sVERSION = "1.1";
	// private member variables
	
	this.myContext = {};
	this.myCanvas = {};
	this.mySheetTitle = "";
	this.mySheetTransposition = 0;
	this.myClocksHorizontal = 0;
	this.myClocksVertical = 0;
	this.myClockSize = 0;
	this.myClockCanvasSize = 0;
	this.myCanvasWidth = 0;
	this.myCanvasHeight = 0;
	this.myHourSize = 0;
	this.myClocks = []; // array of clocks with following properties: {'xpos' : 0, 'ypos' : 0}
	this.myNoteNameStyle = 0; // 0 = 4ths, 1 = 2nds
	this.myNoteNameFlat = false;
	// this.myNoteNameAsPitchClass = false;
    this.myNoteNameAs = 0; // 0 = standard note names, 1 = pitch classes, 2 = chr harmonica names
	this.myNoteNameDirection = false;
	this.myNoteNameMargin = 0;
	this.myNoteNameFontSize = 0;
	this.myNoteNameRotation = 0;
	this.myNoteNameFontName = "";
	this.myToneClockId = 0;

    this.myDisplayPrimeForm = false;
    this.myDisplayForteCode = false;
    this.myDisplayIntervalVector = false;
    this.myDisplayPrimeInversion = false;
	
	this.arrNoteNames = [
			[ "G","C","F","Bb","Eb","Ab","Db","Gb","B","E","A","D", "G","C","F","Bb","Eb","Ab","Db","Gb","B","E","A","D" ] ,
			[ "A","E","B","Gb","Db","Ab","Eb","Bb","F","C","G","D", "A","E","B","Gb","Db","Ab","Eb","Bb","F","C","G","D" ] ,
			[ "A","E","B","Gb","Db","Ab","Eb","Bb","F","C","G","D", "A","E","B","Gb","Db","Ab","Eb","Bb","F","C","G","D" ] ,
			[ "G","C","F","Bb","Eb","Ab","Db","Gb","B","E","A","D", "G","C","F","Bb","Eb","Ab","Db","Gb","B","E","A","D" ] ,
			[ "Eb","E","F","Gb","G","Ab","A","Bb","B","C","Db","D", "Eb","E","F","Gb","G","Ab","A","Bb","B","C","Db","D" ] ,
			[ "Db","C","B","Bb","A","Ab","G","Gb","F","E","Eb","D", "Db","C","B","Bb","A","Ab","G","Gb","F","E","Eb","D" ] ,
			
			[ "G","C","F","A#","D#","G#","C#","F#","B","E","A","D", "G","C","F","A#","D#","G#","C#","F#","B","E","A","D" ] ,
			[ "A","E","B","F#","C#","G#","D#","A#","F","C","G","D", "A","E","B","F#","C#","G#","D#","A#","F","C","G","D" ] ,
			[ "A","E","B","F#","C#","G#","D#","A#","F","C","G","D", "A","E","B","F#","C#","G#","D#","A#","F","C","G","D" ] ,
			[ "G","C","F","A#","D#","G#","C#","F#","B","E","A","D", "G","C","F","A#","D#","G#","C#","F#","B","E","A","D" ] ,
			[ "D#","E","F","F#","G","G#","A","A#","B","C","C#","D", "D#","E","F","F#","G","G#","A","A#","B","C","C#","D" ] ,
			[ "C#","C","B","A#","A","G#","G","F#","F","E","D#","D", "C#","C","B","A#","A","G#","G","F#","F","E","D#","D" ] ,
			
			[ "7","0","5","10","3","8","1","6","11","4","9","2", "7","0","5","10","3","8","1","6","11","4","9","2" ] ,
			[ "9","4","11","6","1","8","3","10","5","0","7","2", "9","4","11","6","1","8","3","10","5","0","7","2" ] ,
			[ "9","4","11","6","1","8","3","10","5","0","7","2", "9","4","11","6","1","8","3","10","5","0","7","2" ] ,
			[ "7","0","5","10","3","8","1","6","11","4","9","2", "7","0","5","10","3","8","1","6","11","4","9","2" ] ,
			[ "3","4","5","6","7","8","9","10","11","0","1","2", "3","4","5","6","7","8","9","10","11","0","1","2" ] ,
			[ "1","0","11","10","9","8","7","6","5","4","3","2", "1","0","11","10","9","8","7","6","5","4","3","2" ] ,

			[ "7","0","5","10","3","8","1","6","11","4","9","2", "7","0","5","10","3","8","1","6","11","4","9","2" ] ,
			[ "9","4","11","6","1","8","3","10","5","0","7","2", "9","4","11","6","1","8","3","10","5","0","7","2" ] ,
			[ "9","4","11","6","1","8","3","10","5","0","7","2", "9","4","11","6","1","8","3","10","5","0","7","2" ] ,
			[ "7","0","5","10","3","8","1","6","11","4","9","2", "7","0","5","10","3","8","1","6","11","4","9","2" ] ,
			[ "3","4","5","6","7","8","9","10","11","0","1","2", "3","4","5","6","7","8","9","10","11","0","1","2" ] ,
			[ "1","0","11","10","9","8","7","6","5","4","3","2", "1","0","11","10","9","8","7","6","5","4","3","2" ] ,

        [ "G 3b","C 1b/4d+/4b","F 2d/2b+","Bb 3d+","Eb 1d+","Ab 3b+","Db 1b+","Gb 2d+","B 4d","E 2b","A 3d","D 1d", "G 3b","C 1b/4d+/4b","F 2d/2b+","Bb 3d+","Eb 1d+","Ab 3b+","Db 1b+","Gb 2d+","B 4d","E 2b","A 3d","D 1d" ] ,
        [ "A 3d","E 2b","B 4d","Gb 2d+","Db 1b+","Ab 3b+","Eb 1d+","Bb 3d+","F 2d/2b+","C 1b/4d+/4b","G 3b","D 1d", "A 3d","E 2b","B 4d","Gb 2d+","Db 1b+","Ab 3b+","Eb 1d+","Bb 3d+","F 2d/2b+","C 1b/4d+/4b","G 3b","D 1d" ] ,
        [ "A 3d","E 2b","B 4d","Gb 2d+","Db 1b+","Ab 3b+","Eb 1d+","Bb 3d+","F 2d/2b+","C 1b/4d+/4b","G 3b","D 1d", "A 3d","E 2b","B 4d","Gb 2d+","Db 1b+","Ab 3b+","Eb 1d+","Bb 3d+","F 2d/2b+","C 1b/4d+/4b","G 3b","D 1d" ] ,
        [ "G 3b","C 1b/4d+/4b","F 2d/2b+","Bb 3d+","Eb 1d+","Ab 3b+","Db 1b+","Gb 2d+","B 4d","E 2b","A 3d","D 1d", "G 3b","C 1b/4d+/4b","F 2d/2b+","Bb 3d+","Eb 1d+","Ab 3b+","Db 1b+","Gb 2d+","B 4d","E 2b","A 3d","D 1d" ] ,
        [ "Eb 1d+","E 2b","F 2d/2b+","Gb 2d+","G 3b","Ab 3b+","A 3d","Bb 3d+","B 4d","C 1b/4d+/4b","Db 1b+","D 1d", "Eb 1d+","E 2b","F 2d/2b+","Gb 2d+","G 3b","Ab 3b+","A 3d","Bb 3d+","B 4d","C 1b/4d+/4b","Db 1b+","D 1d" ] ,
        [ "Db 1b+","C 1b/4d+/4b","B 4d","Bb 3d+","A 3d","Ab 3b+","G 3b","Gb 2d+","F 2d/2b+","E 2b","Eb 1d+","D 1d", "Db 1b+","C 1b/4d+/4b","B 4d","Bb 3d+","A 3d","Ab 3b+","G 3b","Gb 2d+","F 2d/2b+","E 2b","Eb 1d+","D 1d" ] ,

        [ "G 3b","C 1b/4d+/4b","F 2d/2b+","A# 3d+","D# 1d+","G# 3b+","C# 1b+","F# 2d+","B 4d","E 2b","A 3d","D 1d", "G 3b","C 1b/4d+/4b","F 2d/2b+","A# 3d+","D# 1d+","G# 3b+","C# 1b+","F# 2d+","B 4d","E 2b","A 3d","D 1d" ] ,
        [ "A 3d","E 2b","B 4d","F# 2d+","C# 1b+","G# 3b+","D# 1d+","A# 3d+","F 2d/2b+","C 1b/4d+/4b","G 3b","D 1d", "A 3d","E 2b","B 4d","F# 2d+","C# 1b+","G# 3b+","D# 1d+","A# 3d+","F 2d/2b+","C 1b/4d+/4b","G 3b","D 1d" ] ,
        [ "A 3d","E 2b","B 4d","F# 2d+","C# 1b+","G# 3b+","D# 1d+","A# 3d+","F 2d/2b+","C 1b/4d+/4b","G 3b","D 1d", "A 3d","E 2b","B 4d","F# 2d+","C# 1b+","G# 3b+","D# 1d+","A# 3d+","F 2d/2b+","C 1b/4d+/4b","G 3b","D 1d" ] ,
        [ "G 3b","C 1b/4d+/4b","F 2d/2b+","A# 3d+","D# 1d+","G# 3b+","C# 1b+","F# 2d+","B 4d","E 2b","A 3d","D 1d", "G 3b","C 1b/4d+/4b","F 2d/2b+","A# 3d+","D# 1d+","G# 3b+","C# 1b+","F# 2d+","B 4d","E 2b","A 3d","D 1d" ] ,
        [ "D# 1d+","E 2b","F 2d/2b+","F# 2d+","G 3b","G# 3b+","A 3d","A# 3d+","B 4d","C 1b/4d+/4b","C# 1b+","D 1d", "D# 1d+","E 2b","F 2d/2b+","F# 2d+","G 3b","G# 3b+","A 3d","A# 3d+","B 4d","C 1b/4d+/4b","C# 1b+","D 1d" ] ,
        [ "C# 1b+","C 1b/4d+/4b","B 4d","A# 3d+","A 3d","G# 3b+","G 3b","F# 2d+","F 2d/2b+","E 2b","D# 1d+","D 1d", "C# 1b+","C 1b/4d+/4b","B 4d","A# 3d+","A 3d","G# 3b+","G 3b","F# 2d+","F 2d/2b+","E 2b","D# 1d+","D 1d" ]
				
		];

	this.arrMidiNoteNumbers = [
			[ 7,0,5,10,3,8,1,6,11,4,9,2, 7,0,5,10,3,8,1,6,11,4,9,2 ] ,
			[ 9,4,11,6,1,8,3,10,5,0,7,2, 9,4,11,6,1,8,3,10,5,0,7,2 ] ,
			[ 9,4,11,6,1,8,3,10,5,0,7,2, 9,4,11,6,1,8,3,10,5,0,7,2 ] ,
			[ 7,0,5,10,3,8,1,6,11,4,9,2, 7,0,5,10,3,8,1,6,11,4,9,2 ] ,
			[ 3,4,5,6,7,8,9,10,11,0,1,2, 3,4,5,6,7,8,9,10,11,0,1,2 ] ,
			[ 1,0,11,10,9,8,7,6,5,4,3,2, 1,0,11,10,9,8,7,6,5,4,3,2 ] ,
			
			[ 7,0,5,10,3,8,1,6,11,4,9,2, 7,0,5,10,3,8,1,6,11,4,9,2 ] ,
			[ 9,4,11,6,1,8,3,10,5,0,7,2, 9,4,11,6,1,8,3,10,5,0,7,2 ] ,
			[ 9,4,11,6,1,8,3,10,5,0,7,2, 9,4,11,6,1,8,3,10,5,0,7,2 ] ,
			[ 7,0,5,10,3,8,1,6,11,4,9,2, 7,0,5,10,3,8,1,6,11,4,9,2 ] ,
			[ 3,4,5,6,7,8,9,10,11,0,1,2, 3,4,5,6,7,8,9,10,11,0,1,2 ] ,
			[ 1,0,11,10,9,8,7,6,5,4,3,2, 1,0,11,10,9,8,7,6,5,4,3,2 ] ,

			[ 7,0,5,10,3,8,1,6,11,4,9,2, 7,0,5,10,3,8,1,6,11,4,9,2 ] ,
			[ 9,4,11,6,1,8,3,10,5,0,7,2, 9,4,11,6,1,8,3,10,5,0,7,2 ] ,
			[ 9,4,11,6,1,8,3,10,5,0,7,2, 9,4,11,6,1,8,3,10,5,0,7,2 ] ,
			[ 7,0,5,10,3,8,1,6,11,4,9,2, 7,0,5,10,3,8,1,6,11,4,9,2 ] ,
			[ 3,4,5,6,7,8,9,10,11,0,1,2, 3,4,5,6,7,8,9,10,11,0,1,2 ] ,
			[ 1,0,11,10,9,8,7,6,5,4,3,2, 1,0,11,10,9,8,7,6,5,4,3,2 ] ,

			[ 7,0,5,10,3,8,1,6,11,4,9,2, 7,0,5,10,3,8,1,6,11,4,9,2 ] ,
			[ 9,4,11,6,1,8,3,10,5,0,7,2, 9,4,11,6,1,8,3,10,5,0,7,2 ] ,
			[ 9,4,11,6,1,8,3,10,5,0,7,2, 9,4,11,6,1,8,3,10,5,0,7,2 ] ,
			[ 7,0,5,10,3,8,1,6,11,4,9,2, 7,0,5,10,3,8,1,6,11,4,9,2 ] ,
			[ 3,4,5,6,7,8,9,10,11,0,1,2, 3,4,5,6,7,8,9,10,11,0,1,2 ] ,
			[ 1,0,11,10,9,8,7,6,5,4,3,2, 1,0,11,10,9,8,7,6,5,4,3,2 ] ,

        [ 7,0,5,10,3,8,1,6,11,4,9,2, 7,0,5,10,3,8,1,6,11,4,9,2 ] ,
        [ 9,4,11,6,1,8,3,10,5,0,7,2, 9,4,11,6,1,8,3,10,5,0,7,2 ] ,
        [ 9,4,11,6,1,8,3,10,5,0,7,2, 9,4,11,6,1,8,3,10,5,0,7,2 ] ,
        [ 7,0,5,10,3,8,1,6,11,4,9,2, 7,0,5,10,3,8,1,6,11,4,9,2 ] ,
        [ 3,4,5,6,7,8,9,10,11,0,1,2, 3,4,5,6,7,8,9,10,11,0,1,2 ] ,
        [ 1,0,11,10,9,8,7,6,5,4,3,2, 1,0,11,10,9,8,7,6,5,4,3,2 ] ,

        [ 7,0,5,10,3,8,1,6,11,4,9,2, 7,0,5,10,3,8,1,6,11,4,9,2 ] ,
        [ 9,4,11,6,1,8,3,10,5,0,7,2, 9,4,11,6,1,8,3,10,5,0,7,2 ] ,
        [ 9,4,11,6,1,8,3,10,5,0,7,2, 9,4,11,6,1,8,3,10,5,0,7,2 ] ,
        [ 7,0,5,10,3,8,1,6,11,4,9,2, 7,0,5,10,3,8,1,6,11,4,9,2 ] ,
        [ 3,4,5,6,7,8,9,10,11,0,1,2, 3,4,5,6,7,8,9,10,11,0,1,2 ] ,
        [ 1,0,11,10,9,8,7,6,5,4,3,2, 1,0,11,10,9,8,7,6,5,4,3,2 ]
		];
}
	
ToneClockWidget.prototype = {
	
	getSheetTitle: function() {
		return this.mySheetTitle;
	},
	
	setSheetTitle: function ( sTitle ) {
		this.mySheetTitle = sTitle;
	},
	
	getSheetTransposition: function() {
		return this.mySheetTransposition;
	},
	
	setSheetTransposition: function ( iTransposition ) {
		this.mySheetTransposition = iTransposition % 7; // positive and negative -5 ... 5
	},
	
	getClocksHorizontal: function() {
		return this.myClocksHorizontal;
	},
	
	setClocksHorizontal: function ( amount ) {
		this.myClocksHorizontal = amount;
	},
	
	getClocksVertical: function () {
		return this.myClocksVertical;
	},
	
	setClocksVertical: function ( amount ) {
		this.myClocksVertical = amount;
	},
	
	getNoteNameStyle: function () {
		return this.myNoteNameStyle;
	},

	setNoteNameStyle: function ( styleId ) {
	// style id's can be 0 = 4ths, 1 = 5ths and 2 = seconds
		this.myNoteNameStyle = styleId;
	},

	getNoteNameAs: function () {
		return this.myNoteNameAs;
	},

	setNoteNameAs: function ( iNameClass ) {
	// true means note names as pitch classes
		this.myNoteNameAs = iNameClass;
	},

	getNoteNameFontSize: function () {
		return this.myNoteNameFontSize;
	},
	
	setNoteNameFontSize: function ( pixels ) {
		this.myNoteNameFontSize = pixels;
	},
	
	getNoteNameRotation: function () {
		return this.myNoteNameRotation;
	},
	
	setNoteNameRotation: function ( rotation ) {
		this.myNoteNameRotation = rotation;
	},
	
	getNoteNameFontName: function () {
		return this.myNoteNameFontName;
	},

	setNoteNameFontName: function ( fontName ) {
		this.myNoteNameFontName = fontName;
	},
	getNoteNameMargin: function () {
		return this.myNoteNameMargin;
	},
	
	setNoteNameDirection: function( bClockwise ) {
		this.myNoteNameDirection = bClockwise;
	},

	getNoteNameDirection: function () {
		return this.myNoteNameDirection;
	},
	
	setNoteNameFlat: function ( bFlat ) {
		this.myNoteNameFlat = bFlat;
	},
	
	getNoteNameFlat: function () {
		return this.myNoteNameFlat;
	},
	
	setNoteNameMargin: function ( pixels ) {
		this.myNoteNameMargin = pixels;
	},
	
	getClockCanvasSize: function () {
		return this.myClockCanvasSize;
	},
	
	setClockCanvasSize: function ( pixels ) {
		this.myClockCanvasSize = pixels;
		// set the new x and y position of all the current clocks
		// this.initializeClocks ( this.getClocksHorizontal(), this.getClocksVertical() );
	},

    setDisplayPrimeForm: function ( bDisplay ) {
        this.myDisplayPrimeForm = bDisplay;
    },

    getDisplayPrimeForm: function () {
        return this.myDisplayPrimeForm;
    },

    setDisplayForteCode: function ( bDisplay ) {
        this.myDisplayForteCode = bDisplay;
    },

    getDisplayForteCode: function () {
        return this.myDisplayForteCode;
    },

    setDisplayIntervalVector: function ( bDisplay ) {
        this.myDisplayIntervalVector = bDisplay;
    },

    getDisplayIntervalVector: function () {
        return this.myDisplayIntervalVector;
    },

    setDisplayPrimeInversion: function ( bDisplay ) {
        this.myDisplayPrimeInversion = bDisplay;
    },

    getDisplayPrimeInversion: function () {
        return this.myDisplayPrimeInversion;
    },

	setCanvasSize: function ( horizontalClocks, verticalClocks) {
		this.setClocksHorizontal(horizontalClocks);
		this.setClocksVertical(verticalClocks);
		
		// add new clock definitions if necesarry and reset x and y positions of all clocks
		// this.initializeClocks ( horizontalClocks, verticalClocks);
	},
	
	cleanupArrayOfClocks: function (horizontalClocks, verticalClocks ) {
		var currentMembers = this.myClocks.length;
		var newMembers = horizontalClocks * verticalClocks;
		// console.log ("Current # of members: " + currentMembers);
		
		// do we have to cleanup the array?
		if (currentMembers > newMembers) {
			// some cleanup to do
			var itemsToClean = currentMembers - newMembers;
			for(var i=0; i<itemsToClean; i++){
				this.myClocks.pop();
			}
		}
		return this.myClocks.length;
	},
	
	initializeClocks: function ( ) {
		var i = 0;
		
		for (var y=0; y < this.getClocksVertical() ; y++) {
			for (var x=0; x < this.getClocksHorizontal() ; x++) {
				if (typeof(this.myClocks[i]) === "undefined") {
					this.myClocks[i] = {	"id" : 0,
										"name" : 0,
										"xpos" : 0,
										"ypos" : 0,
										"displayRoot": false,
										"rootNoteNumber": 0,
										"hours" : [ {"xpos": 0, "ypos": 0, "midiNoteNumber": 0},
													{"xpos": 0, "ypos": 0, "midiNoteNumber": 0},
													{"xpos": 0, "ypos": 0, "midiNoteNumber": 0},
													{"xpos": 0, "ypos": 0, "midiNoteNumber": 0},
													{"xpos": 0, "ypos": 0, "midiNoteNumber": 0},
													{"xpos": 0, "ypos": 0, "midiNoteNumber": 0},
													{"xpos": 0, "ypos": 0, "midiNoteNumber": 0},
													{"xpos": 0, "ypos": 0, "midiNoteNumber": 0},
													{"xpos": 0, "ypos": 0, "midiNoteNumber": 0},
													{"xpos": 0, "ypos": 0, "midiNoteNumber": 0},
													{"xpos": 0, "ypos": 0, "midiNoteNumber": 0},
													{"xpos": 0, "ypos": 0, "midiNoteNumber": 0}
													],
											"harmonies" : []
										};
				}
				this.myClocks[i].xpos = x * this.getClockCanvasSize();
				this.myClocks[i].ypos = y * this.getClockCanvasSize();
				i++;
			} // end for x
		} // end for y

        this.myCanvasWidth = this.getClocksHorizontal() * this.getClockCanvasSize();
        this.myCanvasHeight = this.getClocksVertical() * this.getClockCanvasSize();

    },

	drawCanvas: function () {
		
		
		this._clearCanvas(); // make "old" canvas blank
		
		// set the new canvas size
		this.setCanvasWidth( this.getClocksHorizontal() * this.getClockCanvasSize() );
		this.setCanvasHeight( this.getClocksVertical() * this.getClockCanvasSize() );
		this.myCanvas.setAttribute("width", this.getCanvasWidth());
		this.myCanvas.setAttribute("height", this.getCanvasHeight());
		
		// initialize clocks
		this.initializeClocks ( this.getClocksHorizontal(), this.getClocksVertical() );
		
		// to display the clock ids, start counting from 0
		this.myToneClockId = 0;
		
		for (var i=0; i < this.myClocks.length; i++) {
			this.drawClock ( this.myClocks[i] );
		}
		this._drawSheetTitle();
	},
	
	_clearCanvas: function () {
		this.myContext.clearRect( 0, 0, this.getCanvasWidth(), this.getCanvasHeight());
	},
	
	getCanvasWidth: function () {
		return this.myCanvasWidth;
	},

	setCanvasWidth: function ( width ) {
		this.myCanvasWidth = width;
	},
	
	getCanvasHeight: function () {
		return this.myCanvasHeight;
	},
	
	setCanvasHeight: function ( height ) {
		this.myCanvasHeight = height;
	},

	getClockSize: function () {
		return this.myClockSize;
	},
	
	setClockSize: function ( pixels ) {
		this.myClockSize = pixels;
	},
	
	setHourSize: function ( pixels ) {
		this.myHourSize = pixels;
	},
	
	getHourSize: function () {
		return (this.myHourSize);
	},

	createCanvasElement: function ( parentElement ) {
	
		this.myCanvas = document.createElement("canvas");
	
		var myToneClockArea = document.getElementById( parentElement);
		myToneClockArea.appendChild(this.myCanvas);
	
		this.myContext = this.myCanvas.getContext("2d");
	},
	
	drawClock: function ( aClock ) {
		this.drawHours( aClock );
		this.drawNoteNames( aClock );
		this._drawClockId( aClock);
		this._drawClockName( aClock );
	},
	
	drawHours: function ( aClock ) {
	
		for (var i = 12; i >= 1; i--){
			this.drawHour( aClock, i );
		}
	},

	drawHour: function ( aClock, hour ) {
		var x = 0;
		var y = 0;
		var radius = 0;
		
		radius = this.getClockSize()/2;
		x = aClock.xpos + this.hourToX( hour, radius );
		y = aClock.ypos + this.hourToY( hour, radius );
		// Store the calculated position to easily draw harmonies and melodies between hours
		aClock.hours[hour-1].xpos = x;
		aClock.hours[hour-1].ypos = y;
		
		radius = this.getHourSize()/2;
		this.drawCircle ( x, y, radius, "#000000" );
	},
	
	drawCircle: function ( x, y, radius, color, bFill ) {
		this.myContext.beginPath();
		this.myContext.arc(x, y, radius, 0, 2*Math.PI);
		this.myContext.lineWidth = 1;
		this.myContext.strokeStyle = color;
		if (bFill) {
			this.myContext.fillStyle = color;
			this.myContext.fill();
		}
		this.myContext.stroke();
	},
	
	_getNoteNameIndex: function () {
		var styleId = this.getNoteNameStyle();
		var iNoteNameIndex = styleId * 2;
		
		if (this.getNoteNameDirection() === false ) {
			iNoteNameIndex = iNoteNameIndex + 1;
		}
		
		if ( this.getNoteNameAs() == 1 ) {           // show names as pitch classes
			iNoteNameIndex = iNoteNameIndex + 12;
		}

        if ( this.getNoteNameAs() == 2 ) {           // show names as harmonica names
            iNoteNameIndex = iNoteNameIndex + 24;
        }

		if (this.getNoteNameFlat() === false) {
			iNoteNameIndex = iNoteNameIndex + 6;
		}

		return iNoteNameIndex;
	},

	drawNoteNames: function ( aClock ) {

		var iNoteNameIndex = this._getNoteNameIndex();

		
		for (var hour = 12; hour >= 1; hour--){
			this.drawNoteName(aClock, hour, iNoteNameIndex);
		}
	},

	drawNoteName: function ( aClock, hour, iNoteNameIndex ) {
		var x = 0;
		var y = 0;
		var radius = 0;
		var noteName = "";
		var midiNoteNumber = 0;
        var horizontalAlign = ""; // left, center, right
        var verticalAlign = ""; // top, middle, bottom
		
		radius = this.getClockSize()/2 + this.getNoteNameMargin();
		x = aClock.xpos + this.hourToX( hour, radius );
		y = aClock.ypos + this.hourToY( hour, radius );
		
		noteName = this._hourToNoteName( hour, iNoteNameIndex );

        switch (hour) {
            case 12:
                horizontalAlign = "center";
                verticalAlign = "bottom";
                break;
            case 6:
                horizontalAlign = "center";
                verticalAlign = "top";
                break;
            case 3:
                horizontalAlign = "left";
                verticalAlign = "middle";
                break;
            case 9:
                horizontalAlign = "right";
                verticalAlign = "middle";
                break;
            case 1:
                horizontalAlign = "left";
                verticalAlign = "bottom";
                break;
            case 2:
                horizontalAlign = "left";
                verticalAlign = "bottom";
                break;
            case 4:
                horizontalAlign = "left";
                verticalAlign = "top";
                break;
            case 5:
                horizontalAlign = "left";
                verticalAlign = "top";
                break;
            case 7:
                horizontalAlign = "right";
                verticalAlign = "top";
                break;
            case 8:
                horizontalAlign = "right";
                verticalAlign = "top";
                break;
            case 10:
                horizontalAlign = "right";
                verticalAlign = "bottom";
                break;
            case 11:
                horizontalAlign = "right";
                verticalAlign = "bottom";
                break;
        }

		this.writeText ( x, y, noteName, this.getNoteNameFontName(), this.getNoteNameFontSize(), horizontalAlign, verticalAlign, "#000000" );

		midiNoteNumber = this.hourToMidiNoteNumber(hour, iNoteNameIndex);
		aClock.hours[hour-1].midiNoteNumber = midiNoteNumber;
	},
	
	_hourToNoteName: function( hour, iNoteNameIndex ) {
		var noteName = "";
		var rotation = this.getNoteNameRotation();
		
		rotation = rotation * -1;
		if (rotation < 0) {
			rotation = rotation + 12;
		}

		var noteId = rotation + hour - 1;
		noteName = this.arrNoteNames[iNoteNameIndex][noteId];
		return noteName;
	},
	
	addHarmony: function ( toneClockId, harmonyId, sColor, bFill, aMidiNotes) {
		var harmony = {"id": 0, "color" : "#ff0000", "midiNotes": [], "primeForm": "", "forteCode": "", "intervalVector": "", "primeInversion": "" };
		harmony.id = harmonyId;
		harmony.color = sColor;
		harmony.fill = bFill;
		harmony.midiNotes = aMidiNotes;

		this._addPitchSetNamesToHarmony(harmony, aMidiNotes);
		this.myClocks[toneClockId].harmonies.push(harmony);
	},

    _addPitchSetNamesToHarmony: function (harmony, aMidiNotes) {
        var oSetFinder = new ToneClockSetFinder();
        oSetFinder.Initialize();
        oSetFinder.FindSet( this._convertMidiNotesToPitchClassArray(aMidiNotes) );

        harmony.intervalVector = oSetFinder.pcIVec;
        harmony.primeForm = oSetFinder.pcForte;
        harmony.forteCode = oSetFinder.pcInv;
        harmony.primeInversion = oSetFinder.pcPrime;

        // console.log (harmony);

    },

    _convertMidiNotesToPitchClassArray:function (aMidiNotes) {
        var pitchClassArray = new Array(12);
        var i = 0;

        // initialize array element
        for ( i = 0; i < 12; i++) {
            pitchClassArray[i] = false;
        }

        for ( i = 0; i < aMidiNotes.length; i++ ) {
            pitchClassArray[aMidiNotes[i]%12] = true;
        }

        return pitchClassArray;
    },
	
	setClockProperties: function ( toneClockId, sToneClockName, bDisplayRoot, iRootNoteNumber ) {
		var aClock = this.myClocks[toneClockId];
		if (typeof(aClock) !== "undefined") {
			aClock.id = toneClockId;
			aClock.name = sToneClockName;
			aClock.displayRoot = bDisplayRoot;
			aClock.rootNoteNumber = iRootNoteNumber;
		}
	},
	
	removeHarmoniesFromSheet: function () {
		var i = 0;
		
		for (var y=0; y < this.getClocksVertical(); y++) {
			for (var x=0; x < this.getClocksHorizontal() ; x++) {
				if (typeof(this.myClocks[i]) !== "undefined") {
					this._removeHarmoniesFromClock(i);
				}
				i++;
			} // end for x
		} // end for y
	},
	
	_removeHarmoniesFromClock: function ( toneClockId) {
		var harmonies = [];
		this.myClocks[toneClockId].harmonies = harmonies;
		this.myClocks[toneClockId].name = "";
		this.myClocks[toneClockId].displayRoot = false;
	},
	
	hourToMidiNoteNumber: function( hour, styleId ) {
		var noteNumber = 0;
		var rotation = this.getNoteNameRotation();
		
		rotation = rotation * -1;
		if (rotation < 0) {
			rotation = rotation + 12;
		}
		var noteId = rotation + hour - 1;
		
		noteNumber = this.arrMidiNoteNumbers[styleId][noteId];
		return noteNumber;
	},
	
	_drawSheetTitle: function () {
		var iCanvasWidth = this.getClocksHorizontal() * this.getClockCanvasSize();
		var sSheetTitle = this.getSheetTitle();
		// var iSheetTitleWidth = sSheetTitle.length * this.getNoteNameFontSize();
		
		var x = iCanvasWidth / 2;
		var y = this.getNoteNameFontSize();
		
		this.writeText(x, y, sSheetTitle, this.getNoteNameFontName(), this.getNoteNameFontSize(), "center", "top", "#000000");
	},
	
	_drawClockName: function ( aClock ) {
		var sClockName = "";
        if (typeof(aClock.name) !== "undefined") {
            sClockName = aClock.name;
            if (sClockName == "0") {
                sClockName = "";
            }
        }

        var iCLockCanvasSize = this.getClockCanvasSize();
        var x = aClock.xpos + iCLockCanvasSize / 2;
        // var y = aClock.ypos + iCLockCanvasSize;
        var y = aClock.hours[6].ypos + (3 * this.getNoteNameFontSize());

        this.writeText(x, y, sClockName, this.getNoteNameFontName(), this.getNoteNameFontSize(), "center", "top", "#000000");

        // does this clock have harmonies, if yes, display the names of the various pitch class sets
        if (typeof(aClock.harmonies[0]) !== "undefined") {
            if (this.myDisplayPrimeForm) {
                var sPrimeForm = "prime form: " + aClock.harmonies[0].primeForm;
                y = y + this.getNoteNameFontSize(); // write on new line
                this.writeText(x, y, sPrimeForm, this.getNoteNameFontName(), this.getNoteNameFontSize(), "center", "top", "#000000");
            }

            if (this.myDisplayForteCode) {
                var sForteCode = "Forte code: " + aClock.harmonies[0].forteCode;
                y = y + this.getNoteNameFontSize(); // write on new line
                this.writeText(x, y, sForteCode, this.getNoteNameFontName(), this.getNoteNameFontSize(), "center", "top", "#000000");
            }

            if (this.myDisplayIntervalVector) {
                var sIntervalVector = "interval vector: " + aClock.harmonies[0].intervalVector;
                y = y + this.getNoteNameFontSize(); // write on new line
                this.writeText(x, y, sIntervalVector, this.getNoteNameFontName(), this.getNoteNameFontSize(), "center", "top", "#000000");
            }

            if (this.myDisplayPrimeInversion) {
                var sPrimeInversion = "prime inversion: " + aClock.harmonies[0].primeInversion;
                y = y + this.getNoteNameFontSize(); // write on new line
                this.writeText(x, y, sPrimeInversion, this.getNoteNameFontName(), this.getNoteNameFontSize(), "center", "top", "#000000");
            }
        }

	},

	_drawClockId: function ( aClock ) {
		var sId = "" + this.myToneClockId;

		this.myToneClockId = this.myToneClockId + 1;
		
		var x = aClock.xpos;
		var y = aClock.ypos;
		var iCenter = this.getClockCanvasSize() / 2;
		var sFontName = this.getNoteNameFontName();
		
				
		x = x + iCenter;
		y = y + iCenter;
		
		this.writeText ( x, y, sId, sFontName, (1.5 * this.getNoteNameFontSize()), "center", "middle", "#8ec89a" );
	},
	
	drawHarmoniesOfClocks: function () {
		this.myToneClockId = 0;
		
		for (var i = 0; i < this.myClocks.length; i++) {
			this._drawHarmonies(i);
		}
	},
	
	_drawHarmonies: function ( iClockIndex ) {
		var aClock = this.myClocks[iClockIndex];
		// draw the root first, if aClock.displayRoot is true
		this._drawRoot(aClock);
		
		var length = aClock.harmonies.length;
		
		if (length > 0) {
			for (var i = 0; i <= (length - 1); i++) {
				this._drawHarmony(aClock, aClock.harmonies[i]);
			}
		}
		
		this._drawClockId( aClock );
	},
	
	_drawHarmony: function ( aClock, aHarmony ) {
		var toX = 0;
		var toY = 0;
		var endX = 0;
		var endY = 0;
		var bFirstFound = false;
		
		this.myContext.beginPath();
		this.myContext.moveTo(endX, endY);
		
		for (var i = 0; i <= 11; i++){
			for (var j = 0; j <= (aHarmony.midiNotes.length - 1); j++) {
				// transpose first
				var transposedNoteNumber = this._transposeMidiNoteNumber( aHarmony.midiNotes[j], this.getSheetTransposition() );
				
				if ( transposedNoteNumber === aClock.hours[i].midiNoteNumber ) {
					toX = aClock.hours[i].xpos;
					toY = aClock.hours[i].ypos;
					if (bFirstFound) {
						this.myContext.lineTo(toX, toY);
						break;
					}
					else {
						this.myContext.moveTo(toX, toY);
						endX = toX;
						endY = toY;
						bFirstFound = true;
						break;
					}

				}
			}
			
		}
		
		this.myContext.lineTo(endX, endY);
		if (aHarmony.fill) {
			this.myContext.fillStyle = aHarmony.color;
			this.myContext.fill();
		}
		this.myContext.lineWidth = 5;
		this.myContext.strokeStyle = aHarmony.color;
		// this.myContext.lineCap = 'round';
		this.myContext.stroke();
		
	},
	
	_drawRoot: function ( aClock ) {
		if (aClock.displayRoot) {
			// transpose the root according to sheetTransposition
			var noteNumber = this._transposeMidiNoteNumber( aClock.rootNoteNumber, this.getSheetTransposition() );
			
			var hourIndex = this.midiNoteNumberToHourIndex(aClock, noteNumber);
			var x = aClock.hours[hourIndex].xpos;
			var y = aClock.hours[hourIndex].ypos;
			var radius = ((this.getHourSize())/2) * 1.4; // 40 percent larger than other clocks
			this.drawCircle( x, y, radius, "#ff0000", true);
		}
	},
	
	_transposeMidiNoteNumber: function (iNoteNumber , iTransposition) {
		var transposedNote = iNoteNumber;
		// anything to transpose?
		if (iTransposition !== 0 ) {
			transposedNote = iNoteNumber + iTransposition;
			// stay within range of 0 .. 11
			if (transposedNote < 0) {
				transposedNote = transposedNote + 12;
			}
			else if (transposedNote > 11) {
				transposedNote = transposedNote - 12;
			}
		}
		return transposedNote;
	},
	
	drawMelody: function ( aClock, aHarmony ) {
		var toX = 0;
		var toY = 0;
		var endX = 0;
		var endY = 0;
		
		var hourIndex = 0;
		var midiNoteNumber = 0;
		
		midiNoteNumber = aHarmony.midiNotes[0];
		hourIndex = this.midiNoteNumberToHourIndex(aClock, midiNoteNumber);
		endX = aClock.hours[hourIndex].xpos;
		endY = aClock.hours[hourIndex].ypos;
		
		this.myContext.beginPath();
		this.myContext.moveTo(endX, endY);
		
		for (var i = 1; i <= (aHarmony.midiNotes.length - 1); i++){
			midiNoteNumber = aHarmony.midiNotes[i];
			hourIndex = this.midiNoteNumberToHourIndex(aClock, midiNoteNumber);
			toX = aClock.hours[hourIndex].xpos;
			toY = aClock.hours[hourIndex].ypos;
			this.myContext.lineTo(toX, toY);
		}
		this.myContext.lineTo(endX, endY);
		this.myContext.lineWidth = 5;
		this.myContext.strokeStyle = "#000000";
		this.myContext.lineCap = "round";
		this.myContext.stroke();
		
	},
	

	midiNoteNumberToHourIndex: function ( aClock, midiNoteNumber ) {
		var index = 0;
		for (var i = 0; i <= 12; i++){
			
			if (aClock.hours[i].midiNoteNumber === midiNoteNumber) {
				index = i;
				break;
			}
		}
		
		return index;
	},
	
	noteNameFont: function () {
		var size = this.getNoteNameFontSize();
		var font = this.getNoteNameFontName();
		
		return size + "px " + font;
	},
	
	writeText: function ( x, y, text, sFontName, iFontSize, sTextAlign, sTextBaseline, color ) {

		this.myContext.font = "" + iFontSize + "px " + sFontName;
		this.myContext.textAlign = sTextAlign;
		this.myContext.textBaseline = sTextBaseline;
		this.myContext.save();
		this.myContext.restore();
		this.myContext.fillStyle = color;
		this.myContext.beginPath();
		this.myContext.fillText( text, x, y);
		this.myContext.stroke();
	},
	
	hourToX: function ( hour, radius ) {
		var centerX = this.getClockCanvasSize()/2;
		var x = 0;
		var radianMultiplier = Math.PI / 180;
		// var radianMultiplier = 180 / Math.PI;
		x = centerX + Math.cos((hour * 30 - 90) * radianMultiplier) * radius;
		return x;
	},
	
	hourToY: function ( hour, radius ) {
		var centerY = (this.getClockCanvasSize()/2);
		var y = 0;
		var radianMultiplier = Math.PI / 180;
		// var radianMultiplier = 180 / Math.PI;
		y = centerY + Math.sin((hour * 30 - 90) * radianMultiplier) * radius;
		return y;
	} // close last function
}; // close ToneClock.prototype

