import { SvelteComponent } from "svelte";
import { Writable } from "svelte/store";
import { writable, get } from "svelte/store";

type ScreenProps = Record<string, any>;
export interface IScreen {
  component?: SvelteComponent | null,
  props?: ScreenProps
}

type Route = string;
export type Screens = Record<Route, IScreen>;

export type BackCallback = () => boolean;

export interface NavigatorOptions {
  screens: Screens,
  defaultScreen?: IScreen
}

export interface Navigator {
  history: Writable<IScreen[]>,
  screen: Writable<IScreen | null>,

  navigate: (screens: Screens) => void,
  back: () => void,

  onBack: Writable<BackCallback>,
}

const defaultScreen: IScreen = {
  component: null,
  props: {}
}

export function makeScreen<T extends IScreen>(config: T): T {
  return {
    ...defaultScreen,
    ...config
  }
}

export function createNavigator(options: NavigatorOptions): Navigator {
  const { screens, defaultScreen = null } = options;

  if (Object.keys(screens).length < 1) {
    throw "Navigator created without screens!";
  }

  const history = writable<IScreen[]>([]);
  const screen = writable<IScreen | null>(defaultScreen);

  function navigate(screens: Screens, route?: Route, props?: ScreenProps) {
    if (!!route) return; // Route was not provided
    const _screen: IScreen = screens?.[route as Route];

    const { props: screenProps = {}, ...rest } = _screen;
    const nextScreen: IScreen = {
      ...rest,
      props: {
        ...screenProps,
        ...(!!props ? props : {})
      }
    };

    screen.set(nextScreen);
    history.update(history => [...history, nextScreen]);
  }

  const onBack = writable<BackCallback>(() => true);
  function back() {
    if (get(history).length < 2) return;

    const callback = get(onBack);
    if (!callback()) return;

    onBack.set(() => true);

    get(history).pop();
    const lastScreen = get(history).pop() as IScreen;

    screen.set(lastScreen);
    history.update(history => [...history, lastScreen]);
  }

  return {
    history,
    screen,

    onBack,

    navigate,
    back,
  }
}