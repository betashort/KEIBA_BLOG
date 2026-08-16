import { renderToString } from "react-dom/server";
import { HelmetProvider, type HelmetServerState } from "react-helmet-async";
import { StaticRouter } from "react-router-dom";
import App from "./App.tsx";
import { hoistHelmetTags } from "./utils/prerenderHtml";

export interface RenderResult {
  html: string;
  head: string;
}

function helmetToHead(helmet: HelmetServerState | undefined): string {
  if (!helmet) return "";
  return [
    helmet.title.toString(),
    helmet.priority.toString(),
    helmet.meta.toString(),
    helmet.link.toString(),
    helmet.script.toString(),
  ].join("");
}

export function render(url: string): RenderResult {
  const helmetContext: { helmet?: HelmetServerState } = {};
  const rawHtml = renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </HelmetProvider>,
  );

  const hoisted = hoistHelmetTags(rawHtml);
  const fromContext = helmetToHead(helmetContext.helmet).trim();
  return {
    html: hoisted.html,
    head: fromContext || hoisted.head,
  };
}
