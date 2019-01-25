<?php

/**
 * Author: Radek Zíka
 * Email: radek.zika@alistra.cz
 */

namespace Bajzany\StageJs\DI;

use Bajzany\StageJs\IStageJsControl;
use Bajzany\StageJs\StageJs;
use Nette\Configurator;
use Nette\DI\Compiler;
use Nette\DI\CompilerExtension;
use Nette\Application\Application;

class StageJsExtension extends CompilerExtension
{

	public function loadConfiguration()
	{
		$builder = $this->getContainerBuilder();

		$builder->addDefinition($this->prefix('stageJs'))
			->setFactory(StageJs::class, ['defaultValues' => $this->config])
			->setInject(TRUE);

		$builder->addDefinition($this->prefix('modal'))
			->setImplement(IStageJsControl::class)
			->setInject(TRUE);
	}

	public function beforeCompile()
	{
		$builder = $this->getContainerBuilder();
		$application = $builder->getDefinitionByType(Application::class);
		$stageJs = $builder->getDefinitionByType(StageJs::class);
		$application->addSetup('?->initialSets(?)', [$stageJs, $application]);
	}

	/**
	 * @param Configurator $configurator
	 */
	public static function register(Configurator $configurator)
	{
		$configurator->onCompile[] = function ($config, Compiler $compiler) {
			$compiler->addExtension('stageJs', new StageJsExtension());
		};
	}

}
