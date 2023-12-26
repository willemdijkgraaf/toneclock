<?php
use H57\Util\Serializor;
require "class.serializer.inc";
require "class.ToneClockModel.inc";

class ToneClockController
{

    protected $oTCM;

    function __construct ()
    {
        $this->oTCM = new ToneClockModel();
    }

    public function getSheets ()
    {
        $aSheets = $this->oTCM->getToneClockSheets();

        return $aSheets;
    }

    public function getSheetsAsJSON ()
    {
        $object = $this->getSheets();
        $oSerializor = new Serializor();
        $whitelist = array(
                "ToneClockSheet" => array(
                        "id",
                        "name",
                        "clockcanvassize",
                        "clocksize",
                        "hoursize",
                        "clockshorizontal",
                        "clocksvertical",
                        "notenamestyle",
                        "notenamedirection",
                        "notenameaccidentals",
                        "notenamemargin",
                        "notenamefontsize",
                        "notenamefontname",
                        "notenamerotation"
                )
        );
        $blacklist = array(
                "ToneClockSheet" => array()
        );

        $json = $oSerializor->json_encode($object, 0, $whitelist, $blacklist);

        return $json;
    }
}