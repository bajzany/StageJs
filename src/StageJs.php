<?php

/**
 * Author: Radek Zíka
 * Email: radek.zika@alistra.cz
 */

namespace Bajzany\StageJs;

use Chomenko\AppWebLoader\AppWebLoader;
use Nette\Application\Application;

class StageJs
{

	/**
	 * @var array
	 */
	private $asserts = [
		__DIR__ . '/Asserts/Stage.js',
		__DIR__ . '/Asserts/Ajax.js',
		__DIR__ . '/Asserts/Components/Form.js',
		__DIR__ . '/Asserts/Extensions/Application.js',
	];

	/**
	 * @var array
	 */
	private $styles = [
		__DIR__ . '/Styles/ajaxLoader.css',
	];

	/**
	 * @var array
	 */
	private $stagingData = [];

	/**
	 * @var AppWebLoader
	 */
	private $webloader;

	/**
	 * @param AppWebLoader $appWebLoader
	 * @param array $defaultValues
	 */
	public function __construct(AppWebLoader $appWebLoader, array $defaultValues = [])
	{
		$this->stagingData = $defaultValues;
		$this->webloader = $appWebLoader;
	}

	/**
	 * @param Application $application
	 * @throws \Chomenko\AppWebLoader\Exceptions\AppWebLoaderException
	 * @throws \ReflectionException
	 */
	public function initialSets(Application $application)
	{
		$collection = $this->webloader->createCollection("stageJs");
		foreach ($this->asserts as $file) {
			$collection->addScript($file);
		}

		$collection = $this->webloader->createCollection("stageStyle");
		foreach ($this->styles as $file) {
			$collection->addStyles($file);
		}
	}

	/**
	 * @return array
	 */
	public function getStagingData(): array
	{
		return $this->stagingData;
	}

	/**
	 * @param string $key
	 * @param mixed $value
	 */
	public function addStagingData(string $key, $value)
	{
		$this->stagingData[$key] = $value;
	}

}
