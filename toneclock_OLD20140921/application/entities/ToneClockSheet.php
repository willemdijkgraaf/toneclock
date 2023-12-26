<?php
// entities/ToneClockSheet.php 
/**
 * @Entity @Table(name="toneclocksheet")
 **/
class ToneClockSheet {
    /** @Id @Column(type="integer") @GeneratedValue **/
    protected $id;
    
    /** @Column(type="string") **/
    protected $name = "";
    
    /** @Column(type="integer") **/
    protected $clockcanvassize= 0;
    
    /** @Column(type="integer") **/
    protected $clocksize= 0;
    
    /** @Column(type="integer") **/
    protected $hoursize = 0;
    
    /** @Column(type="integer") **/
    protected $clockshorizontal = 0;
    
    /** @Column(type="integer") **/
    protected $clocksvertical = 0;
    
    /** @Column(type="integer") **/
    protected $notenamestyle = 0;
    
    /** @Column(type="boolean") **/    
    protected $notenamedirection =  false;
    
    /** @Column(type="boolean") **/
    protected $notenameaccidentals = false;
    
    /** @Column(type="integer") **/
    protected $notenamemargin = 0;
    
    /** @Column(type="integer") **/
    protected $notenamefontsize = 0;
    
    /** @Column(type="string") **/
    protected $notenamefontname = "Arial";
    
    /** @Column(type="integer") **/
    protected $notenamerotation =  0;
    
	public function getId()
	{
		return $this->id;
	}
	
	public function getName()
	{
		return $this->name;
	}
	
	public function setName($name)
	{
		$this->name = $name;
	}
	
	public function getClockCanvasSize()
	{
		return $this->clockcanvassize;
	}
	
	public function setClockCanvasSize($size)
	{
		$this->clockcanvassize = $size;
	}
	
	public function getClockSize()
	{
		return $this->clocksize;
	}
	
	public function setClockSize($size)
	{
		$this->clocksize = $size;
	}
	
	public function getHourSize()
	{
		return $this->hoursize;
	}
	
	public function setHourSize($size)
	{
		$this->hoursize = $size;
	}

	public function getClocksHorizontal()
	{
		return $this->clockshorizontal;
	}
	
	public function setClocksHorizontal($number)
	{
		$this->clockshorizontal = $number;
	}
	
	public function getClocksVertical()
	{
		return $this->clocksvertical;
	}
	
	public function setClocksVertical($number)
	{
		$this->clocksvertical = $number;
	}
	
	public function getNoteNameStyle()
	{
		return $this->notenamestyle;
	}
	
	public function setNoteNameStyle($style)
	{
		$this->notenamestyle = $style;
	}
	
	public function getNoteNameDirection()
	{
		return $this->notenamedirection;
	}
	
	public function setNoteNameDirection($bDirection)
	{
		$this->notenamedirection = $bDirection;
	}
	
	public function getNoteNameAccidentals()
	{
		return $this->notenameaccidentals;
	}
	
	public function setNoteNameAccidentals($bFlat)
	{
		$this->notenameaccidentals = $bFlat;
	}

	public function getNoteNameMargin()
	{
		return $this->notenamemargin;
	}
	
	public function setNoteNameMargin($iSize)
	{
		$this->notenamemargin = $iSize;
	}

	public function getNoteNameFontSize()
	{
		return $this->notenamefontsize;
	}
	
	public function setNoteNameFontSize($iSize)
	{
		$this->notenamefontsize = $iSize;
	}
	
	public function getNoteNameFontName()
	{
		return $this->notenamefontname;
	}
	
	public function setNoteNameFontName($sName)
	{
		$this->notenamefontname = $sName;
	}
	
	public function getNoteNameRotation()
	{
		return $this->notenamerotation;
	}
	
	public function setNoteNameRotation($iAmount)
	{
		$this->notenamerotation = $iAmount;
	}
}