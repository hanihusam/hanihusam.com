type LayoutSecondaryProps = {
  children: React.ReactNode;
};

function LayoutSecondary({ children }: LayoutSecondaryProps) {
  return (
    <div className="relative flex flex-col overflow-hidden bg-(--surface-secondary) pb-24 md:pb-0">
      {children}
    </div>
  );
}

export default LayoutSecondary;
