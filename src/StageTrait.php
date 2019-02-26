<?php

/**
 * Author: Radek Zíka
 * Email: radek.zika@alistra.cz
 */

namespace Bajzany\StageJs;

/**
 * Trait StageTrait
 */
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

	public function ajaxStageJS()
	{
		if ($this->isAjax()) {
			if (!empty($this->notifications->getNotifications())) {
				$this->redrawControl('notify');
			}
			$this->redrawControl('modal-Area');
		}
	}

}
