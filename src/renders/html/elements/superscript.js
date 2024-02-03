import { childrenMap } from "../render";

export default function createSuperscript(obj) {
  const sup = document.createElement("sup");
  sup.innerHTML = childrenMap(obj.children);
  return sup;
}
