import { Grid } from "@/components/grid";
import { IconLink } from "@/components/icon-link";
import { DribbbleIcon, GithubIcon, LinkedinIcon } from "@/components/icons";
import { H1, H2, H4, Paragraph } from "@/components/typography";
import { ButtonLink } from "@/components/ui/button";
import { externalLinks } from "@/external-links";
import { getImageBuilder, getImgProps } from "@/utils/images";

export function HeroSection() {
  return (
    <Grid className="mb-24 h-auto pt-24 lg:min-h-[40rem] xl:mb-0">
      <div className="hidden gap-16 lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:flex lg:flex-col">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col">
            <H4 className="text-primary-500">Hi, I am</H4>
            <H1 className="text-secondary-500 dark:text-light">Han</H1>
          </div>

          <div className="bg-primary-500 h-2 w-20" />
        </div>

        <div className="flex items-start space-x-6">
          <IconLink
            aria-label="Link to Linkedin profile"
            href={externalLinks.linkedin}
          >
            <LinkedinIcon className="text-secondary-500 dark:text-light" />
          </IconLink>
          <IconLink
            aria-label="Link to Github repository"
            href={externalLinks.github}
          >
            <GithubIcon className="text-secondary-500 dark:text-light" />
          </IconLink>
          <IconLink
            aria-label="Link to Dribbble profile"
            href={externalLinks.dribbble}
          >
            <DribbbleIcon className="text-secondary-500 dark:text-light" />
          </IconLink>
        </div>
      </div>

      <img
        className="col-span-full hidden lg:col-span-6 lg:col-start-3 lg:block"
        {...getImgProps(
          getImageBuilder(
            "bapak2.dev/images/avatar-hani_ivyixv",
            "Avatar of Han large",
          ),
          {
            widths: [560, 840, 1100, 1650, 2500, 2100, 3100],
            sizes: [
              "(max-width:1023px) 80vw",
              "(min-width:1024px) and (max-width:1620px) 67vw",
              "1100px",
            ],
          },
        )}
      />
      <img
        className="col-span-full mx-auto mb-12 block lg:hidden"
        {...getImgProps(
          getImageBuilder(
            "bapak2.dev/images/avatar-memoji_phntzo",
            "Avatar of Han small",
          ),
          {
            widths: [312, 560],
            sizes: [
              "(max-width:1023px) 80vw",
              "(min-width:1024px) and (max-width:1620px) 67vw",
              "1100px",
            ],
          },
        )}
      />

      <div className="col-span-full flex flex-col gap-8 self-stretch lg:col-span-4 lg:col-start-9">
        <div className="flex flex-col gap-4">
          <H4 className="text-primary-500 block md:hidden">
            Hi{" "}
            <span aria-labelledby="hi emoji" role="img">
              👋
            </span>
            , I am Han
          </H4>
          <H2 className="text-secondary-500 dark:text-light">
            UI Engineer based on Yogyakarta, Indonesia
          </H2>
        </div>

        <Paragraph>
          I am a multi-disciplinary Frontend Developer and UI Designer who have
          experience creating projects in a various industry and have worked
          with diverse clients from all over the world. I merge technical and
          design skills to create innovative product with beautiful and
          functional user experiences.
        </Paragraph>

        <div className="flex space-x-2">
          <ButtonLink to="links">Reach Me</ButtonLink>
          <ButtonLink href="https://cv.hanihusam.com" variant="ghost">
            See CV
          </ButtonLink>
        </div>
      </div>
    </Grid>
  );
}
