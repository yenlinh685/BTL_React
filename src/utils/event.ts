export const sendEvent = (name: string, detail?: any) => {
  document.dispatchEvent(new CustomEvent(name, { detail }));
};

export const listenEvent = (
  name: string,
  handler: ({ detail }: { detail?: any }) => void,
  context: any = document,
) => {
  context.addEventListener(name, handler);
  return () => context.removeEventListener(name, handler);
};
