type LayoutRootProps = {
  children: React.ReactNode;
};

function LayoutRoot({ children }: LayoutRootProps) {
  return (
    <main className="relative flex min-h-screen flex-col overflow-x-hidden">
      {children}
    </main>
  );
}

export default LayoutRoot;
