import { Grid } from "@/components/grid";
import { Header } from "@/components/header";
import { Spacer } from "@/components/spacer";
import { type InjectedMeta, type ProjectFrontmatter } from "@/types";
import { clsxm } from "@/utils/clsxm";

import { ProjectCard } from "../projects/project-card";

type Posts = ProjectFrontmatter & InjectedMeta;

type ProjectSectionProps = {
  title: string;
  subTitle: string;
  cta: string;
  posts: Posts[];
};

const projects = [
  {
    slug: "curious",
    publishedAt: "2024-01-01",
    bannerCloudinaryId:
      "bapak2.dev/blog/tumblr_inline_p4orlrNmPl1r3k5t4_640_zzzepb",
    title: "Curious",
    description:
      "An anonymous social media where you can share your thoughts and connect with others. Explore nearby and connect with people around you.",
    techs: "tailwindcss, react-router, apollo-client",
    github: undefined,
    link: "https://app.curious.com",
  },
  {
    slug: "curious-admin",
    publishedAt: "2024-01-01",
    bannerCloudinaryId:
      "bapak2.dev/blog/tumblr_inline_p4orlrNmPl1r3k5t4_640_zzzepb",
    title: "Curious Admin",
    description:
      "A streamlined dashboard for managing users and content while analyzing trends in Curious. This tool offers an intuitive interface for admins to maintain a safe and engaging environment.",
    techs: "tailwindcss, react-router, apollo-client",
    github: undefined,
    link: "https://admin.curious.com",
  },
  {
    slug: "depas-infection-ugm",
    publishedAt: "2024-01-01",
    bannerCloudinaryId:
      "bapak2.dev/blog/tumblr_inline_p4orlrNmPl1r3k5t4_640_zzzepb",
    title: "Depa's Infection",
    description:
      "This website serves as the information hub for Depa's Infection event by Fakultas Kedokteran Gigi Universitas Gajah Mada and connects to related systems.",
    techs: "react-bootstrap, react-router, redux",
    github: undefined,
    link: "https://depasinfection.com",
  },
];

export function ProjectSection({
  title,
  subTitle,
  cta,
  posts,
}: ProjectSectionProps) {
  return (
    <>
      <Header title={title} subTitle={subTitle} cta={cta} ctaUrl="/writing" />
      <Spacer size="lg" />
      <Grid className="gap-6">
        {projects.map((project, idx) => (
          <ProjectCard
            key={project.slug}
            className={clsxm("col-span-full", {
              "lg:flex-row-reverse": idx % 2 === 0,
              "hidden lg:flex": idx >= 2,
            })}
            project={project}
          />
        ))}
      </Grid>
    </>
  );
}
