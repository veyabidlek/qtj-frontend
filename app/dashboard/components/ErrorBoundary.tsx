"use client";

import { Component, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface Props {
  children: ReactNode;
  fallbackClassName?: string;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={`glass-card flex flex-col items-center justify-center gap-3 p-6 ${this.props.fallbackClassName ?? ""}`}>
          <ExclamationTriangleIcon className="h-8 w-8 text-hud-warning" />
          <p className="text-hud-muted text-sm">Панель недоступна</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => this.setState({ hasError: false })}
            className="border-white/20 text-hud-muted hover:text-white"
          >
            Повторить
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
