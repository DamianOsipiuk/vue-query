export function flushPromises(timeout = 0): Promise<unknown> {
  return new Promise(function (resolve) {
    setTimeout(resolve, timeout);
  });
}

export function simpleFetcher(): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      return resolve("Some data");
    }, 0);
  });
}

export function rejectFetcher(): Promise<Error> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      return reject(new Error("Some error"));
    }, 0);
  });
}

export function noop(): undefined {
  return undefined;
}
