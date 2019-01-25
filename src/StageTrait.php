<?php

/**
 * Author: Radek Zíka
 * Email: radek.zika@alistra.cz
 */

namespace Bajzany\StageJs;

trait StageTrait
{

	/**
	 * @var IStageJsControl @inject
	 */
	public $stageControl;

	/**
	 * @return \Bajzany\StageJs\StageJsControl
	 */
	public function createComponentStageJs()
	{
		return $this->stageControl->create();
	}

}
