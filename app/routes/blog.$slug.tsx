import { type Route } from "./+types/blog.$slug";

import { redirect } from "react-router";

export const loader = ({ params }: Route.LoaderArgs) =>
  redirect(`/writing/${params.slug}`, 301);
