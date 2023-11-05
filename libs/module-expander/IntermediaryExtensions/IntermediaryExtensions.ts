type TClass = new (...args: any[]) => any;

/** метод для хранения .ext модулей */
export class IntermediaryExtensions {
	private registeredExtensions?: WeakMap<TClass, InstanceType<TClass>>;
}
