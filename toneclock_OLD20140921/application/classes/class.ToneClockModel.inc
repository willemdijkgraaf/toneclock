<?php
require __DIR__ . "/../entities/ToneClockSheet.php"; // the class definition for
                                                     // Doctrine
use Doctrine\Common\Cache\ArrayCache;
use Doctrine\Common\Cache\ApcCache;
use Doctrine\ORM\Configuration;
use Doctrine\ORM\EntityManager;

class ToneClockModel
{

    protected $entityManager = null;

    function __construct ()
    {

        // http://docs.doctrine-project.org/en/2.0.x/reference/configuration.html
        $applicationMode = "development";

        if ($applicationMode == "development") {
            $cache = new ArrayCache();
        } else {
            $cache = new ApcCache();
        }

        $config = new Configuration();
        if ($applicationMode == "development") {
            $config->setAutoGenerateProxyClasses(true);
        } else {
            $config->setAutoGenerateProxyClasses(false);
        }

        $config->setProxyDir(__DIR__ . '/../proxies');
        $config->setProxyNamespace('ToneClock\Proxies');

        $driverImpl = $config->newDefaultAnnotationDriver(
                __DIR__ . '/../entities');
        $config->setMetadataDriverImpl($driverImpl);

        $config->setQueryCacheImpl(new ArrayCache());
        $config->setMetadataCacheImpl($cache);

        if ($applicationMode == "development") {
            $config->setAutoGenerateProxyClasses(true);
        } else {
            $config->setAutoGenerateProxyClasses(false);
        }

        /*
         * $params = array( 'driver' => 'pdo_mysql', 'host' => '127.0.0.1',
         * 'dbname' => 'toneclock', 'user' => 'toneclock', 'password' =>
         * 'iEU36czZ', 'port'	 => '3306', 'unix_socket' =>
         * '/var/run/mysqld/mysqld.sock', );
         */

        $params = array(
                'driver' => 'pdo_sqlite',
                'path' => __DIR__ . '/../db.sqlite'
        );

        $this->entityManager = EntityManager::create($params, $config);

        // $schemaTool = new SchemaTool($this->entityManager);

        // $oTemp = new ToneClockSheet();
        // $sName = get_class($oTemp);

        // $classes = array(
        // $this->entityManager->getClassMetadata("ToneClockSheet"),

        // );

        // $schemaTool->dropSchema($classes);
        // $schemaTool->createSchema($classes);
    }

    public function addSheet ($sName, $iClockCanvasSize, $iClockSize, $iHourSize,
            $iClocksHorizontal, $iClocksVertical, $iNoteNameStyle,
            $bNoteNameDirection, $bNoteNameAccidentals, $iNoteNameMargin,
            $iNoteNameFontSize, $sNoteNameFontName, $iNoteNameRotation)
    {
        $oSheet = new ToneClockSheet();
        $oSheet->setName($sName);
        $oSheet->setClockCanvasSize($iClockCanvasSize);
        $oSheet->setClockSize($iClockSize);
        $oSheet->setHourSize($iHourSize);
        $oSheet->setClocksHorizontal($iClocksHorizontal);
        $oSheet->setClocksVertical($iClocksVertical);
        $oSheet->setNoteNameStyle($iNoteNameStyle);
        $oSheet->setNoteNameDirection($bNoteNameDirection);
        $oSheet->setNoteNameAccidentals($bNoteNameAccidentals);
        $oSheet->setNoteNameMargin($iNoteNameMargin);
        $oSheet->setNoteNameFontSize($iNoteNameFontSize);
        $oSheet->setNoteNameFontName($sNoteNameFontName);
        $oSheet->setNoteNameRotation($iNoteNameRotation);

        $this->entityManager->persist($oSheet);
        $this->entityManager->flush();
    }

    public function getToneClockSheets ()
    {
        $sheetId = 0;

        $sheetsRepository = $this->entityManager->getRepository(
                'ToneClockSheet');
		$toneclocksheets = $sheetsRepository->findAll();

		return $toneclocksheets;
	}


}