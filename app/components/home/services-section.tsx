import { Grid } from "@/components/grid";
import { H2, H3, H5, H6, Paragraph } from "@/components/typography";

import { ComputerDesktopIcon, PaintBrushIcon } from "@heroicons/react/24/solid";

export function ServicesSection() {
  return (
    <Grid>
      <div className="col-span-full row-start-1 flex flex-col space-y-8 lg:col-span-6 lg:col-start-1">
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

      <div className="col-span-full grid grid-cols-6 gap-8 md:gap-10 lg:col-span-6 lg:col-start-7">
        <div className="relative col-span-full lg:col-span-3">
          <ComputerDesktopIcon className="absolute left-8 top-0 h-20 w-20 text-secondary-500 dark:text-primary-500" />
          <div className="flex flex-col space-y-2.5 rounded-xl bg-white px-8 pb-8 pt-16 dark:bg-black">
            <div className="flex flex-col space-y-6 self-stretch">
              <H3 className="text-secondary-500">Frontend Web Developer</H3>
              <Paragraph>
                Good communication, details in the code and verbose
                documentation. I guaranteed free session until you can run my
                code on your system.
              </Paragraph>
            </div>
          </div>
        </div>

        <div className="relative col-span-full lg:col-span-3">
          <PaintBrushIcon className="absolute left-8 top-0 h-20 w-20 text-secondary-500 dark:text-primary-500" />
          <div className="flex flex-col space-y-2.5 rounded-xl bg-white px-8 pb-8 pt-16 dark:bg-black">
            <div className="flex flex-col space-y-6 self-stretch">
              <H3 className="text-secondary-500">User Interface Designer</H3>
              <Paragraph>
                I look at every UI design project as a process in solving a
                problem. I am considering all the aspects until the UI design is
                “work”.
              </Paragraph>
            </div>
          </div>
        </div>
      </div>
    </Grid>
  );
}
