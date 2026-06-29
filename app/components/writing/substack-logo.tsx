export function SubstackLogo({
  width = 21,
  height = 24,
  ...rest
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      role="img"
      width={width}
      height={height}
      viewBox="0 0 21 24"
      fill="#ff6719"
      strokeWidth="1.8"
      stroke="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <g>
        <title></title>
        <path d="M20.9991 5.40625H0V8.24275H20.9991V5.40625Z"></path>
        <path d="M0 10.8125V24.0004L10.4991 18.1107L21 24.0004V10.8125H0Z"></path>
        <path d="M20.9991 0H0V2.83603H20.9991V0Z"></path>
      </g>
    </svg>
  );
}
