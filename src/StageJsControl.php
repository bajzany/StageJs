<?php
/**
 * Author: Radek Zíka
 * Email: radek.zika@dipcom.cz
 * Created: 22.12.2018
 */

namespace Bajzany\StageJs;

use Nette\Application\Helpers;
use Nette\Application\UI\Control;

class StageJsControl extends Control
{

	/**
	 * @var StageJs @inject
	 */
	public $stageJs;

	public function render()
	{
		$this->createStageControl();
		$this->template->setFile(__DIR__ . '/template/js.latte');
		$this->template->stagingData = $this->getStageJs()->getStagingData();
		$this->template->render();
	}

	public function createStageControl()
	{
		list($module, $presenter) = Helpers::splitName($this->getPresenter()->getName());
		$this->stageJs->addStagingData('@application', [
			'module' => $module,
			'control' => $presenter,
			'action' => $this->getPresenter()->getAction(),
		]);
	}

	/**
	 * @return StageJs
	 */
	public function getStageJs(): StageJs
	{
		return $this->stageJs;
	}

}
