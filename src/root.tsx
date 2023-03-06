// @refresh reload
import "./root.css";
import { Suspense } from "solid-js";
import { Body, ErrorBoundary, FileRoutes, Head, Html, Meta, Routes, Scripts, Title, Link } from "solid-start";

export default function Root() {
  return (
    <Html lang="en" class="box-border bg-neutral-100 text-neutral-700">
      {/* h-full */}
      <Head>
        <Title>Create JD App</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta name="theme-color" content="#026d56" />
        <Meta name="description" content="Generated by create-jd-app" />
        <Link rel="icon" href="/favicon.ico" />
      </Head>
      <Body>
        {/* h-full*/}
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
