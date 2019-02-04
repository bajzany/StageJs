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

	protected function afterRender()
	{
		parent::afterRender();

		if ($this->isAjax()) {
			if (!empty($this->notifications->getNotifications())) {
				$this->redrawControl('notitify');
			}

			$this->redrawControl('modal-Area');
		}

		if (!empty((array)$this->payload)) {
			$this->sendPayload();
		}
	}

}
