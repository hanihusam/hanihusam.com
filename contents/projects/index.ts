type Project = {
  name: string;
  description: string;
  link: {
    href: string;
    label: string;
  };
  cover: string;
  tags: string[];
};

export default [
  {
    name: "Depa's Infection",
    description:
      "A Science Festival and Research Competition events held by Denta Paramitha, a study club from the Faculty of Dentistry, Universitas Gadjah Mada.",
    link: { href: "https://depasinfection.com", label: "depasinfection.com" },
    cover: "pejuangKodeLogo",
    tags: ["web development", "frontend"],
  },
  {
    name: "Kelas Rumah Berbagi",
    description: "An online course platform for parents.",
    link: {
      href: "https://kelas.rumahberbagi.com",
      label: "kelas.rumahberbagi.com",
    },
    cover: "rumahBerbagiLogo",
    tags: [],
  },
  {
    name: "WargaBantuWarga",
    description:
      "A crowdsourcing website for COVID-19 medical facilities information.",
    link: {
      href: "https://www.wargabantuwarga.com",
      label: "www.wargabantuwarga.com",
    },
    cover: "wbwLogo",
    tags: [],
  },
  {
    name: "KawalCOVID19",
    description:
      "A website portal for one-stop information on COVID-19 in Indonesia.",
    link: { href: "https://kawalcovid19.id", label: "kawalcovid19.id" },
    cover: "kawalcovid19Logo",
    tags: [],
  },
] satisfies Project[];
export type { Project };
