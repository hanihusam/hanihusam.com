type LayoutRootProps = {
  children: React.ReactNode;
};

function LayoutRoot({ children }: LayoutRootProps) {
  return (
    <div className="bg-light dark:bg-dark relative flex min-h-screen flex-col pb-24 md:pb-0">
      {children}
    </div>
  );
}

export default LayoutRoot;
