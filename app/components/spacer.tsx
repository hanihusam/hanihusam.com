const spacerSizes = {
  sm: "h-6 lg:h-8",
  md: "h-10 lg:h-12",
  lg: "h-16 lg:h-20",
};

function Spacer({
  size,
  className = "",
}: {
  size: keyof typeof spacerSizes;
  className?: string;
}) {
  return <div className={`${className} ${spacerSizes[size]}`} />;
}

export { Spacer };
