type LayoutRootProps = {
  children: React.ReactNode;
};

function LayoutRoot({ children }: LayoutRootProps) {
  return (
    <div className="bg-light dark:bg-dark relative flex min-h-screen flex-col">
      {children}
    </div>
  );
}

export default LayoutRoot;
