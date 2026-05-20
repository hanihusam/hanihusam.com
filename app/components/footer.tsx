import { AnchorOrLink } from "./links/anchor-or-link";
import Logo from "./ui/logo";
import { Grid } from "./grid";
import { Paragraph, Text } from "./typography";

const contacts = [
  {
    label: "About",
    to: "/about",
  },
  {
    label: "Mail",
    href: "mailto:me@hanihusam.com",
  },
  {
    label: "GitHub",
    href: "https://github.com/hanihusam",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/hanihusam/",
  },
];

export function Footer() {
  return (
    <Grid as="footer" className="bottom-18 gap-8 md:bottom-0">
      <div className="col-span-full mx-auto flex flex-col items-center gap-y-4 md:pb-12">
        <Logo className="w-8" />
        <div className="flex items-center space-x-4">
          {contacts.map((contact) => (
            <AnchorOrLink
              key={contact.label}
              to={contact.to}
              href={contact.href}
            >
              <Paragraph>{contact.label}</Paragraph>
            </AnchorOrLink>
          ))}
        </div>
      </div>
      <div className="col-span-full mb-8 flex flex-row justify-between">
        <Text variant="label">Keep calm and stay humble.</Text>
        <Text variant="label">{`© ${new Date().getFullYear()}`}</Text>
      </div>
    </Grid>
  );
}
