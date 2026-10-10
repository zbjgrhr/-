"use client";

import { Component, type ReactNode } from "react";
import Link from "next/link";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="explore-page">
          <h1>出了点问题。</h1>
          <p>音游暂时无法加载，你可以返回作品集地图。</p>
          <Link className="btn-primary" href="/">
            返回地图
          </Link>
        </main>
      );
    }
    return this.props.children;
  }
}
