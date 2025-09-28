declare module '@/components/themed-view' {
  import { ViewProps } from 'react-native';
  export type ThemedViewProps = ViewProps & {
    lightColor?: string;
    darkColor?: string;
  };
  export function ThemedView(props: ThemedViewProps): JSX.Element;
}

// Fallback: allow any other @/* imports to exist without errors (helps editors)
declare module '@/*';
