<?php
/**
 * Author: Radek Zíka
 * Email: radek.zika@dipcom.cz
 * Created: 22.12.2018
 */

namespace Bajzany\StageJs;

interface IStageJsControl
{

	/**
	 * @return StageJsControl
	 */
	public function create(): StageJsControl;

}
