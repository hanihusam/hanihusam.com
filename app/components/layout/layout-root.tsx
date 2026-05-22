type LayoutRootProps = {
  children: React.ReactNode;
};

function LayoutRoot({ children }: LayoutRootProps) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-(--surface-primary) pb-24 md:pb-0">
      {children}
    </div>
  );
}

export default LayoutRoot;
