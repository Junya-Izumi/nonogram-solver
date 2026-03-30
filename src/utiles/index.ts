export const qs = (selector: string, parent:Document|HTMLElement = document): Element | null => parent.querySelector<HTMLElement>(selector);
export const qsAll = (selector: string, parent:Document|HTMLElement = document): NodeListOf<HTMLElement> | null => parent.querySelectorAll<HTMLElement>(selector);
