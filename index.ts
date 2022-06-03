import type { SvelteComponent } from "svelte";
import type { Writable } from "svelte/store";
import { writable, get } from "svelte/store";

type ScreenProps = Record<string, any>;
export interface IScreen {
  [key: string]: any;
  component?: typeof SvelteComponent | null;
  props?: ScreenProps;
}

const defaultScreen: IScreen = {
  component: null,
  props: {},
};

/**
 * Creates screen object that is compatible with the navigator
 * @param configOrScreen Accepts custom screen config or svelte component
 * @returns screen
 */
function makeScreen<T extends IScreen>(
  configOrScreen: T | IScreen
): T | IScreen {
  // If screen component is passed (most likely function) create IScreen out of that
  // @since 0.0.5
  if (typeof configOrScreen === "function") {
    configOrScreen = { component: configOrScreen } as IScreen;
  }

  return {
    ...defaultScreen,
    ...configOrScreen,
  };
}

type Route = string;
export type Screens = Record<Route, IScreen>;

export interface NavigatorOptions {
  screens: Screens;
  initialScreen?: Route | IScreen;
}

export type BackCallback = () => boolean;
export interface INavigator {
  history: Writable<IScreen[]>;
  screen: Writable<IScreen | null>;

  navigate: (route: Route, props?: ScreenProps) => void;
  back: () => void;

  onNavigate: Writable<() => void>;
  onBack: Writable<BackCallback>;
}

/**
 * Creates navigator which manages the screens
 * @param options Navigation options
 * @returns {INavigator}
 */
function createNavigator(options: NavigatorOptions): INavigator {
  const { screens = {}, initialScreen = null } = options || {};

  if (Object.keys(screens).length < 1) {
    throw "Navigator was created without options or screens!";
  }

  let _initialScreen: IScreen;
  if (typeof initialScreen === "string")
    _initialScreen = screens?.[initialScreen];
  else _initialScreen = initialScreen;

  const history = writable<IScreen[]>(_initialScreen ? [_initialScreen] : []);
  const screen = writable<IScreen | null>(_initialScreen);

  const onNavigate = writable<() => void>(() => {});
  const onBack = writable<BackCallback>(() => true);

  function navigate(route?: Route, props?: ScreenProps) {
    if (!route) return; // Route was not provided
    const _screen: IScreen = screens?.[route as Route];

    if (!_screen) {
      console.warn("Navigated to unknown screen - " + route);
      return;
    }

    const { props: screenProps = {} } = _screen;
    const nextScreen: IScreen = Object.assign({}, _screen);
    nextScreen.props = {
      ...screenProps,
      ...(!!props ? props : {}),
    };

    onBack.set(() => true);
    screen.set(nextScreen);
    history.update((history) => [...history, nextScreen]);

    const $onNavigate = get(onNavigate);
    $onNavigate?.();
  }

  function back() {
    if (get(history).length < 2) return;

    const $onBack = get(onBack);
    if (!$onBack()) return;

    onBack.set(() => true);

    get(history).pop();
    const lastScreen = get(history).pop() as IScreen;

    screen.set(lastScreen);
    history.update((history) => [...history, lastScreen]);
  }

  return {
    history,
    screen,

    onNavigate,
    onBack,

    navigate,
    back,
  };
}

export { makeScreen, createNavigator };
