"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: string;
}

export class NotionErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: "" };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error: error.message };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-600 dark:text-red-400">
          <p className="font-medium mb-1">일부 콘텐츠를 렌더링할 수 없습니다</p>
          <p className="text-xs opacity-70">{this.state.error}</p>
        </div>
      );
    }
    return this.props.children;
  }
}
