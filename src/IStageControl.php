<?php

/**
 * Author: Radek Zíka
 * Email: radek.zika@alistra.cz
 */

namespace Bajzany\StageJs;

use Nette\Application\UI\Presenter;

interface IStageControl
{

	/**
	 * @param Presenter $presenter
	 * @param StageJs $stageJs
	 * @return void
	 */
	public function createStageControl(Presenter $presenter, StageJs $stageJs);

}
