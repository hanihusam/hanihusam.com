type LayoutRootProps = {
  children: React.ReactNode;
};

function LayoutRoot({ children }: LayoutRootProps) {
  return (
    <main className="relative flex min-h-screen flex-col overflow-x-hidden bg-light dark:bg-dark">
      {children}
    </main>
  );
}

export default LayoutRoot;
