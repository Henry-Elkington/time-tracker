// @refresh reload
import "./root.css";
import { Suspense } from "solid-js";
import { Body, ErrorBoundary, FileRoutes, Head, Html, Meta, Routes, Scripts, Title, Link } from "solid-start";

export default function Root() {
  return (
    <Html lang="en" class="box-border h-full bg-white text-neutral-600">
      <Head>
        <Title>Create JD App</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta name="theme-color" content="#ffffff" />
        <Meta name="description" content="made by henry" />

        <Meta name="apple-mobile-web-app-capable" content="yes" />
        <Meta name="apple-mobile-web-app-status-bar-style" content="white" />
        <Meta name="apple-mobile-web-app-title" content="Notentool" />
        <Link rel="manifest" href="/meta/manifest.json" />

        <Link rel="icon" href="/meta/favicon.png" />
      </Head>
      <Body class="">
        <Suspense>
          <ErrorBoundary>
            <Routes>
              <FileRoutes />
            </Routes>
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  );
}
