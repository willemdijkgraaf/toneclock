<?php
require_once "../bootstrap.php";
require "classes/class.ToneClockController.inc";
// getToneClockSheets.php

$oTCC = new ToneClockController();
echo $oTCC->getSheetsAsJSON();
