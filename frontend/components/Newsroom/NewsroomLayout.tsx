// Layout shim: with the GlobalShell active site-wide, this component becomes a simple wrapper that
// renders its children inside the main column. Keeps signatures stable for newsroom pages.
import { useShell } from './ShellContext';

export default function NewsroomLayout({ children }: { active?: string; children: React.ReactNode }) {
  const shell = useShell();
  return shell?.hasShell ? <div className="p-6">{children}</div> : <div className="max-w-5xl mx-auto p-6">{children}</div>;
}
