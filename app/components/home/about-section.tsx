import { AboutIllustration } from "@/assets/illustrations";
import { H2, H6, Paragraph } from "@/components/typography";

export function AboutSection() {
  return (
    <div className="mt-8 flex self-stretch md:mt-0 md:px-[5vw]">
      <div className="flex w-full flex-col items-center space-y-6 self-stretch rounded-xl bg-black px-6 py-[72px] md:flex-row md:justify-between md:px-10">
        <AboutIllustration className="w-[375px] md:w-[500px]" />

        <div className="flex max-w-[475px] flex-col items-start space-y-8 self-stretch">
          <div className="flex flex-col space-y-2 self-stretch">
            <H6 className="text-primary-500">About</H6>
            <H2 className="text-light">Why hire me for your next project?</H2>
          </div>

          <div className="flex flex-col gap-1.5">
            <Paragraph className="text-base">
              I worked with a various background of client and different type of
              product as a software engineer (frontend) or UI designer. I help
              them to solve their business problem on the technology end.
            </Paragraph>
            <Paragraph className="text-base">
              I have a principle that is &quot;stay simple and stay
              humble&quot;. I believe, simplicity hides a great deal of
              complexity and thoroughness. I see every project as a process of
              solving a problem. Now it&apos;s time to solve your problems in
              detail, in depth, and of course with simplicity.
            </Paragraph>
          </div>
        </div>
      </div>
    </div>
  );
}
