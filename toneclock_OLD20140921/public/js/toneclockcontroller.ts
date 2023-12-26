/**
 * Created by wimdijkgraaf on 09-06-14.
 */
import jquery = require ('jquery');
import view = require ('toneclockview');

export module ToneClock {
    export class Controller {
        sNAME = "Tone Clock Controller";
        sVERSION = "0.1";
        myJSONObjectURL = null;

        tcc:ToneClock.Controller;
        tc:view.ToneClock.View;
        fCallback:Function;
        myFileReader:FileReader;

        public constructor ( oToneClock ) {
            this.tc = oToneClock;
            this.tcc = this;
        }

        initializeState ( sJSONSource, fCallback) {

            this.fCallback = fCallback;
            $.ajaxSetup({ cache: false });
            $.getJSON("../application/data/" + sJSONSource, $.proxy(this.OnJSONLoaded, this ));

            return true;
        }

        public OnJSONLoaded (items){

            $.ajaxSetup({ cache: true });

            this.initializeToneClockView(items.toneclocksheet, items.toneclocks);

            this.tc.drawSheet();

            if (typeof this.fCallback === "function") {
                this.fCallback();
            }

        }

        public OnLoadEnd (event) {
            var sJSON:string = this.myFileReader.result;
            var json:any = jQuery.parseJSON( sJSON );


            this.initializeToneClockView(json.toneclocksheet, json.toneclocksheet.toneclocks);

            this.tc.drawSheet();

            if (typeof this.fCallback === "function") {
                this.fCallback();
            }
        }

        private initializeToneClockView(toneClockSheet, toneClocks) {

            var toneClockView = this.tc;
            
            toneClockView.setSheetTitle ( toneClockSheet.name );
            toneClockView.setClockCanvasSize ( toneClockSheet.clockcanvassize );
            toneClockView.setClockSize ( toneClockSheet.clocksize );
            toneClockView.setHourSize ( toneClockSheet.hoursize );
            toneClockView.setCanvasSize( toneClockSheet.clockshorizontal, toneClockSheet.clocksvertical );
            toneClockView.setNoteNameStyle ( toneClockSheet.notenamestyle );
            toneClockView.setNoteNameDirection (toneClockSheet.notenamedirection);
            toneClockView.setNoteNameFlat (toneClockSheet.notenameaccidentals);
            toneClockView.setNoteNameMargin ( toneClockSheet.notenamemargin );
            toneClockView.setNoteNameFontSize (toneClockSheet.notenamefontsize);
            toneClockView.setNoteNameFontName (toneClockSheet.notenamefontname);
            toneClockView.setNoteNameRotation( toneClockSheet.notenamerotation );

            this.setPropertiesOfClocks(toneClocks);
        }

        private setPropertiesOfClocks (toneClocks) {
            this.tc.removeHarmoniesFromSheet(); // remove old harmonies
            this.tc.complementArrayOfClocks(); // add clocks if necessary
            if (typeof(toneClocks) === 'object') {
                for (var i = 0; i < toneClocks.length; i++) {
                    this.setPropertiesOfClock(toneClocks[i]);
                    this.setHarmoniesOfClock(toneClocks[i]);
                }
            }
        }

        private setHarmoniesOfClock ( jsonToneClock ) {
            if (typeof(jsonToneClock.harmonies) === 'object') {
                for (var i = 0; i < jsonToneClock.harmonies.length; i++) {
                    // make sure this harmony is not a fake placeholder
                    if (jsonToneClock.harmonies[i].midiNotes.length > 0) {
                        this._addHarmony( jsonToneClock, jsonToneClock.harmonies[i]);
                    }
                }
            }
        }


        private setPropertiesOfClock ( jsonToneClock ) {
            this.tc.setClockProperties(
                jsonToneClock.id,
                jsonToneClock.name,
                jsonToneClock.displayRoot,
                jsonToneClock.rootNoteNumber);
        }

        private _addHarmony ( jsonToneClock, jsonHarmony ) {
            this.tc.addHarmony(
                jsonToneClock.id,
                jsonHarmony.id,
                jsonHarmony.color,
                jsonHarmony.fill,
                jsonHarmony.midiNotes);
        }

        public handleFileSelect(event) {
            var file = event.target.files[0]; // File object

            this.myFileReader = new FileReader();
            this.myFileReader.onloadend = $.proxy(this.OnLoadEnd, this );
            this.myFileReader.readAsText(file);
        }



        public saveSheet() {
            var sheet:string = this.convertCurrentSheetToJSONString();
            var a:HTMLAnchorElement = this.createFileDownloadLink(sheet);

            // click the download link make the download start.
            a.click();
        }

        private convertCurrentSheetToJSONString() {
            var currentSheet = {
                "toneclocksheet": {
                    "id": 1,
                    "name": this.tc.getSheetTitle(),
                    "clockcanvassize": this.tc.getClockCanvasSize(),
                    "clocksize": this.tc.getClockSize(),
                    "hoursize": this.tc.getHourSize(),
                    "clockshorizontal": this.tc.getClocksHorizontal(),
                    "clocksvertical": this.tc.getClocksVertical(),
                    "notenamestyle": this.tc.getNoteNameStyle(),
                    "notenamedirection": this.tc.getNoteNameDirection(),
                    "notenameaccidentals": this.tc.getNoteNameFlat(),
                    "notenamemargin": this.tc.getNoteNameMargin(),
                    "notenamefontsize": this.tc.getNoteNameFontSize(),
                    "notenamefontname": this.tc.getNoteNameFontName(),
                    "notenamerotation": this.tc.getNoteNameRotation(),
                    "toneclocks": this.tc.myClocks
                }
            };

            return  JSON.stringify(currentSheet);
        }

        private createFileDownloadLink (sJSON:string) {
            var blob = new Blob([sJSON], {type: "application/json"});
            var url  = URL.createObjectURL(blob);

            var a:any = document.createElement('a');
            a.id          = "toneclocksheetdownload"
            a.style       = "visibility=hidden;opacity=0;"
            a.download    = "toneclocksheet.json";
            a.href        = url;
            a.textContent = "toneclocksheet.json";

            return a;
        }
    }
}