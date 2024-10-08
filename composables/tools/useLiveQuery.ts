import { liveQuery } from "dexie";
import type { Ref} from "vue";
import { onUnmounted, ref, watch } from "vue";

interface UseObservableOptions {
  onError?: (err: any) => void;
}

export default function useLiveQuery<T>(
  querier: () => T | Promise<T>,
  deps: Ref<any>[],
  options?: UseObservableOptions,
): Readonly<Ref<T>> {
  const value = ref<T | undefined>();
  const observable = liveQuery<T>(querier);
  let subscription = observable.subscribe({
    next: (val) => {
      value.value = val;
    },
    error: options?.onError,
  });

  watch(deps, () => {
    subscription.unsubscribe();
    subscription = observable.subscribe({
      next: (val) => {
        value.value = val;
      },
      error: options?.onError,
    });
  });

  onUnmounted(() => {
    subscription.unsubscribe();
  });
  return value as Readonly<Ref<T>>;
}
