import { H2, H3, H5, H6, Paragraph } from "@/components/typography";

import { ComputerDesktopIcon, PaintBrushIcon } from "@heroicons/react/24/solid";

export function ServicesSection() {
  return (
    <div className="flex items-start py-12 px-6 md:flex-row md:px-[5vw]">
      <div className="flex w-full flex-col gap-8 md:flex-row md:justify-between">
        <div className="flex w-[380px] flex-col space-y-8 md:w-[475px]">
          <div className="flex flex-col space-y-2 self-stretch">
            <H6 className="text-primary-500">Service</H6>
            <H2 className="text-secondary-500 dark:text-light">
              Best solution to boost your project and business
            </H2>
          </div>

          <div className="flex flex-col space-y-2 self-stretch">
            <Paragraph>
              Are you a professional who needs an attractive website for your
              business or service? Does your current website looks like it
              &quot;old-fashioned&quot;? Is it not mobile responsive? It
              doesn&apos;t have a modern look and optimal user experience across
              various devices, and browsers?
            </Paragraph>
            <H5 className="text-dark dark:text-light">
              Well, you&apos;re in the right place.
            </H5>
          </div>
        </div>

        <div className="flex flex-col gap-8 md:flex-row md:gap-10">
          <div className="flex flex-col gap-8 md:flex-row">
            <div className="relative flex h-[392px] w-[280px] items-end">
              <ComputerDesktopIcon className="absolute left-8 top-0 h-20 w-20 text-secondary-500 dark:text-primary-500" />
              <div className="flex flex-col space-y-2.5 rounded-xl bg-white px-8 pb-8 pt-16 dark:bg-black">
                <div className="flex flex-col space-y-6 self-stretch">
                  <H3 className="text-secondary-500">Frontend Web Developer</H3>
                  <Paragraph>
                    Good communication, details in the code and verbose
                    documentation. I guaranteed free session until you can run
                    my code on your system.
                  </Paragraph>
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex h-[392px] w-[280px] items-end">
            <PaintBrushIcon className="absolute left-8 top-0 h-20 w-20 text-secondary-500 dark:text-primary-500" />
            <div className="flex flex-col space-y-2.5 rounded-xl bg-white px-8 pb-8 pt-16 dark:bg-black">
              <div className="flex flex-col space-y-6 self-stretch">
                <H3 className="text-secondary-500">User Interface Designer</H3>
                <Paragraph>
                  I look at every UI design project as a process in solving a
                  problem. I am considering all the aspects until the UI design
                  is “work”.
                </Paragraph>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
